import { type TopUpHistory } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'

export default class TopUpHistoryRepository {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readOneById = async (id: string, check: boolean = false): Promise<any> => {
    const args: any = {
      where: {
        id
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const topUpHistory = await this.oneDatastore.client.topUpHistory.findUnique(args)
    if (topUpHistory === undefined && !check) {
      throw new Error('TopUpHistory not found.')
    }
    return topUpHistory
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
