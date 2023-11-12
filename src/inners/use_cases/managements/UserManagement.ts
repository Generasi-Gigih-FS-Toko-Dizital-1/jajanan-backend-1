import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type UserRepository from '../../../outers/repositories/UserRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { type User } from '@prisma/client'
import type UserManagementCreateRequest
  from '../../models/value_objects/requests/managements/user_managements/UserManagementCreateRequest'
import type UserManagementPatchRequest
  from '../../models/value_objects/requests/managements/user_managements/UserManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type UserAggregate from '../../models/aggregates/UserAggregate'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class UserManagement {
  userRepository: UserRepository
  objectUtility: ObjectUtility

  constructor (userRepository: UserRepository, objectUtility: ObjectUtility) {
    this.userRepository = userRepository
    this.objectUtility = objectUtility
  }

  readManyByDistanceAndSubscribedVendorIds = async (distance: number, vendorIds: string[], include: any): Promise<Result<User[] | UserAggregate[]>> => {
    const foundUsers: User[] | UserAggregate[] = await this.userRepository.readManyByDistanceAndSubscribedVendorIds(distance, vendorIds, include)

    return new Result<User[] | UserAggregate[] >(
      200,
      'User read many by distance and subscribed vendor ids succeed.',
      foundUsers
    )
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<User[] | UserAggregate[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundUsers: User[] = await this.userRepository.readMany(args)
    return new Result<User[]>(
      200,
      'User read many succeed.',
      foundUsers
    )
  }

  readOneById = async (id: string): Promise<Result<User | null>> => {
    let foundUser: User
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundUser = await this.userRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { username },
        undefined,
        undefined,
        undefined
      )
      foundUser = await this.userRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { email },
        undefined,
        undefined,
        undefined
      )
      foundUser = await this.userRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { username, password },
        undefined,
        undefined,
        undefined
      )
      foundUser = await this.userRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { email, password },
        undefined,
        undefined,
        undefined
      )
      foundUser = await this.userRepository.readOne(args)
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
    const args: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      user
    )
    const createdUser: any = await this.userRepository.createOne(args)
    return new Result<User>(
      201,
      'User create one raw succeed.',
      createdUser
    )
  }

  patchOneById = async (id: string, request: UserManagementPatchRequest): Promise<Result<User | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'User patch one by id failed, salt is undefined.',
        null
      )
    }

    if (request.password !== undefined) {
      request.password = bcrypt.hashSync(request.password, salt)
    }
    request.oldPassword = bcrypt.hashSync(request.oldPassword, salt)

    const foundUser: Result<User | null> = await this.readOneById(id)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        foundUser.status,
        'User patch one by id failed, user is not found.',
        null
      )
    }

    if (request.oldPassword !== foundUser.data.password) {
      return new Result<null>(
        400,
        'User patch one by id failed, old password is not match to the current password.',
        null
      )
    }

    const { oldPassword, ...user } = request
    this.objectUtility.patch(foundUser.data, user)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundUser.data
    )
    let patchedUser: User
    try {
      patchedUser = await this.userRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        `User patch one by id failed, ${(error as Error).message}`,
        null
      )
    }

    return new Result<User>(
      200,
      'User patch one by id succeed.',
      patchedUser
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<User | null>> => {
    const foundUser: Result<User | null> = await this.readOneById(id)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        404,
        'User patch one by id failed, user is not found.',
        null
      )
    }
    this.objectUtility.patch(foundUser.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundUser.data
    )
    const patchedUser: User = await this.userRepository.patchOne(args)
    return new Result<User>(
      200,
      'User patch one by id succeed.',
      patchedUser
    )
  }

  deleteHardOneById = async (id: string): Promise<Result<User | null>> => {
    let deletedUser: User
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedUser = await this.userRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'User delete hard one by id failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User delete hard one by id succeed.',
      deletedUser
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<User | null>> => {
    let deletedUser: User
    try {
      const foundUser: Result<User | null> = await this.readOneById(id)
      if (foundUser.status !== 200 || foundUser.data === null) {
        return new Result<null>(
          foundUser.status,
          'User delete soft one by id failed, user is not found.',
          null
        )
      }

      foundUser.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundUser.data
      )
      deletedUser = await this.userRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'User delete soft one by id failed, user is not found.',
        null
      )
    }
    return new Result<User>(
      200,
      'User delete soft one by id succeed.',
      deletedUser
    )
  }
}
