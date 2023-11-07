import type OneDatastore from '../datastores/OneDatastore'
import { type TransactionItemHistory } from '@prisma/client'
import type TransactionItemHistoryAggregate from '../../inners/models/aggregates/TransactionItemHistoryAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class TransactionItemHistoryRepository {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<TransactionItemHistory[] | TransactionItemHistoryAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTransactionHistories: TransactionItemHistory[] | TransactionItemHistoryAggregate[] = await this.oneDatastore.client.transactionItemHistory.findMany(args)
    if (foundTransactionHistories === null) {
      throw new Error('Found transactionItemHistories is undefined.')
    }

    return foundTransactionHistories
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<TransactionItemHistory | TransactionItemHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdTransactionItemHistory: TransactionItemHistory | TransactionItemHistoryAggregate = await this.oneDatastore.client.transactionItemHistory.create(args)

    return createdTransactionItemHistory
  }

  createMany = async (repositoryArgument: RepositoryArgument): Promise<TransactionItemHistory[] | TransactionItemHistoryAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    await this.oneDatastore.client.transactionItemHistory.createMany(args)

    return repositoryArgument.data
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<TransactionItemHistory | TransactionItemHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundTransactionItemHistory: TransactionItemHistory | TransactionItemHistoryAggregate | null = await this.oneDatastore.client.transactionItemHistory.findFirst(args)
    if (foundTransactionItemHistory === null) {
      throw new Error('Found transactionItemHistory is null.')
    }

    return foundTransactionItemHistory
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<TransactionItemHistory | TransactionItemHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedTransactionItemHistory: TransactionItemHistory | TransactionItemHistoryAggregate = await this.oneDatastore.client.transactionItemHistory.update(args)
    if (patchedTransactionItemHistory === null) {
      throw new Error('Patched transactionItemHistory is undefined.')
    }

    return patchedTransactionItemHistory
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<TransactionItemHistory | TransactionItemHistoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedTransactionItemHistory: TransactionItemHistory | TransactionItemHistoryAggregate = await this.oneDatastore.client.transactionItemHistory.delete(args)

    return deletedTransactionItemHistory
  }
}
