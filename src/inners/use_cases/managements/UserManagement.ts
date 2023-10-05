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

  readOneById = async (id: string): Promise<Result<User>> => {
    const foundUser: User = await this.userRepository.readOneById(id)
    return new Result<User>(
      200,
      'User read one by id succeed.',
      foundUser
    )
  }

  readOneByUsername = async (username: string): Promise<Result<User>> => {
    const foundUser: User = await this.userRepository.readOneByUsername(username)
    return new Result<User>(
      200,
      'User read one by username succeed.',
      foundUser
    )
  }

  readOneByEmail = async (email: string): Promise<Result<User>> => {
    const foundUser: User = await this.userRepository.readOneByEmail(email)
    return new Result<User>(
      200,
      'User read one by email succeed.',
      foundUser
    )
  }

  readOneByUsernameAndPassword = async (username: string, password: string): Promise<Result<User>> => {
    const foundUser: User = await this.userRepository.readOneByUsernameAndPassword(username, password)
    return new Result<User>(
      200,
      'User read one by username and password succeed.',
      foundUser
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<User>> => {
    const foundUser: User = await this.userRepository.readOneByEmailAndPassword(email, password)
    return new Result<User>(
      200,
      'User read one by email and password succeed.',
      foundUser
    )
  }

  createOne = async (request: UserManagementCreateRequest): Promise<Result<User>> => {
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
    const createdUser: any = await this.userRepository.createOne(userToCreate)
    return new Result<User>(
      201,
      'User create one succeed.',
      createdUser
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

  patchOneById = async (id: string, request: UserManagementPatchRequest): Promise<Result<User>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    if (request.password !== undefined) {
      request.password = bcrypt.hashSync(request.password, salt)
    }

    const foundUser: Result<User> = await this.readOneById(id)
    this.objectUtility.patch(foundUser.data, request)
    const patchedUser: User = await this.userRepository.patchOneById(id, foundUser.data)
    return new Result<User>(
      200,
      'User patch one by id succeed.',
      patchedUser
    )
  }

  deleteOneById = async (id: string): Promise<Result<User>> => {
    const deletedUser: any = await this.userRepository.deleteOneById(id)
    return new Result<User>(
      200,
      'User delete one by id succeed.',
      deletedUser
    )
  }
}
