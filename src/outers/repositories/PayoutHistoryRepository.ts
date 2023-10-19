import { type PayoutHistory } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import { randomUUID } from 'crypto'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'
import type PayoutHistoryAggregate from '../../inners/models/aggregates/PayoutHistoryAggregate'

export default class PayoutHistoryRepository {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
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
