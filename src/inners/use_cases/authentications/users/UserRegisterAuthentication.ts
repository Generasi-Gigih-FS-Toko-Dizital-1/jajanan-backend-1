import { type User } from '@prisma/client'
import { randomUUID } from 'crypto'
import type UserRegisterByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/users/UserRegisterByEmailAndPasswordRequest'
import Result from '../../../models/value_objects/Result'
import type UserManagement from '../../managements/UserManagement'
import bcrypt from 'bcrypt'

export default class UserRegisterAuthentication {
  userManagement: UserManagement

  constructor (userManagement: UserManagement) {
    this.userManagement = userManagement
  }

  registerByEmailAndPassword = async (request: UserRegisterByEmailAndPasswordRequest): Promise<Result<User | null>> => {
    const foundUserByEmail: Result<User | null> = await this.userManagement.readOneByEmail(request.email)
    if (foundUserByEmail.status === 200 && foundUserByEmail.data !== null) {
      return new Result<null>(
        409,
        'User register by email and password failed, email already exists.',
        null
      )
    }

    const foundUserByUsername: Result<User | null> = await this.userManagement.readOneByUsername(request.username)
    if (foundUserByUsername.status === 200 && foundUserByUsername.data !== null) {
      return new Result<null>(
        409,
        'User register by email and password failed, username already exists.',
        null
      )
    }

    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'User register by email and password failed, bcrypt salt is undefined.',
        null
      )
    }

    const userToCreate: User = {
      id: randomUUID(),
      fullName: request.fullName,
      gender: request.gender,
      address: request.address,
      email: request.email,
      password: bcrypt.hashSync(request.password, salt),
      username: request.username,
      balance: 0,
      experience: 0,
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdUser: Result<User> = await this.userManagement.createOneRaw(userToCreate)

    return new Result<User>(
      201,
      'User register by email and password succeed.',
      createdUser.data
    )
  }
}
