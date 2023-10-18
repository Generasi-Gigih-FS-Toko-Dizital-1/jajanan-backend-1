import { randomUUID } from 'crypto'
import type UserSubscriptionRepository from '../../../outers/repositories/UserSubscriptionRepository'
import Result from '../../models/value_objects/Result'
import type UserSubscriptionManagementCreateRequest from '../../models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementCreateRequest'
import { type UserSubscription } from '@prisma/client'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class UserSubscriptionManagement {
  userSubscriptionRepository: UserSubscriptionRepository

  constructor (
    userSubscriptionRepository: UserSubscriptionRepository
  ) {
    this.userSubscriptionRepository = userSubscriptionRepository
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

  deleteOneById = async (id: string): Promise<Result<UserSubscription | null>> => {
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
        500,
        'User Subscription delete one by id failed',
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
