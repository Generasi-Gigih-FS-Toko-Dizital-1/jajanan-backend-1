import type UserManagement from '../managements/UserManagement'
import type { User } from '@prisma/client'
import Result from '../../models/value_objects/Result'
import type LoginByUsernameAndPasswordRequest
  from '../../models/value_objects/requests/authentications/LoginByUsernameAndPasswordRequest'
import type LoginByEmailAndPasswordRequest
  from '../../models/value_objects/requests/authentications/LoginByEmailAndPasswordRequest'

export default class LoginAuthentication {
  userManagement: UserManagement

  constructor (userManagement: UserManagement) {
    this.userManagement = userManagement
  }

  loginByUsernameAndPassword = async (request: LoginByUsernameAndPasswordRequest): Promise<Result<User | null>> => {
    try {
      await this.userManagement.readOneByUsername(request.username)
    } catch (error) {
      return new Result<null>(
        404,
                `Login by username failed, unknown username: ${(error as Error).message}`,
                null
      )
    }

    let foundUserByUsernameAndPassword: Result<User | null>
    try {
      foundUserByUsernameAndPassword = await this.userManagement.readOneByUsernameAndPassword(request.username, request.password)
    } catch (error) {
      return new Result<null>(
        404,
                `Login by username and password failed, unknown username or password: ${(error as Error).message}`,
                null
      )
    }

    return new Result<User>(
      200,
      'Login by username and password succeed.',
      foundUserByUsernameAndPassword.data as User
    )
  }

  loginByEmailAndPassword = async (request: LoginByEmailAndPasswordRequest): Promise<Result<User | null>> => {
    try {
      await this.userManagement.readOneByUsername(request.email)
    } catch (error) {
      return new Result<null>(
        404,
          `Login by username failed, unknown username: ${(error as Error).message}`,
          null
      )
    }

    let foundUserByUsernameAndPassword: Result<User | null>
    try {
      foundUserByUsernameAndPassword = await this.userManagement.readOneByEmailAndPassword(request.email, request.password)
    } catch (error) {
      return new Result<null>(
        404,
          `Login by username and password failed, unknown username or password: ${(error as Error).message}`,
          null
      )
    }

    return new Result<User>(
      200,
      'Login by username and password succeed.',
      foundUserByUsernameAndPassword.data as User
    )
  }
}
