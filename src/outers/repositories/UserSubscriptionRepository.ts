import { type UserSubscription } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type UserSubscriptionAggregate from '../../inners/models/aggregates/UserSubscriptionAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class UserSubscriptionRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<UserSubscription[] | UserSubscriptionAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserSubscriptions: UserSubscription[] | UserSubscriptionAggregate[] = await this.oneDatastore.client.userSubscription.findMany(args)
    if (foundUserSubscriptions === null) {
      throw new Error('Found user subscription is undefined.')
    }

    return foundUserSubscriptions
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdUserSubscription: UserSubscription | UserSubscriptionAggregate = await this.oneDatastore.client.userSubscription.create(args)

    return createdUserSubscription
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserSubscription: UserSubscription | UserSubscriptionAggregate | null = await this.oneDatastore.client.userSubscription.findFirst(args)
    if (foundUserSubscription === null) {
      throw new Error('Found userSubscription is null.')
    }

    return foundUserSubscription
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: UserSubscription | UserSubscriptionAggregate = await this.oneDatastore.client.userSubscription.update(args)
    if (patchedUser === null) {
      throw new Error('Patched userSubscription is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<UserSubscription | UserSubscriptionAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUserSubscription: UserSubscription | UserSubscriptionAggregate = await this.oneDatastore.client.userSubscription.delete(args)

    return deletedUserSubscription
  }
}
