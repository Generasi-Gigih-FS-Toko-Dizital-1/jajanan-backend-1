import type { Admin } from '@prisma/client'
import Result from '../../../models/value_objects/Result'
import type AdminManagement from '../../managements/AdminManagement'
import type SessionManagement from '../../managements/SessionManagement'
import Session from '../../../models/value_objects/Session'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'
import type AdminRefreshAccessTokenRequest
  from '../../../models/value_objects/requests/authentications/admins/AdminRefreshAccessTokenRequest'
import _ from 'underscore'

export default class AdminRefreshAuthentication {
  adminManagement: AdminManagement
  sessionManagement: SessionManagement

  constructor (adminManagement: AdminManagement, sessionManagement: SessionManagement) {
    this.adminManagement = adminManagement
    this.sessionManagement = sessionManagement
  }

  refreshAccessToken = async (request: AdminRefreshAccessTokenRequest): Promise<Result<Session | null>> => {
    const foundAdminById: Result<Admin | null> = await this.adminManagement.readOneById(
      request.session.accountId
    )
    if (foundAdminById.status !== 200 || foundAdminById.data === null) {
      return new Result<null>(
        404,
        'Admin refresh access token failed, admin not found.',
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
        'Admin refresh access token failed, bcrypt salt is undefined.',
        null
      )
    }

    const authorizationString: string = JSON.stringify(oldAuthorization)
    const oldId: string = bcrypt.hashSync(authorizationString, salt)

    const oldSession: Result<Session | null> = await this.sessionManagement.readOneById(oldId)
    if (oldSession.status !== 200 || oldSession.data === null) {
      return new Result<null>(
        404,
        'Admin refresh access token failed, unknown session.',
        null
      )
    }

    if (!_.isEqual(JSON.parse(JSON.stringify(oldSession.data)), JSON.parse(JSON.stringify(request.session)))) {
      return new Result<null>(
        404,
        'Admin refresh access token failed, session did not match.',
        null
      )
    }

    if (moment().isAfter(moment(oldSession.data.expiredAt))) {
      return new Result<null>(
        404,
        'Admin refresh access token failed, session is expired.',
        null
      )
    }

    try {
      await this.sessionManagement.deleteOneById(oldId)
    } catch (error) {
      return new Result<null>(
        500,
          `Admin refresh access token failed, ${(error as Error).message}`,
          null
      )
    }

    const jwtSecret: string | undefined = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      return new Result<null>(
        500,
        'Admin refresh access token failed, JWT secret is undefined.',
        null
      )
    }

    const jwtAccessTokenExpirationTime: string | undefined = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    if (jwtAccessTokenExpirationTime === undefined) {
      return new Result<null>(
        500,
        'Admin refresh access token failed, JWT access token expiration time is undefined.',
        null
      )
    }
    const newAccessToken = jwt.sign(
      {
        accountId: foundAdminById.data.id,
        accountType: request.session.accountType
      },
      jwtSecret,
      {
        expiresIn: Number(jwtAccessTokenExpirationTime)
      }
    )

    const newSession: Session = new Session(
      foundAdminById.data.id,
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
        `Admin refresh access token failed, ${(error as Error).message}`,
        null
      )
    }

    if (setSession.status !== 200) {
      return new Result<null>(
        500,
        'Admin refresh access token failed, set session failed.',
        null
      )
    }

    return new Result<Session>(
      200,
      'Admin refresh access token succeed.',
      newSession
    )
  }
}
