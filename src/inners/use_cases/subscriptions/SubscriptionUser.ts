import { randomUUID } from 'crypto'
import Result from '../../models/value_objects/Result'
import { type UserSubscription } from '@prisma/client'
import type UserSubscriptionManagement from '../managements/UserSubscriptionManagement'
import type UserSubscriptionCreateRequest from '../../models/value_objects/requests/subscriptions/UserSubscriptionCreateRequest'
import type UserSubscriptionDeleteOneRequest from '../../models/value_objects/requests/subscriptions/UserSubscriptionDeleteOneRequest'

export default class SubscriptionUser {
  userSubscriptionManagement: UserSubscriptionManagement

  constructor (
    userSubscriptionManagement: UserSubscriptionManagement
  ) {
    this.userSubscriptionManagement = userSubscriptionManagement
  }

  createOne = async (request: UserSubscriptionCreateRequest): Promise<Result<UserSubscription | null>> => {
    const userSubscriptionToCreate: UserSubscription = {
      id: randomUUID(),
      userId: request.userId,
      categoryId: request.categoryId,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdUserSubscription: Result<UserSubscription | null> = await this.userSubscriptionManagement.createOneRaw(userSubscriptionToCreate)
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

  deleteOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
    const deletedUserSubscription: Result<UserSubscription | null> = await this.userSubscriptionManagement.deleteOneById(id)
    if (deletedUserSubscription.status !== 200 || deletedUserSubscription.data === null) {
      return new Result<null>(
        deletedUserSubscription.status,
            `User Subscription delete one failed, ${deletedUserSubscription.message}`,
            null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription delete one succeed.',
      deletedUserSubscription.data
    )
  }

  deleteOneByUserIdandCategoryId = async (request: UserSubscriptionDeleteOneRequest): Promise<Result<UserSubscription | null>> => {
    const deletedUserSubscription: Result<UserSubscription | null> = await this.userSubscriptionManagement.deleteOneByUserIdandCategoryId(request.userId, request.categoryId)
    if (deletedUserSubscription.status !== 200 || deletedUserSubscription.data === null) {
      return new Result<null>(
        deletedUserSubscription.status,
            `User Subscription delete one failed, ${deletedUserSubscription.message}`,
            null
      )
    }
    return new Result<UserSubscription>(
      200,
      'User Subscription delete one succeed.',
      deletedUserSubscription.data
    )
  }
}
