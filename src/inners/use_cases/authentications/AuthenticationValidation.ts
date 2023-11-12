import type SessionManagement from '../managements/SessionManagement'
import Result from '../../models/value_objects/Result'
import type Session from '../../models/value_objects/Session'
import bcrypt from 'bcrypt'
import jwt, { type VerifyErrors } from 'jsonwebtoken'
import type Authorization from '../../models/value_objects/Authorization'
import _ from 'underscore'
import type UserManagement from '../managements/UserManagement'
import type VendorManagement from '../managements/VendorManagement'
import type AdminManagement from '../managements/AdminManagement'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type Admin, type User, type Vendor } from '@prisma/client'

export default class AuthenticationValidation {
  sessionManagement: SessionManagement
  userManagement: UserManagement
  vendorManagement: VendorManagement
  adminManagement: AdminManagement
  objectUtility: ObjectUtility

  constructor (sessionManagement: SessionManagement, userManagement: UserManagement, vendorManagement: VendorManagement, adminManagement: AdminManagement, objectUtility: ObjectUtility) {
    this.sessionManagement = sessionManagement
    this.userManagement = userManagement
    this.vendorManagement = vendorManagement
    this.adminManagement = adminManagement
    this.objectUtility = objectUtility
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

    const foundSessionByAuthorization: Result<Session | null> = await this.sessionManagement.readOneByAuthorizationId(id)

    if (foundSessionByAuthorization.status !== 200 || foundSessionByAuthorization.data === null) {
      return new Result<null>(
        foundSessionByAuthorization.status,
        'Validate authentication failed, found session by authorization is unknown.',
        null
      )
    }

    const foundSessionByAccountId: Result<Session | null> = await this.sessionManagement.readOneByAccountId(foundSessionByAuthorization.data.accountId)
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

    const accountType: string = foundSessionByAuthorization.data.accountType
    const accountId: string = foundSessionByAuthorization.data.accountId

    if (accountType === 'USER') {
      const foundUserById: Result<User | null> = await this.userManagement.readOneById(accountId)
      if (foundUserById.status !== 200 || foundUserById.data === null) {
        return new Result<null>(
          foundUserById.status,
          'Validate authentication failed, found user by id is unknown.',
          null
        )
      }
      if (foundUserById.data.deletedAt !== null) {
        return new Result<null>(
          404,
          'Validate authentication failed, user is soft deleted.',
          null
        )
      }
    } else if (accountType === 'VENDOR') {
      const foundVendorById: Result<Vendor | null> = await this.vendorManagement.readOneById(accountId)
      if (foundVendorById.status !== 200 || foundVendorById.data === null) {
        return new Result<null>(
          foundVendorById.status,
          'Validate authentication failed, found vendor by id is unknown.',
          null
        )
      }
      if (foundVendorById.data.deletedAt !== null) {
        return new Result<null>(
          404,
          'Validate authentication failed, vendor is soft deleted.',
          null
        )
      }
    } else if (accountType === 'ADMIN') {
      const foundAdminById: Result<Admin | null> = await this.adminManagement.readOneById(accountId)
      if (foundAdminById.status !== 200 || foundAdminById.data === null) {
        return new Result<null>(
          foundAdminById.status,
          'Validate authentication failed, found admin by id is unknown.',
          null
        )
      }
      if (foundAdminById.data.deletedAt !== null) {
        return new Result<null>(
          404,
          'Validate authentication failed, admin is soft deleted.',
          null
        )
      }
    } else {
      return new Result<null>(
        404,
        'Validate authentication failed, account type is unknown.',
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
