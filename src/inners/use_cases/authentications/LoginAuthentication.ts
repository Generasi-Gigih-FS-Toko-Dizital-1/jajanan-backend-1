import type UserManagement from '../managements/UserManagement'
import type { User } from '@prisma/client'
import Result from '../../models/value_objects/Result'
import type LoginByEmailAndPasswordRequest
  from '../../models/value_objects/requests/authentications/LoginByEmailAndPasswordRequest'
import { randomUUID } from 'crypto'

export default class LoginAuthentication {
  userManagement: UserManagement

  constructor (userManagement: UserManagement) {
    this.userManagement = userManagement
  }

  loginByEmailAndPassword = async (request: LoginByEmailAndPasswordRequest): Promise<Result<string | null>> => {
    const foundUserByEmailAndPassword: Result<User | null> = await this.userManagement.readOneByEmailAndPassword(request.email, request.password)
    if (foundUserByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'Login by username and password failed, unknown email or password.}',
        null
      )
    }

    return new Result<string>(
      200,
      'Login by username and password succeed.',
      randomUUID()
    )
  }
}
