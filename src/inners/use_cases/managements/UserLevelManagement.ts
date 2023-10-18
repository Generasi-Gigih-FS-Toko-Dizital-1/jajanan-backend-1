import { type UserLevel } from '@prisma/client'
import type UserLevelRepository from '../../../outers/repositories/UserLevelRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { randomUUID } from 'crypto'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type UserLevelManagementPatchRequest
  from '../../models/value_objects/requests/managements/user_level_managements/UserLevelManagementCreateRequest'
import type UserLevelManagementCreateRequest
  from '../../models/value_objects/requests/managements/user_level_managements/UserLevelManagementPatchRequest'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class UserLevelManagement {
  userLevelRepository: UserLevelRepository
  objectUtility: ObjectUtility

  constructor (userLevelRepository: UserLevelRepository, objectUtility: ObjectUtility) {
    this.userLevelRepository = userLevelRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<UserLevel[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundUserLevels: UserLevel[] = await this.userLevelRepository.readMany(args)
    return new Result<UserLevel[]>(
      200,
      'User levels read many succeed.',
      foundUserLevels
    )
  }

  readOneById = async (id: string): Promise<Result<UserLevel | null>> => {
    let foundUserLevel: UserLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundUserLevel = await this.userLevelRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'User level read one by id failed, user level is not found.',
        null
      )
    }
    return new Result<UserLevel>(
      200,
      'User level read one by id succeed.',
      foundUserLevel
    )
  }

  createOne = async (request: UserLevelManagementCreateRequest): Promise<Result<UserLevel | null>> => {
    const userLevelToCreate: UserLevel = {
      id: randomUUID(),
      name: request.name,
      minimumExperience: request.minimumExperience,
      iconUrl: request.iconUrl,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdUserLevel: Result<UserLevel | null> = await this.createOneRaw(userLevelToCreate)
    if (createdUserLevel.status !== 201 || createdUserLevel.data === null) {
      return new Result<null>(
        createdUserLevel.status,
        `User level create one failed, ${createdUserLevel.message}`,
        null
      )
    }
    return new Result<UserLevel>(
      201,
      'User level create one succeed.',
      createdUserLevel.data
    )
  }

  createOneRaw = async (userLevel: UserLevel): Promise<Result<UserLevel | null>> => {
    let createdUserLevel: UserLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        userLevel
      )
      createdUserLevel = await this.userLevelRepository.createOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        `User level create one failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<UserLevel>(
      201,
      'User level create one succeed.',
      createdUserLevel
    )
  }

  patchOneById = async (id: string, request: UserLevelManagementPatchRequest): Promise<Result<UserLevel | null>> => {
    const patchedUserLevel: Result<UserLevel | null> = await this.patchOneRawById(id, request)
    if (patchedUserLevel.status !== 200 || patchedUserLevel.data === null) {
      return new Result<null>(
        patchedUserLevel.status,
            `User level patch one failed, ${patchedUserLevel.message}`,
            null
      )
    }
    return new Result<UserLevel>(
      200,
      'User level patch one succeed.',
      patchedUserLevel.data
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<UserLevel | null>> => {
    const foundUserLevel: Result<UserLevel | null> = await this.readOneById(id)
    if (foundUserLevel.status !== 200 || foundUserLevel.data === null) {
      return new Result<null>(
        404,
        'User level patch one raw by id failed, user level is not found.',
        null
      )
    }
    this.objectUtility.patch(foundUserLevel.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundUserLevel.data
    )
    const patchedUserLevel: UserLevel = await this.userLevelRepository.patchOne(args)
    return new Result<UserLevel>(
      200,
      'User level patch one raw by id succeed.',
      patchedUserLevel
    )
  }

  deleteOneById = async (id: string): Promise<Result<UserLevel | null>> => {
    let deletedUserLevel: UserLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedUserLevel = await this.userLevelRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        'UserLevel delete one by id failed',
        null
      )
    }
    return new Result<UserLevel>(
      200,
      'User level delete one by id succeed.',
      deletedUserLevel
    )
  }
}
