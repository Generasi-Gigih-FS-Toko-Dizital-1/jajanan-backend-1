import { type TopUpHistory } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type Pagination from '../../inners/models/value_objects/Pagination'
import type TopUpHistoryAggregate from '../../inners/models/aggregates/TopUpHistoryAggregate'

export default class TopUpHistoryRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        user: true
      }
    }
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<TopUpHistory[] | TopUpHistoryAggregate[]> => {
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

    const foundTopUpHistories: TopUpHistory[] | TopUpHistoryAggregate[] = await this.oneDatastore.client.topUpHistory.findMany(args)
    if (foundTopUpHistories === null) {
      throw new Error('Found topUpHistory is undefined.')
    }
    return foundTopUpHistories
  }

  readOneById = async (id: string, check?: boolean, isAggregated?: boolean): Promise<TopUpHistory | TopUpHistoryAggregate | null> => {
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

    const topUpHistory: TopUpHistory | TopUpHistoryAggregate | null = await this.oneDatastore.client.topUpHistory.findUnique(args)
    if (topUpHistory === undefined && check !== true) {
      throw new Error('TopUpHistory not found.')
    }
    return topUpHistory
  }

  readManyByUserId = async (userId: string, pagination: Pagination, includeInput: any): Promise<TopUpHistory[] | TopUpHistoryAggregate[]> => {
    const offset: number = (pagination.pageNumber - 1) * pagination.pageSize
    const args: any = {
      take: pagination.pageSize,
      skip: offset,
      where: userId,
      include: includeInput
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTopUpHistories: TopUpHistory[] | TopUpHistoryAggregate[] = await this.oneDatastore.client.topUpHistory.findMany(args)
    if (foundTopUpHistories === null) {
      throw new Error('Found topUpHistory is undefined.')
    }
    return foundTopUpHistories
  }

  createOne = async (topUpHistory: TopUpHistory, isAggregated?: boolean): Promise<TopUpHistory | TopUpHistoryAggregate> => {
    const args: any = {
      data: topUpHistory
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    const createdTopUpHistory: TopUpHistory | TopUpHistoryAggregate = await this.oneDatastore.client.topUpHistory.create(args)
    return createdTopUpHistory
  }

  patchOneById = async (id: string, topUpHistory: TopUpHistory, isAggregated?: boolean): Promise<TopUpHistory | TopUpHistoryAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: topUpHistory
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedTopUpHistory: TopUpHistory | TopUpHistoryAggregate = await this.oneDatastore.client.topUpHistory.update(args)
    if (patchedTopUpHistory === null) {
      throw new Error('Patched topUpHistory is undefined.')
    }
    return patchedTopUpHistory
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<TopUpHistory | TopUpHistoryAggregate> => {
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

    const deletedTopUpHistory: TopUpHistory | TopUpHistoryAggregate = await this.oneDatastore.client.topUpHistory.delete(args)
    if (deletedTopUpHistory === null) {
      throw new Error('Deleted topUpHistory is undefined.')
    }
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
