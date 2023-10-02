import { type Admin } from '@prisma/client'
import { randomUUID } from 'crypto'
import type AdminRegisterByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/admins/AdminRegisterByEmailAndPasswordRequest'
import bcrypt from 'bcrypt'
import Result from '../../../models/value_objects/Result'
import type AdminManagement from '../../managements/AdminManagement'

export default class AdminRegisterAuthentication {
  adminManagement: AdminManagement

  constructor (adminManagement: AdminManagement) {
    this.adminManagement = adminManagement
  }

  registerByEmailAndPassword = async (request: AdminRegisterByEmailAndPasswordRequest): Promise<Result<Admin | null>> => {
    let isAdminEmailFound: boolean
    try {
      await this.adminManagement.readOneByEmail(request.email)
      isAdminEmailFound = true
    } catch (error) {
      isAdminEmailFound = false
    }

    if (isAdminEmailFound) {
      return new Result<null>(
        409,
        'Register by email and password failed, email already exists.',
        null
      )
    }

    const salt = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('BCRYPT_SALT is undefined')
    }

    const adminToCreate: Admin = {
      id: randomUUID(),
      fullName: request.fullName,
      gender: request.gender,
      email: request.email,
      password: bcrypt.hashSync(request.password, salt),
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdAdmin: Result<Admin> = await this.adminManagement.createOne(adminToCreate)

    return new Result<Admin>(
      201,
      'Register by email and password succeed.',
      createdAdmin.data
    )
  }
}
