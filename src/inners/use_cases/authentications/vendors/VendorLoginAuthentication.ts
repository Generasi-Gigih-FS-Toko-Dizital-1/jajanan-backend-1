import type { Vendor } from '@prisma/client'
import { randomUUID } from 'crypto'
import type VendorLoginByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import Result from '../../../models/value_objects/Result'
import type VendorManagement from '../../managements/VendorManagement'
import type SessionManagement from '../../managements/SessionManagement'
import Session from '../../../models/value_objects/Session'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'

export default class VendorLoginAuthentication {
  vendorManagement: VendorManagement
  sessionManagement: SessionManagement

  constructor (vendorManagement: VendorManagement, sessionManagement: SessionManagement) {
    this.vendorManagement = vendorManagement
    this.sessionManagement = sessionManagement
  }

  loginByEmailAndPassword = async (request: VendorLoginByEmailAndPasswordRequest): Promise<Result<Session | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'Vendor login by email and password failed, bcrypt salt is undefined.',
        null
      )
    }
    const foundVendorByEmailAndPassword: Result<Vendor | null> = await this.vendorManagement.readOneByEmailAndPassword(
      request.email,
      bcrypt.hashSync(request.password, salt)
    )
    if (foundVendorByEmailAndPassword.status !== 200 || foundVendorByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'Vendor login by email and password failed, vendor is not found.',
        null
      )
    }

    const jwtSecret: string | undefined = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      return new Result<null>(
        500,
        'Vendor login by email and password failed, JWT secret is undefined.',
        null
      )
    }

    const jwtAccessTokenExpirationTime: string | undefined = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    if (jwtAccessTokenExpirationTime === undefined) {
      return new Result<null>(
        500,
        'Vendor login by email and password failed, JWT access token expiration time is undefined.',
        null
      )
    }
    const accessToken = jwt.sign(
      {
        accountId: foundVendorByEmailAndPassword.data.id,
        accountType: 'ADMIN'
      },
      jwtSecret,
      {
        expiresIn: Number(jwtAccessTokenExpirationTime)
      }
    )

    const sessionExpirationTime: string | undefined = process.env.JWT_SESSION_EXPIRATION_TIME
    if (sessionExpirationTime === undefined) {
      return new Result<null>(
        500,
        'Vendor login by email and password failed, session expiration time is undefined.',
        null
      )
    }

    const session: Session = new Session(
      foundVendorByEmailAndPassword.data.id,
      'VENDOR',
      accessToken,
      randomUUID(),
      moment().add(sessionExpirationTime, 'seconds').toDate()
    )

    const authorization: Authorization = new Authorization(
      session.accessToken,
      'Bearer'
    )
    const authorizationString: string = JSON.stringify(authorization)
    const id: string = bcrypt.hashSync(authorizationString, salt)

    let setSession: Result<null>
    try {
      setSession = await this.sessionManagement.setOneById(id, session)
    } catch (error) {
      return new Result<null>(
        500,
          `Vendor login by email and password failed, ${(error as Error).message}`,
          null
      )
    }

    if (setSession.status !== 200) {
      return new Result<null>(
        500,
        'Vendor login by email and password failed, set session failed.',
        null
      )
    }

    return new Result<Session>(
      200,
      'Vendor login by email and password succeed.',
      session
    )
  }
}
