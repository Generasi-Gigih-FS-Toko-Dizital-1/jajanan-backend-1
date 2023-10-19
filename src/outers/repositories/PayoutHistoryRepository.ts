import { type PayoutHistory } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import { randomUUID } from 'crypto'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'
import type PayoutHistoryAggregate from '../../inners/models/aggregates/PayoutHistoryAggregate'

export default class PayoutHistoryRepository {
  constructor (private readonly oneDatastore: OneDatastore) {
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<PayoutHistory[] | PayoutHistoryAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundPayoutHistories: PayoutHistory[] | PayoutHistoryAggregate[] = await this.oneDatastore.client.payoutHistory.findMany(args)
    if (foundPayoutHistories === null) {
      throw new Error('Found payoutHistories is undefined.')
    }

    return foundPayoutHistories
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<PayoutHistory | PayoutHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundPayoutHistory: PayoutHistory | PayoutHistoryAggregate | null = await this.oneDatastore.client.payoutHistory.findFirst(args)

    if (foundPayoutHistory === null) {
      throw new Error('Found payoutHistory is null.')
    }

    return foundPayoutHistory
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<PayoutHistory | PayoutHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdPayoutHistory: PayoutHistory | PayoutHistoryAggregate = await this.oneDatastore.client.payoutHistory.create(args)

    return createdPayoutHistory
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<PayoutHistory | PayoutHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedPayoutHistory: PayoutHistory | PayoutHistoryAggregate = await this.oneDatastore.client.payoutHistory.update(args)

    return patchedPayoutHistory
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<PayoutHistory | PayoutHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedPayoutHistory: PayoutHistory | PayoutHistoryAggregate = await this.oneDatastore.client.payoutHistory.delete(args)

    return deletedPayoutHistory
  }

  createByWebhook = async (request: any): Promise<PayoutHistory> => {
    const payoutHistory: PayoutHistory = {
      id: randomUUID(),
      amount: request.amount,
      xenditPayoutId: request.id,
      vendorId: request.externalId,
      media: request.bankCode,
      createdAt: new Date(request.created),
      updatedAt: new Date(request.updated),
      deletedAt: null
    }
    const args: any = {
      data: payoutHistory
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdPayoutHistory = await this.oneDatastore.client.payoutHistory.create(args)

    return createdPayoutHistory
  }
}
