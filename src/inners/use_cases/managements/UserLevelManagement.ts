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
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined
    )
    const foundUserLevel: UserLevel | null = await this.userLevelRepository.readOne(args)

    if (foundUserLevel === null) {
      return new Result<null>(
        404,
        'User Level read one by id failed, user level is not found.',
        null
      )
    }

    return new Result<UserLevel>(
      200,
      'User level read one by id succeed.',
      foundUserLevel
    )
  }

  readOneByExperience = async (exp: number): Promise<Result<UserLevel | null>> => {
    let foundUserLevel: UserLevel | null
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        {
          minimumExperience: {
            lte: exp
          }
        },
        undefined,
        undefined,
        undefined,
        {
          minimumExperience: 'desc'
        }
      )
      foundUserLevel = await this.userLevelRepository.readOne(args)

      if (foundUserLevel === null) {
        const argsMinExp: RepositoryArgument = new RepositoryArgument(
          undefined,
          undefined,
          undefined,
          undefined,
          {
            minimumExperience: 'asc'
          }
        )
        foundUserLevel = await this.userLevelRepository.readOne(argsMinExp)
      }
    } catch (error) {
      return new Result<null>(
        404,
        `User Level read one by exp failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<UserLevel | null>(
      200,
      'User Level read one by exp succeed.',
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

  deleteHardOneById = async (id: string): Promise<Result<UserLevel | null>> => {
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
        404,
        'UserLevel delete hard one by id failed, user level is not found.',
        null
      )
    }
    return new Result<UserLevel>(
      200,
      'UserLevel delete hard one by id succeed.',
      deletedUserLevel
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<UserLevel | null>> => {
    let deletedUserLevel: UserLevel
    try {
      const foundUserLevel: Result<UserLevel | null> = await this.readOneById(id)
      if (foundUserLevel.status !== 200 || foundUserLevel.data === null) {
        return new Result<null>(
          foundUserLevel.status,
          'UserLevel delete soft one by id failed, user level is not found.',
          null
        )
      }

      foundUserLevel.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundUserLevel.data
      )
      deletedUserLevel = await this.userLevelRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'UserLevel delete soft one by id failed, user level is not found.',
        null
      )
    }
    return new Result<UserLevel>(
      200,
      'UserLevel delete soft one by id succeed.',
      deletedUserLevel
    )
  }
}
