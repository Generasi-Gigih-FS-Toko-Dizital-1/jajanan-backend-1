import type UserManagement from '../managements/UserManagement'

import Result from '../../models/value_objects/Result'
import { type User } from '@prisma/client'
import type RegisterUserRequest from '../../models/value_objects/requests/authentications/RegisterUserRequest'
import { randomUUID } from 'crypto'
import { $Enums } from '.prisma/client'

export default class RegisterAuthentication {
  userManagement: UserManagement

  constructor (userManagement: UserManagement) {
    this.userManagement = userManagement
  }

  registerByUsernameAndPassword = async (request: RegisterUserRequest): Promise<Result<User | null>> => {
    let isUserFound: boolean
    try {
      await this.userManagement.readOneByUsername(request.username)
      isUserFound = true
    } catch (error) {
      isUserFound = false
    }

    if (isUserFound) {
      return new Result<null>(
        409,
        'Register by username and password failed, username already exists.',
        null
      )
    }

    const toCreateUser: User = {
      id: randomUUID(),
      fullName: request.fullName,
      address: request.address,
      email: request.email,
      password: request.password,
      username: request.username,
      balance: request.balance,
      gender: request.gender,
      experience: request.experience,
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdUser: Result<User> = await this.userManagement.createOne(toCreateUser)

    return new Result<User>(
      201,
      'Register by username and password succeed.',
      createdUser.data
    )
  }
}
