import type UserManagement from '../managements/UserManagement'

import Result from '../../models/value_objects/Result'
import { type User } from '@prisma/client'
import type RegisterByEmailAndPasswordRequest from '../../models/value_objects/requests/authentications/RegisterByEmailAndPasswordRequest'
import { randomUUID } from 'crypto'

export default class RegisterAuthentication {
  userManagement: UserManagement

  constructor (userManagement: UserManagement) {
    this.userManagement = userManagement
  }

  registerByEmailAndPassword = async (request: RegisterByEmailAndPasswordRequest): Promise<Result<User | null>> => {
    let isUserEmailFound: boolean
    try {
      await this.userManagement.readOneByEmail(request.email)
      isUserEmailFound = true
    } catch (error) {
      isUserEmailFound = false
    }

    if (isUserEmailFound) {
      return new Result<null>(
        409,
        'Register by email and password failed, email already exists.',
        null
      )
    }

    let isUserUsernameFound: boolean
    try {
      await this.userManagement.readOneByUsername(request.username)
      isUserUsernameFound = true
    } catch (error) {
      isUserUsernameFound = false
    }

    if (isUserUsernameFound) {
      return new Result<null>(
        409,
        'Register by email and password failed, username already exists.',
        null
      )
    }

    const userToCreate: User = {
      id: randomUUID(),
      fullName: request.fullName,
      gender: request.gender,
      address: request.address,
      email: request.email,
      password: request.password,
      username: request.username,
      balance: 0,
      experience: 0,
      lastLatitude: 0,
      lastLongitude: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdUser: Result<User> = await this.userManagement.createOne(userToCreate)

    return new Result<User>(
      201,
      'Register by email and password succeed.',
      createdUser.data
    )
  }
}
