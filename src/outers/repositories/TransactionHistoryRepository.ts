import type OneDatastore from '../datastores/OneDatastore'
import { type TransactionHistory } from '@prisma/client'
import type TransactionHistoryAggregate from '../../inners/models/aggregates/TransactionHistoryAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class TransactionHistoryRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
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

  readMany = async (argument: RepositoryArgument): Promise<TransactionHistory[] | TransactionHistoryAggregate[]> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTransactionHistories: TransactionHistory[] | TransactionHistoryAggregate[] = await this.oneDatastore.client.transactionHistory.findMany(args)
    if (foundTransactionHistories === null) {
      throw new Error('Found transactionHistories is undefined.')
    }

    return foundTransactionHistories
  }

  createOne = async (argument: RepositoryArgument): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdTransactionHistory: TransactionHistory | TransactionHistoryAggregate = await this.oneDatastore.client.transactionHistory.create(args)

    return createdTransactionHistory
  }

  readOne = async (argument: RepositoryArgument): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTransactionHistory: TransactionHistory | TransactionHistoryAggregate | null = await this.oneDatastore.client.transactionHistory.findFirst(args)
    if (foundTransactionHistory === null) {
      throw new Error('Found transactionHistory is null.')
    }

    return foundTransactionHistory
  }

  patchOne = async (argument: RepositoryArgument): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedTransactionHistory: TransactionHistory | TransactionHistoryAggregate = await this.oneDatastore.client.transactionHistory.update(args)
    if (patchedTransactionHistory === null) {
      throw new Error('Patched transactionHistory is undefined.')
    }

    return patchedTransactionHistory
  }

  deleteOne = async (argument: RepositoryArgument): Promise<TransactionHistory | TransactionHistoryAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedTransactionHistory: TransactionHistory | TransactionHistoryAggregate = await this.oneDatastore.client.transactionHistory.delete(args)

    return deletedTransactionHistory
  }
}
