import type { User } from '@prisma/client'
import Result from '../../../models/value_objects/Result'
import type UserManagement from '../../managements/UserManagement'
import type SessionManagement from '../../managements/SessionManagement'
import type Session from '../../../models/value_objects/Session'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'
import type UserRefreshAccessTokenRequest
  from '../../../models/value_objects/requests/authentications/users/UserRefreshAccessTokenRequest'
import _ from 'underscore'

export default class UserLogoutAuthentication {
  userManagement: UserManagement
  sessionManagement: SessionManagement

  constructor (userManagement: UserManagement, sessionManagement: SessionManagement) {
    this.userManagement = userManagement
    this.sessionManagement = sessionManagement
  }

  logout = async (request: UserRefreshAccessTokenRequest): Promise<Result<null>> => {
    const foundUserById: Result<User | null> = await this.userManagement.readOneById(
      request.session.accountId
    )
    if (foundUserById.status !== 200 || foundUserById.data === null) {
      return new Result<null>(
        404,
        'User logout failed, user not found.',
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
        'User logout failed, bcrypt salt is undefined.',
        null
      )
    }

    const authorizationString: string = JSON.stringify(oldAuthorization)
    const oldId: string = bcrypt.hashSync(authorizationString, salt)

    const oldSession: Result<Session | null> = await this.sessionManagement.readOneByAuthorizationId(oldId)
    if (oldSession.status !== 200 || oldSession.data === null) {
      return new Result<null>(
        404,
        'User logout failed, unknown session.',
        null
      )
    }

    if (!_.isEqual(JSON.parse(JSON.stringify(oldSession.data)), JSON.parse(JSON.stringify(request.session)))) {
      return new Result<null>(
        404,
        'User logout failed, session did not match.',
        null
      )
    }

    const deletedSession: Result<Session | null> = await this.sessionManagement.deleteOneById(oldId)

    if (deletedSession.status !== 200) {
      return new Result<null>(
        deletedSession.status,
            `User logout failed, ${deletedSession.message}`,
            null
      )
    }

    return new Result<null>(
      200,
      'User logout succeed.',
      null
    )
  }
}
