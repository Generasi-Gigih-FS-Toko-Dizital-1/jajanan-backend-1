import { randomUUID } from 'crypto'
import Result from '../../models/value_objects/Result'
import { type UserSubscription } from '@prisma/client'
import type UserSubscriptionManagement from '../managements/UserSubscriptionManagement'
import type UserSubscriptionSubscribeRequest
  from '../../models/value_objects/requests/subscriptions/UserSubscriptionSubscribeRequest'
import type UserSubscriptionUnsubscribeRequest
  from '../../models/value_objects/requests/subscriptions/UserSubscriptionUnsubscribeRequest'

export default class SubscriptionUser {
  userSubscriptionManagement: UserSubscriptionManagement

  constructor (
    userSubscriptionManagement: UserSubscriptionManagement
  ) {
    this.userSubscriptionManagement = userSubscriptionManagement
  }

  subscribe = async (request: UserSubscriptionSubscribeRequest): Promise<Result<null>> => {
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
        `User Subscription subscribe failed, ${createdUserSubscription.message}`,
        null
      )
    }
    return new Result<null>(
      201,
      'User Subscription subscribe succeed.',
      null
    )
  }

  unsubscribe = async (request: UserSubscriptionUnsubscribeRequest): Promise<Result<null>> => {
    const deletedUserSubscription: Result<UserSubscription | null> = await this.userSubscriptionManagement.deleteOneByUserIdandCategoryId(request.userId, request.categoryId)
    if (deletedUserSubscription.status !== 200 || deletedUserSubscription.data === null) {
      return new Result<null>(
        deletedUserSubscription.status,
            `User Subscription unsubscribe failed, ${deletedUserSubscription.message}`,
            null
      )
    }
    return new Result<null>(
      200,
      'User Subscription unsubscribe succeed.',
      null
    )
  }
}
