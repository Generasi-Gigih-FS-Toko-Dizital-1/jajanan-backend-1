import { type UserSubscription } from '@prisma/client'
import type UserSubscriptionRepository from '../../../outers/repositories/UserSubscriptionRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type UserSubscriptionManagementCreateRequest
  from '../../models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementCreateRequest'
import { randomUUID } from 'crypto'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type UserSubscriptionManagementPatchRequest
  from '../../models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementPatchRequest'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class UserSubscriptionManagement {
  userSubscriptionRepository: UserSubscriptionRepository
  objectUtility: ObjectUtility

  constructor (userSubscriptionRepository: UserSubscriptionRepository, objectUtility: ObjectUtility) {
    this.userSubscriptionRepository = userSubscriptionRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<UserSubscription[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundUserSubscriptions: UserSubscription[] = await this.userSubscriptionRepository.readMany(args)
    return new Result<UserSubscription[]>(
      200,
      'User Subscriptions read many succeed.',
      foundUserSubscriptions
    )
  }

  readManyByIds = async (ids: string[]): Promise<Result<UserSubscription[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      { id: { in: ids } },
      undefined,
      undefined
    )
    const foundUserSubscriptions: UserSubscription[] = await this.userSubscriptionRepository.readMany(args)

    if (foundUserSubscriptions.length !== ids.length) {
      return new Result<UserSubscription[]>(
        404,
        'User Subscriptions read many by ids failed, some user subscription ids is not found.',
        foundUserSubscriptions
      )
    }

    return new Result<UserSubscription[]>(
      200,
      'User Subscriptions read many by ids succeed.',
      foundUserSubscriptions
    )
  }

  readOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
    let foundUserSubscription: UserSubscription
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundUserSubscription = await this.userSubscriptionRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'User Subscription read one by id failed, user subscription is not found.',
        null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription read one by id succeed.',
      foundUserSubscription
    )
  }

  readOneByUserIdAndCategoryId = async (userId: string, categoryId: string): Promise<Result<UserSubscription | null>> => {
    let foundUserSubscription: UserSubscription
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { userId, categoryId },
        undefined,
        undefined
      )
      foundUserSubscription = await this.userSubscriptionRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'User Subscription read one by user id and category id failed, user subscription is not found.',
        null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription read one by user id and category id succeed.',
      foundUserSubscription
    )
  }

  createOne = async (request: UserSubscriptionManagementCreateRequest): Promise<Result<UserSubscription | null>> => {
    const userSubscriptionToCreate: UserSubscription = {
      id: randomUUID(),
      userId: request.userId,
      categoryId: request.categoryId,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdUserSubscription: Result<UserSubscription | null> = await this.createOneRaw(userSubscriptionToCreate)
    if (createdUserSubscription.status !== 201 || createdUserSubscription.data === null) {
      return new Result<null>(
        createdUserSubscription.status,
        `User Subscription create one failed, ${createdUserSubscription.message}`,
        null
      )
    }
    return new Result<UserSubscription>(
      201,
      'User Subscription create one succeed.',
      createdUserSubscription.data
    )
  }

  createOneRaw = async (userSubscription: UserSubscription): Promise<Result<UserSubscription | null>> => {
    let createdUserSubscription: UserSubscription
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        userSubscription
      )
      createdUserSubscription = await this.userSubscriptionRepository.createOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        `User Subscription create one failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<UserSubscription>(
      201,
      'User Subscription create one succeed.',
      createdUserSubscription
    )
  }

  patchOneById = async (id: string, request: UserSubscriptionManagementPatchRequest): Promise<Result<UserSubscription | null>> => {
    const patchedUserSubscription: Result<UserSubscription | null> = await this.patchOneRawById(id, request)
    if (patchedUserSubscription.status !== 200 || patchedUserSubscription.data === null) {
      return new Result<null>(
        patchedUserSubscription.status,
            `User Subscription patch one failed, ${patchedUserSubscription.message}`,
            null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription patch one succeed.',
      patchedUserSubscription.data
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<UserSubscription | null>> => {
    const foundUserSubscription: Result<UserSubscription | null> = await this.readOneById(id)
    if (foundUserSubscription.status !== 200 || foundUserSubscription.data === null) {
      return new Result<null>(
        404,
        'User Subscription patch one raw by id failed, user subscription is not found.',
        null
      )
    }
    this.objectUtility.patch(foundUserSubscription.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundUserSubscription.data
    )
    const patchedUserSubscription: UserSubscription = await this.userSubscriptionRepository.patchOne(args)
    return new Result<UserSubscription>(
      200,
      'User Subscription patch one raw by id succeed.',
      patchedUserSubscription
    )
  }

  deleteHardOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
    let deletedUserSubscription: UserSubscription
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedUserSubscription = await this.userSubscriptionRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'UserSubscription delete hard one by id failed, user subscription is not found.',
        null
      )
    }
    return new Result<UserSubscription>(
      200,
      'UserSubscription delete hard one by id succeed.',
      deletedUserSubscription
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
    let deletedUserSubscription: UserSubscription
    try {
      const foundUserSubscription: Result<UserSubscription | null> = await this.readOneById(id)
      if (foundUserSubscription.status !== 200 || foundUserSubscription.data === null) {
        return new Result<null>(
          foundUserSubscription.status,
          'UserSubscription delete soft one by id failed, user subscription is not found.',
          null
        )
      }

      foundUserSubscription.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundUserSubscription.data
      )
      deletedUserSubscription = await this.userSubscriptionRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'UserSubscription delete soft one by id failed, user subscription is not found.',
        null
      )
    }
    return new Result<UserSubscription>(
      200,
      'UserSubscription delete soft one by id succeed.',
      deletedUserSubscription
    )
  }

  deleteOneByUserIdandCategoryId = async (userId: string, categoryId: string): Promise<Result<UserSubscription | null>> => {
    let deletedUserSubscription: UserSubscription
    try {
      const foundUserSubscription: Result<UserSubscription | null> = await this.readOneByUserIdAndCategoryId(userId, categoryId)
      if (foundUserSubscription.status !== 200 || foundUserSubscription.data === null) {
        return new Result<null>(
          404,
          'User Subscription delete one raw by user id and category id failed, user subscription is not found.',
          null
        )
      }
      const foundUserSubscriptionId: string = foundUserSubscription.data.id

      const deleteOneArgs: RepositoryArgument = new RepositoryArgument(
        { id: foundUserSubscriptionId },
        undefined,
        undefined,
        undefined
      )

      deletedUserSubscription = await this.userSubscriptionRepository.deleteOne(deleteOneArgs)
    } catch (error) {
      return new Result<null>(
        500,
        'UserSubscription delete one by UserId and CategoryId failed',
        null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription delete one by UserId and CategoryId succeed.',
      deletedUserSubscription
    )
  }
}
