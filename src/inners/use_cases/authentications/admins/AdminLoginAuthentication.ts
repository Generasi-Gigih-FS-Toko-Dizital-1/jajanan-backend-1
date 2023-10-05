import type { Admin } from '@prisma/client'
import { randomUUID } from 'crypto'
import type AdminLoginByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import Result from '../../../models/value_objects/Result'
import type AdminManagement from '../../managements/AdminManagement'
import type SessionManagement from '../../managements/SessionManagement'
import Session from '../../../models/value_objects/Session'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'

export default class AdminLoginAuthentication {
  adminManagement: AdminManagement
  sessionManagement: SessionManagement

  constructor (adminManagement: AdminManagement, sessionManagement: SessionManagement) {
    this.adminManagement = adminManagement
    this.sessionManagement = sessionManagement
  }

  loginByEmailAndPassword = async (request: AdminLoginByEmailAndPasswordRequest): Promise<Result<Session | null>> => {
    const foundAdminByEmailAndPassword: Result<Admin | null> = await this.adminManagement.readOneByEmailAndPassword(
      request.email,
      request.password
    )
    if (foundAdminByEmailAndPassword.status !== 200 || foundAdminByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'Admin login by email and password failed, admin is not found.',
        null
      )
    }

    const jwtSecret: string | undefined = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      return new Result<null>(
        500,
        'Admin login by email and password failed, JWT secret is undefined.',
        null
      )
    }

    const jwtAccessTokenExpirationTime: string | undefined = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    if (jwtAccessTokenExpirationTime === undefined) {
      return new Result<null>(
        500,
        'Admin login by email and password failed, JWT access token expiration time is undefined.',
        null
      )
    }
    const accessToken = jwt.sign(
      {
        accountId: foundAdminByEmailAndPassword.data.id,
        accountType: 'ADMIN'
      },
      jwtSecret,
      {
        expiresIn: Number(jwtAccessTokenExpirationTime)
      }
    )

    const jwtRefreshTokenExpirationTime: string | undefined = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
    if (jwtRefreshTokenExpirationTime === undefined) {
      return new Result<null>(
        500,
        'Admin login by email and password failed, JWT refresh token expiration time is undefined.',
        null
      )
    }

    const session: Session = new Session(
      foundAdminByEmailAndPassword.data.id,
      'ADMIN',
      accessToken,
      randomUUID(),
      moment().add(jwtRefreshTokenExpirationTime, 'seconds').toDate()
    )

    const authorization: Authorization = new Authorization(
      session.accessToken,
      'Bearer'
    )
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'Admin login by email and password failed, bcrypt salt is undefined.',
        null
      )
    }
    const authorizationString: string = JSON.stringify(authorization)
    const id: string = bcrypt.hashSync(authorizationString, salt)

    let setSession: Result<null>
    try {
      setSession = await this.sessionManagement.setOneById(id, session)
    } catch (error) {
      return new Result<null>(
        500,
        `Admin login by email and password failed, ${(error as Error).message}`,
        null
      )
    }

    if (setSession.status !== 200) {
      return new Result<null>(
        500,
        'Admin login by email and password failed, set session failed.',
        null
      )
    }

    return new Result<Session>(
      200,
      'Admin login by email and password succeed.',
      session
    )
  }
}
