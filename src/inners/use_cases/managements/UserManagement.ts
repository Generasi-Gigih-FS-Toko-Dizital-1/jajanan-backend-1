import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type UserRepository from '../../../outers/repositories/UserRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { type User } from '@prisma/client'
import type UserManagementCreateRequest
  from '../../models/value_objects/requests/user_managements/UserManagementCreateRequest'
import type UserManagementPatchRequest
  from '../../models/value_objects/requests/user_managements/UserManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'

export default class UserManagement {
  userRepository: UserRepository
  objectUtility: ObjectUtility

  constructor (userRepository: UserRepository, objectUtility: ObjectUtility) {
    this.userRepository = userRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination): Promise<Result<User[]>> => {
    const foundUsers: User[] = await this.userRepository.readMany(pagination)
    return new Result<User[]>(
      200,
      'User read all succeed.',
      foundUsers
    )
  }

  readOneById = async (id: string): Promise<Result<User | null>> => {
    let foundUser: User
    try {
      foundUser = await this.userRepository.readOneById(id)
    } catch (error) {
      return new Result<null>(
        404,
        'User read one by id failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User read one by id succeed.',
      foundUser
    )
  }

  readOneByUsername = async (username: string): Promise<Result<User | null>> => {
    let foundUser: User
    try {
      foundUser = await this.userRepository.readOneByUsername(username)
    } catch (error) {
      return new Result<null>(
        404,
        'User read one by username failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User read one by username succeed.',
      foundUser
    )
  }

  readOneByEmail = async (email: string): Promise<Result<User | null>> => {
    let foundUser: User
    try {
      foundUser = await this.userRepository.readOneByEmail(email)
    } catch (error) {
      return new Result<null>(
        404,
        'User read one by email failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User read one by email succeed.',
      foundUser
    )
  }

  readOneByUsernameAndPassword = async (username: string, password: string): Promise<Result<User | null>> => {
    let foundUser: User
    try {
      foundUser = await this.userRepository.readOneByUsernameAndPassword(username, password)
    } catch (error) {
      return new Result<null>(
        404,
        'User read one by username and password failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User read one by username and password succeed.',
      foundUser
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<User | null>> => {
    let foundUser: User
    try {
      foundUser = await this.userRepository.readOneByEmailAndPassword(email, password)
    } catch (error) {
      return new Result<null>(
        404,
        'User read one by email and password failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User read one by email and password succeed.',
      foundUser
    )
  }

  createOne = async (request: UserManagementCreateRequest): Promise<Result<User | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const userToCreate: User = {
      id: randomUUID(),
      fullName: request.fullName,
      address: request.address,
      email: request.email,
      password: bcrypt.hashSync(request.password, salt),
      username: request.username,
      balance: 0,
      gender: request.gender,
      experience: 0,
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdUser: Result<User | null> = await this.createOneRaw(userToCreate)
    if (createdUser.status !== 201 || createdUser.data === null) {
      return new Result<null>(
        500,
        `User create one failed, ${createdUser.message}`,
        null
      )
    }
    return new Result<User>(
      201,
      'User create one succeed.',
      createdUser.data
    )
  }

  createOneRaw = async (user: User): Promise<Result<User>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const createdUser: any = await this.userRepository.createOne(user)
    return new Result<User>(
      201,
      'User create one raw succeed.',
      createdUser
    )
  }

  patchOneById = async (id: string, request: UserManagementPatchRequest): Promise<Result<User | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    request.password = bcrypt.hashSync(request.password, salt)

    const patchedUser: Result<User | null> = await this.patchOneRawById(id, request)
    if (patchedUser.status !== 200 || patchedUser.data === null) {
      return new Result<null>(
        patchedUser.status,
        `User patch one by id failed, ${patchedUser.message}`,
        null
      )
    }
    return new Result<User>(
      200,
      'User patch one by id succeed.',
      patchedUser.data
    )
  }

  patchOneRawById = async (id: string, request: UserManagementPatchRequest): Promise<Result<User | null>> => {
    const foundUser: Result<User | null> = await this.readOneById(id)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        404,
        'User patch one by id failed, user is not found.',
        null
      )
    }
    this.objectUtility.patch(foundUser.data, request)
    const patchedUser: User = await this.userRepository.patchOneById(id, foundUser.data)
    return new Result<User>(
      200,
      'User patch one by id succeed.',
      patchedUser
    )
  }

  deleteOneById = async (id: string): Promise<Result<User | null>> => {
    let deletedUser: User
    try {
      deletedUser = await this.userRepository.deleteOneById(id)
    } catch (error) {
      return new Result<null>(
        404,
        'User delete one by id failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User delete one by id succeed.',
      deletedUser
    )
  }
}
