import type { Admin } from '@prisma/client'
import { randomUUID } from 'crypto'
import type AdminLoginByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import Result from '../../../models/value_objects/Result'
import type AdminManagement from '../../managements/AdminManagement'

export default class AdminLoginAuthentication {
  adminManagement: AdminManagement

  constructor (adminManagement: AdminManagement) {
    this.adminManagement = adminManagement
  }

  loginByEmailAndPassword = async (request: AdminLoginByEmailAndPasswordRequest): Promise<Result<string | null>> => {
    const foundAdminByEmailAndPassword: Result<Admin | null> = await this.adminManagement.readOneByEmailAndPassword(request.email, request.password)
    if (foundAdminByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'Login by email and password failed, unknown email or password.}',
        null
      )
    }

    return new Result<string>(
      200,
      'Login by email and password succeed.',
      randomUUID()
    )
  }
}
