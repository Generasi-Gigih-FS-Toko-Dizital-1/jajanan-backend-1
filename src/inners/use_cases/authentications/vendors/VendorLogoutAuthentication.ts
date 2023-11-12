import type { Vendor } from '@prisma/client'
import Result from '../../../models/value_objects/Result'
import type VendorManagement from '../../managements/VendorManagement'
import type SessionManagement from '../../managements/SessionManagement'
import type Session from '../../../models/value_objects/Session'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'
import type VendorRefreshAccessTokenRequest
  from '../../../models/value_objects/requests/authentications/vendors/VendorRefreshAccessTokenRequest'
import _ from 'underscore'

export default class VendorLogoutAuthentication {
  vendorManagement: VendorManagement
  sessionManagement: SessionManagement

  constructor (vendorManagement: VendorManagement, sessionManagement: SessionManagement) {
    this.vendorManagement = vendorManagement
    this.sessionManagement = sessionManagement
  }

  logout = async (request: VendorRefreshAccessTokenRequest): Promise<Result<null>> => {
    const foundVendorById: Result<Vendor | null> = await this.vendorManagement.readOneById(
      request.session.accountId
    )
    if (foundVendorById.status !== 200 || foundVendorById.data === null) {
      return new Result<null>(
        404,
        'Vendor logout failed, vendor not found.',
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
        'Vendor logout failed, bcrypt salt is undefined.',
        null
      )
    }

    const authorizationString: string = JSON.stringify(oldAuthorization)
    const oldId: string = bcrypt.hashSync(authorizationString, salt)

    const oldSession: Result<Session | null> = await this.sessionManagement.readOneByAuthorizationId(oldId)
    if (oldSession.status !== 200 || oldSession.data === null) {
      return new Result<null>(
        404,
        'Vendor logout failed, unknown session.',
        null
      )
    }

    if (!_.isEqual(JSON.parse(JSON.stringify(oldSession.data)), JSON.parse(JSON.stringify(request.session)))) {
      return new Result<null>(
        404,
        'Vendor logout failed, session did not match.',
        null
      )
    }

    const deletedSession: Result<Session | null> = await this.sessionManagement.deleteOneById(oldId)

    if (deletedSession.status !== 200) {
      return new Result<null>(
        deletedSession.status,
            `Vendor logout failed, ${deletedSession.message}`,
            null
      )
    }

    return new Result<null>(
      200,
      'Vendor logout succeed.',
      null
    )
  }
}
