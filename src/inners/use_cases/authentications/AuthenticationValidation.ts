import type SessionManagement from '../managements/SessionManagement'
import Result from '../../models/value_objects/Result'
import Session from '../../models/value_objects/Session'
import bcrypt from 'bcrypt'

import moment from 'moment'
import jwt, { TokenExpiredError, type VerifyErrors } from 'jsonwebtoken'

export default class AuthenticationValidation {
  sessionManagement: SessionManagement

  constructor (sessionManagement: SessionManagement) {
    this.sessionManagement = sessionManagement
  }

  jwtVerifyAsync = async (accessToken: string, secret: string): Promise<any> => {
    console.log(2)
    return await new Promise((resolve, reject) => {
      console.log(3)
      jwt.verify(accessToken, secret, (err, decoded) => {
        console.log(4)
        if (err != null) {
          console.log(5)
          reject(err); return
        }
        resolve(decoded)
      })
    })
  }

  validateSession = async (session: Session): Promise<Result<Session | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'Validate authentication failed, bcrypt salt is undefined.',
        null
      )
    }
    const sessionString: string = JSON.stringify(session)
    const id: string = bcrypt.hashSync(sessionString, salt)

    const foundSession: Result<Session | null> = await this.sessionManagement.readOneById(id)
    if (foundSession.status !== 200) {
      return new Result<null>(
        401,
        'Validate authentication failed, session is unknown.',
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

    if (foundSession.data === null) {
      return new Result<null>(500, 'Session is null.', null)
    }

    try {
      console.log(1)
      await this.jwtVerifyAsync(foundSession.data.accessToken, jwtSecret)
      console.log(6)
      return new Result<Session>(200, 'Validate authentication succeed.', foundSession.data)
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const jwtAccessTokenExpirationTime: string | undefined = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
        if (jwtAccessTokenExpirationTime === undefined) {
          return new Result<null>(500, 'JWT access token expiration time is undefined.', null)
        }

        const newAccessToken = jwt.sign(
          {
            accountId: foundSession.data.accountId,
            accountType: foundSession.data.accountType
          },
          jwtSecret,
          {
            expiresIn: Number(jwtAccessTokenExpirationTime)
          }
        )

        const newSession = new Session(
          foundSession.data.accountId,
          foundSession.data.accountType,
          newAccessToken,
          foundSession.data.refreshToken,
          moment().add(jwtAccessTokenExpirationTime, 'seconds').toDate()
        )

        const setSessionResult = await this.sessionManagement.setOne(newSession)
        if (setSessionResult.status !== 200 || setSessionResult.data === null) {
          return new Result<null>(500, 'Set session failed.', null)
        }

        return new Result<Session>(200, 'Validate authentication succeed.', newSession)
      }

      return new Result<null>(500, `Validate authentication failed, ${(error as VerifyErrors).message}.`, null)
    }
  }
}
