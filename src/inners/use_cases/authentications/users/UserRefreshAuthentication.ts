import type { User } from '@prisma/client'
import Result from '../../../models/value_objects/Result'
import type UserManagement from '../../managements/UserManagement'
import type SessionManagement from '../../managements/SessionManagement'
import Session from '../../../models/value_objects/Session'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'
import type UserRefreshAccessTokenRequest
  from '../../../models/value_objects/requests/authentications/users/UserRefreshAccessTokenRequest'
import _ from 'underscore'

export default class UserRefreshAuthentication {
  userManagement: UserManagement
  sessionManagement: SessionManagement

  constructor (userManagement: UserManagement, sessionManagement: SessionManagement) {
    this.userManagement = userManagement
    this.sessionManagement = sessionManagement
  }

  refreshAccessToken = async (request: UserRefreshAccessTokenRequest): Promise<Result<Session | null>> => {
    let foundUserById: Result<User>
    try {
      foundUserById = await this.userManagement.readOneById(
        request.session.accountId
      )
    } catch (error) {
      return new Result<null>(
        404,
        'User refresh access token failed, unknown email or password.',
        null
      )
    }

    const oldAuthorization: Authorization = new Authorization(
      request.session.accessToken,
      'Bearer'
    )

    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'User refresh access token failed, bcrypt salt is undefined.',
        null
      )
    }

    const authorizationString: string = JSON.stringify(oldAuthorization)
    const oldId: string = bcrypt.hashSync(authorizationString, salt)

    const oldSession: Result<Session | null> = await this.sessionManagement.readOneById(oldId)
    if (oldSession.status !== 200 || oldSession.data === null) {
      return new Result<null>(
        404,
        'User refresh access token failed, unknown session.',
        null
      )
    }

    if (!_.isEqual(JSON.parse(JSON.stringify(oldSession.data)), JSON.parse(JSON.stringify(request.session)))) {
      return new Result<null>(
        404,
        'User refresh access token failed, unknown session.',
        null
      )
    }

    if (moment().isAfter(moment(oldSession.data.expiredAt))) {
      return new Result<null>(
        404,
        'User refresh access token failed, refresh token is expired.',
        null
      )
    }

    try {
      await this.sessionManagement.deleteOneById(oldId)
    } catch (error) {
      return new Result<null>(
        500,
          `User refresh access token failed, ${(error as Error).message}`,
          null
      )
    }

    const jwtSecret: string | undefined = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      return new Result<null>(
        500,
        'User refresh access token failed, JWT secret is undefined.',
        null
      )
    }

    const jwtAccessTokenExpirationTime: string | undefined = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    if (jwtAccessTokenExpirationTime === undefined) {
      return new Result<null>(
        500,
        'User refresh access token failed, JWT access token expiration time is undefined.',
        null
      )
    }
    const newAccessToken = jwt.sign(
      {
        accountId: foundUserById.data.id,
        accountType: request.session.accountType
      },
      jwtSecret,
      {
        expiresIn: Number(jwtAccessTokenExpirationTime)
      }
    )

    const newSession: Session = new Session(
      foundUserById.data.id,
      oldSession.data.accountType,
      newAccessToken,
      oldSession.data.refreshToken,
      oldSession.data.expiredAt
    )

    const newAuthorization: Authorization = new Authorization(
      newSession.accessToken,
      'Bearer'
    )

    const newAuthorizationString: string = JSON.stringify(newAuthorization)
    const newId: string = bcrypt.hashSync(newAuthorizationString, salt)

    let setSession: Result<null>
    try {
      setSession = await this.sessionManagement.setOneById(newId, newSession)
    } catch (error) {
      return new Result<null>(
        500,
        `User refresh access token failed, ${(error as Error).message}`,
        null
      )
    }

    if (setSession.status !== 200) {
      return new Result<null>(
        500,
        'User refresh access token failed, set session failed.',
        null
      )
    }

    return new Result<Session>(
      200,
      'User refresh access token succeed.',
      newSession
    )
  }
}
