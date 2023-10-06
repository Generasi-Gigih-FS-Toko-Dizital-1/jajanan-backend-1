import type OneDatastore from '../datastores/OneDatastore'
import { type TransactionHistory } from '@prisma/client'
import type TransactionHistoryAggregate from '../../inners/models/aggregates/TransactionHistoryAggregate'
import type Pagination from '../../inners/models/value_objects/Pagination'

export default class TransactionHistoryRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        user: true,
        jajanItem: true
      }
    }
  }

  readMany = async (pagination: Pagination, isAggregated?: boolean): Promise<TransactionHistory[] | TransactionHistoryAggregate[]> => {
    const offset: number = (pagination.pageNumber - 1) * pagination.pageSize
    const args: any = {
      take: pagination.pageSize,
      skip: offset
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTransactionHistory: TransactionHistory[] | TransactionHistoryAggregate[] = await this.oneDatastore.client.transactionHistory.findMany(args)
    if (foundTransactionHistory === null) {
      throw new Error('Found transactionHistory is undefined.')
    }
    return foundTransactionHistory
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<TransactionHistory | TransactionHistoryAggregate> => {
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

    const foundTransactionHistory: TransactionHistory | TransactionHistoryAggregate | null = await this.oneDatastore.client.transactionHistory.findFirst(args)
    if (foundTransactionHistory === null) {
      throw new Error('Found transactionHistory is null.')
    }
    return foundTransactionHistory
  }

  readOneByUserId = async (userId: string, isAggregated?: boolean): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = {
      where: {
        userId
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTransactionHistory: TransactionHistory | TransactionHistoryAggregate | null = await this.oneDatastore.client.transactionHistory.findFirst(args)
    if (foundTransactionHistory === null) {
      throw new Error('Found transactionHistory is null.')
    }
    return foundTransactionHistory
  }

  createOne = async (transactionHistory: TransactionHistory, isAggregated?: boolean): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = {
      data: transactionHistory
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdTransactionHistory: TransactionHistory | TransactionHistoryAggregate = await this.oneDatastore.client.transactionHistory.create(args)
    if (createdTransactionHistory === undefined) {
      throw new Error('Created transactionHistory is undefined.')
    }
    return createdTransactionHistory
  }

  patchOneById = async (id: string, transactionHistory: TransactionHistory, isAggregated?: boolean): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: transactionHistory
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedTransactionHistory: TransactionHistory | TransactionHistoryAggregate = await this.oneDatastore.client.transactionHistory.update(args)
    if (patchedTransactionHistory === null) {
      throw new Error('Patched transactionHistory is undefined.')
    }
    return patchedTransactionHistory
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<TransactionHistory | TransactionHistoryAggregate> => {
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

    const deletedTransactionHistory: TransactionHistory | TransactionHistoryAggregate = await this.oneDatastore.client.transactionHistory.delete(args)

    return deletedTransactionHistory
  }
}