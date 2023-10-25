import type SessionManagement from '../managements/SessionManagement'
import Result from '../../models/value_objects/Result'
import type Session from '../../models/value_objects/Session'
import bcrypt from 'bcrypt'
import jwt, { type VerifyErrors } from 'jsonwebtoken'
import type Authorization from '../../models/value_objects/Authorization'
import _ from 'underscore'

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

    const foundSessionByAuthorization: Result<Session | null> = await this.sessionManagement.readOneById(id)

    if (foundSessionByAuthorization.status !== 200 || foundSessionByAuthorization.data === null) {
      return new Result<null>(
        foundSessionByAuthorization.status,
        'Validate authentication failed, found session by authorization is unknown.',
        null
      )
    }

    const foundSessionByAccountId: Result<Session | null> = await this.sessionManagement.readOneById(foundSessionByAuthorization.data.accountId)
    if (foundSessionByAccountId.status !== 200 || foundSessionByAccountId.data === null) {
      return new Result<null>(
        foundSessionByAccountId.status,
        'Validate authentication failed, found session by account id is unknown.',
        null
      )
    }

    if (!_.isEqual(JSON.parse(JSON.stringify(foundSessionByAuthorization.data)), JSON.parse(JSON.stringify(foundSessionByAccountId.data)))) {
      return new Result<null>(
        404,
        'Validate authentication failed, session did not match.',
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
      await this.jwtVerifyAsync(foundSessionByAuthorization.data.accessToken, jwtSecret)
      return new Result<Session>(200, 'Validate authentication succeed.', foundSessionByAuthorization.data)
    } catch (error) {
      return new Result<null>(500, `Validate authentication failed, ${(error as VerifyErrors).message}.`, null)
    }
  }
}
