import { type TopUpHistory } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type TopUpHistoryAggregate from '../../inners/models/aggregates/TopUpHistoryAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class TopUpHistoryRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<TopUpHistory[] | TopUpHistoryAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTopUpHistories: TopUpHistory[] | TopUpHistoryAggregate[] = await this.oneDatastore.client.topUpHistory.findMany(args)
    if (foundTopUpHistories === null) {
      throw new Error('Found topUpHistories is undefined.')
    }

    return foundTopUpHistories
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<TopUpHistory | TopUpHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdTopUpHistory: TopUpHistory | TopUpHistoryAggregate = await this.oneDatastore.client.topUpHistory.create(args)

    return createdTopUpHistory
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<TopUpHistory | TopUpHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTopUpHistory: TopUpHistory | TopUpHistoryAggregate | null = await this.oneDatastore.client.topUpHistory.findFirst(args)
    if (foundTopUpHistory === null) {
      throw new Error('Found topUpHistory is null.')
    }

    return foundTopUpHistory
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<TopUpHistory | TopUpHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: TopUpHistory | TopUpHistoryAggregate = await this.oneDatastore.client.topUpHistory.update(args)
    if (patchedUser === null) {
      throw new Error('Patched topUpHistory is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<TopUpHistory | TopUpHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedTopUpHistory: TopUpHistory | TopUpHistoryAggregate = await this.oneDatastore.client.topUpHistory.delete(args)

    return deletedTopUpHistory
  }

  createByWebhook = async (request: any): Promise<TopUpHistory> => {
    const topUpHistory: TopUpHistory = {
      id: request.id,
      userId: request.externalId,
      amount: request.amount,
      media: request.paymentChannel,
      createdAt: new Date(request.paidAt),
      updatedAt: new Date(request.paidAt),
      deletedAt: null
    }
    const args: any = {
      data: topUpHistory
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdTopUpHistory = await this.oneDatastore.client.topUpHistory.create(args)

    return createdTopUpHistory
  }
}
