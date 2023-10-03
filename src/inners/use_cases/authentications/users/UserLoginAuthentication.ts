import type { User } from '@prisma/client'
import { randomUUID } from 'crypto'
import type UserLoginByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/users/UserLoginByEmailAndPasswordRequest'
import Result from '../../../models/value_objects/Result'
import type UserManagement from '../../managements/UserManagement'
import type SessionManagement from '../../managements/SessionManagement'
import Session from '../../../models/value_objects/Session'
import jwt from 'jsonwebtoken'
import moment from 'moment'

export default class UserLoginAuthentication {
  userManagement: UserManagement
  sessionManagement: SessionManagement

  constructor (userManagement: UserManagement, sessionManagement: SessionManagement) {
    this.userManagement = userManagement
    this.sessionManagement = sessionManagement
  }

  loginByEmailAndPassword = async (request: UserLoginByEmailAndPasswordRequest): Promise<Result<Session | null>> => {
    let foundUserByEmailAndPassword: Result<User>
    try {
      foundUserByEmailAndPassword = await this.userManagement.readOneByEmailAndPassword(
        request.email,
        request.password
      )
    } catch (error) {
      return new Result<null>(
        404,
        'User login by email and password failed, unknown email or password.',
        null
      )
    }

    const jwtSecret: string | undefined = process.env.JWT_SECRET
    if (jwtSecret === undefined) {
      return new Result<null>(
        500,
        'User login by email and password failed, JWT secret is undefined.',
        null
      )
    }

    const jwtAccessTokenExpirationTime: string | undefined = process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
    if (jwtAccessTokenExpirationTime === undefined) {
      return new Result<null>(
        500,
        'User login by email and password failed, JWT access token expiration time is undefined.',
        null
      )
    }
    const accessToken = jwt.sign(
      {
        accountId: foundUserByEmailAndPassword.data.id,
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
        'User login by email and password failedw, JWT refresh token expiration time is undefined.',
        null
      )
    }

    const session: Session = new Session(
      foundUserByEmailAndPassword.data.id,
      'ADMIN',
      accessToken,
      randomUUID(),
      moment().add(jwtRefreshTokenExpirationTime, 'seconds').toDate()
    )

    let setSession: Result<null>
    try {
      setSession = await this.sessionManagement.setOne(session)
    } catch (error) {
      return new Result<null>(
        500,
          `User login by email and password failed, ${(error as Error).message}`,
          null
      )
    }

    if (setSession.status !== 200) {
      return new Result<null>(
        500,
        'User login by email and password failed, set session failed.',
        null
      )
    }

    return new Result<Session>(
      200,
      'User login by email and password succeed.',
      session
    )
  }
}
