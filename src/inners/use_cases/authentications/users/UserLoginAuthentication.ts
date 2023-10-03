import type { User } from '@prisma/client'
import { randomUUID } from 'crypto'
import type UserManagement from '../../managements/UserManagement'
import type UserLoginByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/users/UserLoginByEmailAndPasswordRequest'
import Result from '../../../models/value_objects/Result'

export default class UserLoginAuthentication {
  userManagement: UserManagement

  constructor (userManagement: UserManagement) {
    this.userManagement = userManagement
  }

  loginByEmailAndPassword = async (request: UserLoginByEmailAndPasswordRequest): Promise<Result<string | null>> => {
    const foundUserByEmailAndPassword: Result<User | null> = await this.userManagement.readOneByEmailAndPassword(request.email, request.password)
    if (foundUserByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'User login by username and password failed, unknown email or password.}',
        null
      )
    }

    return new Result<string>(
      200,
      'User login by username and password succeed.',
      randomUUID()
    )
  }
}
