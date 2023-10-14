import { type UserSubscription } from '@prisma/client'
import type Pagination from '../../inners/models/value_objects/Pagination'
import type OneDatastore from '../datastores/OneDatastore'
import type UserSubscriptionAggregate from '../../inners/models/aggregates/UserSubscriptionAggregate'

export default class UserSubscriptionRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        user: true,
        category: true
      }
    }
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<UserSubscription[] | UserSubscriptionAggregate[]> => {
    const offset: number = (pagination.pageNumber - 1) * pagination.pageSize
    const args: any = {
      take: pagination.pageSize,
      skip: offset,
      where: whereInput,
      include: includeInput
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserSubscriptions: UserSubscription[] | UserSubscriptionAggregate[] = await this.oneDatastore.client.userSubscription.findMany(args)
    if (foundUserSubscriptions === null) {
      throw new Error('Found User Subscription is undefined.')
    }
    return foundUserSubscriptions
  }

  createOne = async (userSubscription: UserSubscription, isAggregated?: boolean): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = {
      data: userSubscription
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdItem: UserSubscription | UserSubscriptionAggregate = await this.oneDatastore.client.userSubscription.create(args)

    return createdItem
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = {
      where: {
        id
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserSubscription: UserSubscription | UserSubscriptionAggregate | null = await this.oneDatastore.client.userSubscription.findFirst(args)
    if (foundUserSubscription === null) {
      throw new Error('Found User Subscription is null.')
    }
    return foundUserSubscription
  }

  patchOneById = async (id: string, userSubscription: UserSubscription, isAggregated?: boolean): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: userSubscription
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: UserSubscription | UserSubscriptionAggregate = await this.oneDatastore.client.userSubscription.update(args)
    if (patchedUser === null) {
      throw new Error('Patched User Subscription is undefined.')
    }
    return patchedUser
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = {
      where: {
        id
      }

    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUserSubscription: UserSubscription | UserSubscriptionAggregate = await this.oneDatastore.client.userSubscription.delete(args)

    return deletedUserSubscription
  }
}
