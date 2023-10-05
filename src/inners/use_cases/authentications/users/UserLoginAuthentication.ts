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
import Authorization from '../../../models/value_objects/Authorization'
import bcrypt from 'bcrypt'

export default class UserLoginAuthentication {
  userManagement: UserManagement
  sessionManagement: SessionManagement

  constructor (userManagement: UserManagement, sessionManagement: SessionManagement) {
    this.userManagement = userManagement
    this.sessionManagement = sessionManagement
  }

  loginByEmailAndPassword = async (request: UserLoginByEmailAndPasswordRequest): Promise<Result<Session | null>> => {
    const foundUserByEmailAndPassword: Result<User | null> = await this.userManagement.readOneByEmailAndPassword(
      request.email,
      request.password
    )
    if (foundUserByEmailAndPassword.status !== 200 || foundUserByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'User login by email and password failed, user is not found.',
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
        accountType: 'USER'
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
        'User login by email and password failed, JWT refresh token expiration time is undefined.',
        null
      )
    }

    const session: Session = new Session(
      foundUserByEmailAndPassword.data.id,
      'USER',
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
        'User login by email and password failed, bcrypt salt is undefined.',
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
