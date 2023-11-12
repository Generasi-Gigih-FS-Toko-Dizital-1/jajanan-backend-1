import type { Admin } from '@prisma/client'
import Result from '../../../models/value_objects/Result'
import type AdminManagement from '../../managements/AdminManagement'
import type SessionManagement from '../../managements/SessionManagement'
import type Session from '../../../models/value_objects/Session'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'
import type AdminRefreshAccessTokenRequest
  from '../../../models/value_objects/requests/authentications/admins/AdminRefreshAccessTokenRequest'
import _ from 'underscore'

export default class AdminLogoutAuthentication {
  adminManagement: AdminManagement
  sessionManagement: SessionManagement

  constructor (adminManagement: AdminManagement, sessionManagement: SessionManagement) {
    this.adminManagement = adminManagement
    this.sessionManagement = sessionManagement
  }

  logout = async (request: AdminRefreshAccessTokenRequest): Promise<Result<null>> => {
    const foundAdminById: Result<Admin | null> = await this.adminManagement.readOneById(
      request.session.accountId
    )
    if (foundAdminById.status !== 200 || foundAdminById.data === null) {
      return new Result<null>(
        404,
        'Admin logout failed, admin not found.',
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
        'Admin logout failed, bcrypt salt is undefined.',
        null
      )
    }

    const authorizationString: string = JSON.stringify(oldAuthorization)
    const oldId: string = bcrypt.hashSync(authorizationString, salt)

    const oldSession: Result<Session | null> = await this.sessionManagement.readOneByAuthorizationId(oldId)
    if (oldSession.status !== 200 || oldSession.data === null) {
      return new Result<null>(
        404,
        'Admin logout failed, unknown session.',
        null
      )
    }

    if (!_.isEqual(JSON.parse(JSON.stringify(oldSession.data)), JSON.parse(JSON.stringify(request.session)))) {
      return new Result<null>(
        404,
        'Admin logout failed, session did not match.',
        null
      )
    }

    const deletedSession: Result<Session | null> = await this.sessionManagement.deleteOneById(oldId)

    if (deletedSession.status !== 200) {
      return new Result<null>(
        deletedSession.status,
            `Admin logout failed, ${deletedSession.message}`,
            null
      )
    }

    return new Result<null>(
      200,
      'Admin logout succeed.',
      null
    )
  }
}
