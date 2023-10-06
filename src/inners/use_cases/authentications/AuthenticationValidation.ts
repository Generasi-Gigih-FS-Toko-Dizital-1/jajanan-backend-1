import type SessionManagement from '../managements/SessionManagement'
import Result from '../../models/value_objects/Result'
import type Session from '../../models/value_objects/Session'
import bcrypt from 'bcrypt'
import jwt, { type VerifyErrors } from 'jsonwebtoken'
import type Authorization from '../../models/value_objects/Authorization'

export default class AuthenticationValidation {
  sessionManagement: SessionManagement

  constructor (sessionManagement: SessionManagement) {
    this.sessionManagement = sessionManagement
  }

  jwtVerifyAsync = async (accessToken: string, secret: string): Promise<any> => {
    return await new Promise((resolve, reject) => {
      jwt.verify(accessToken, secret, (err, decoded) => {
        if (err != null) {
          reject(err); return
        }
        resolve(decoded)
      })
    })
  }

  validateAuthorization = async (authorization: Authorization): Promise<Result<Session | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'Validate authentication failed, bcrypt salt is undefined.',
        null
      )
    }

    const authorizationString: string = JSON.stringify(authorization)
    const id: string = bcrypt.hashSync(authorizationString, salt)

    const foundSession: Result<Session | null> = await this.sessionManagement.readOneById(id)

    if (foundSession.status !== 200 || foundSession.data === null) {
      return new Result<null>(
        foundSession.status,
        'Validate authentication failed, authorization is unknown.',
        null
      )
    }

    const jwtSecret: string | undefined = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      return new Result<null>(
        500,
        'Validate authentication failed, JWT secret is undefined.',
        null
      )
    }
    try {
      await this.jwtVerifyAsync(foundSession.data.accessToken, jwtSecret)
      return new Result<Session>(200, 'Validate authentication succeed.', foundSession.data)
    } catch (error) {
      return new Result<null>(500, `Validate authentication failed, ${(error as VerifyErrors).message}.`, null)
    }
  }
}
