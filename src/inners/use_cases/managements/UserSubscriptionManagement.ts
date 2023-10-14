import { type UserSubscription } from '@prisma/client'
import type UserSubscriptionRepository from '../../../outers/repositories/UserSubscriptionRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { randomUUID } from 'crypto'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type UserSubscriptionManagementCreateRequest from '../../models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementCreateRequest'
import type UserSubscriptionManagementPatchRequest from '../../models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementPatchRequest'

export default class UserSubscriptionManagement {
  userSubscriptionRepository: UserSubscriptionRepository
  objectUtility: ObjectUtility

  constructor (userSubscriptionRepository: UserSubscriptionRepository, objectUtility: ObjectUtility) {
    this.userSubscriptionRepository = userSubscriptionRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<UserSubscription[]>> => {
    const foundUserSubscriptions: UserSubscription[] = await this.userSubscriptionRepository.readMany(pagination, whereInput, includeInput)
    return new Result<UserSubscription[]>(
      200,
      'User Subscriptions read many succeed.',
      foundUserSubscriptions
    )
  }

  readOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
    let foundUserSubscription: UserSubscription
    try {
      foundUserSubscription = await this.userSubscriptionRepository.readOneById(id)
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
      createdUserSubscription = await this.userSubscriptionRepository.createOne(userSubscription)
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

  patchOneRawById = async (id: string, request: UserSubscriptionManagementPatchRequest): Promise<Result<UserSubscription | null>> => {
    const foundUserSubscription: Result<UserSubscription | null> = await this.readOneById(id)
    if (foundUserSubscription.status !== 200 || foundUserSubscription.data === null) {
      return new Result<null>(
        404,
        'User Subscription patch one raw by id failed, user subscription is not found.',
        null
      )
    }
    this.objectUtility.patch(foundUserSubscription.data, request)
    const patchedUserSubscription: UserSubscription = await this.userSubscriptionRepository.patchOneById(id, foundUserSubscription.data)
    return new Result<UserSubscription>(
      200,
      'User Subscription patch one raw by id succeed.',
      patchedUserSubscription
    )
  }

  deleteOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
    let deletedUserSubscription: UserSubscription
    try {
      deletedUserSubscription = await this.userSubscriptionRepository.deleteOneById(id)
    } catch (error) {
      return new Result<null>(
        500,
        'UserSubscription delete one by id failed',
        null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription delete one by id succeed.',
      deletedUserSubscription
    )
  }
}
