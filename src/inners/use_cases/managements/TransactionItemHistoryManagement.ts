import type TransactionItemHistoryRepository from '../../../outers/repositories/TransactionItemHistoryRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type TransactionHistory, type TransactionItemHistory } from '@prisma/client'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import { randomUUID } from 'crypto'
import type TransactionItemHistoryManagementCreateRequest
  from '../../models/value_objects/requests/managements/transaction_item_history_managements/TransactionItemHistoryManagementCreateRequest'
import type TransactionItemHistoryManagementPatchRequest
  from '../../models/value_objects/requests/managements/transaction_item_history_managements/TransactionItemHistoryManagementPatchRequest'
import type TransactionHistoryManagement from './TransactionHistoryManagement'
import type JajanItemSnapshotManagement from './JajanItemSnapshotManagement'

export default class TransactionItemHistoryManagement {
  transactionHistoryManagement: TransactionHistoryManagement
  transactionItemHistoryRepository: TransactionItemHistoryRepository
  jajanItemSnapshotManagement: JajanItemSnapshotManagement
  objectUtility: ObjectUtility

  constructor (transactionHistoryManagement: TransactionHistoryManagement, transactionItemHistoryRepository: TransactionItemHistoryRepository, jajanItemSnapshotManagement: JajanItemSnapshotManagement, objectUtility: ObjectUtility) {
    this.transactionHistoryManagement = transactionHistoryManagement
    this.jajanItemSnapshotManagement = jajanItemSnapshotManagement
    this.transactionItemHistoryRepository = transactionItemHistoryRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<TransactionItemHistory[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundTransactionHistories: TransactionItemHistory[] = await this.transactionItemHistoryRepository.readMany(args)
    return new Result<TransactionItemHistory[]>(
      200,
      'TransactionItemHistory read many succeed.',
      foundTransactionHistories
    )
  }

  readOneById = async (id: string): Promise<Result<TransactionItemHistory | null>> => {
    let foundTransactionItemHistory: TransactionItemHistory
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundTransactionItemHistory = await this.transactionItemHistoryRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TransactionItemHistory read one by id failed, transaction history is not found.',
        null
      )
    }
    return new Result<TransactionItemHistory>(
      200,
      'TransactionItemHistory read one by id succeed.',
      foundTransactionItemHistory
    )
  }

  createOne = async (request: TransactionItemHistoryManagementCreateRequest): Promise<Result<TransactionItemHistory | null>> => {
    const transactionItemHistory: TransactionItemHistory = {
      id: randomUUID(),
      transactionId: request.transactionId,
      jajanItemSnapshotId: request.jajanItemSnapshotId,
      quantity: request.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    const createdTransactionItemHistory: Result<TransactionItemHistory | null> = await this.createOneRaw(transactionItemHistory)
    if (createdTransactionItemHistory.status !== 201 || createdTransactionItemHistory.data === null) {
      return new Result<null>(
        createdTransactionItemHistory.status,
          `TransactionHistory create one failed, ${createdTransactionItemHistory.message}`,
          null
      )
    }

    return new Result<TransactionItemHistory>(
      201,
      'TransactionItemHistory create one succeed.',
      createdTransactionItemHistory.data
    )
  }

  createOneRaw = async (transactionItemHistory: TransactionItemHistory): Promise<Result<TransactionItemHistory | null>> => {
    const foundTransactionHistory: Result<TransactionHistory | null> = await this.transactionHistoryManagement.readOneById(transactionItemHistory.transactionId)
    if (foundTransactionHistory.status !== 200 || foundTransactionHistory.data === null) {
      return new Result<null>(
        404,
        'TransactionItemHistory create one failed, transaction history is not found.',
        null
      )
    }

    const foundJajanItemSnapshot: Result<any> = await this.jajanItemSnapshotManagement.readOneById(transactionItemHistory.jajanItemSnapshotId)
    if (foundJajanItemSnapshot.status !== 200 || foundJajanItemSnapshot.data === null) {
      return new Result<null>(
        404,
        'TransactionItemHistory create one failed, jajan item snapshot is not found.',
        null
      )
    }

    const args: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      transactionItemHistory
    )
    const createdTransactionItemHistory: any = await this.transactionItemHistoryRepository.createOne(args)
    return new Result<TransactionItemHistory>(
      201,
      'TransactionItemHistory create one raw succeed.',
      createdTransactionItemHistory
    )
  }

  createManyRaw = async (transactionItemHistories: TransactionItemHistory[]): Promise<Result<TransactionItemHistory[] | null>> => {
    let createdTransactionItemHistories: TransactionItemHistory[]
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        transactionItemHistories
      )
      createdTransactionItemHistories = await this.transactionItemHistoryRepository.createMany(args)
    } catch (error) {
      return new Result<null>(
        500,
          `TransactionItemHistory create many failed, ${(error as Error).message}`,
          null
      )
    }
    return new Result<TransactionItemHistory[]>(
      201,
      'TransactionItemHistory create many succeed.',
      createdTransactionItemHistories
    )
  }

  patchOneById = async (id: string, request: TransactionItemHistoryManagementPatchRequest): Promise<Result<TransactionItemHistory | null>> => {
    const patchedTransactionItemHistory: Result<TransactionItemHistory | null> = await this.patchOneRawById(id, request)
    if (patchedTransactionItemHistory.status !== 200 || patchedTransactionItemHistory.data === null) {
      return new Result<null>(
        patchedTransactionItemHistory.status,
            `TransactionItemHistory patch one failed, ${patchedTransactionItemHistory.message}`,
            null
      )
    }
    return new Result<TransactionItemHistory>(
      200,
      'TransactionItemHistory patch one succeed.',
      patchedTransactionItemHistory.data
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<TransactionItemHistory | null>> => {
    const foundTransactionItemHistory: Result<TransactionItemHistory | null> = await this.readOneById(id)
    if (foundTransactionItemHistory.status !== 200 || foundTransactionItemHistory.data === null) {
      return new Result<null>(
        404,
        'TransactionItemHistory patch one by id failed, transaction history is not found.',
        null
      )
    }
    this.objectUtility.patch(foundTransactionItemHistory.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundTransactionItemHistory.data
    )
    const patchedTransactionItemHistory: TransactionItemHistory = await this.transactionItemHistoryRepository.patchOne(args)
    return new Result<TransactionItemHistory>(
      200,
      'TransactionItemHistory patch one by id succeed.',
      patchedTransactionItemHistory
    )
  }

  deleteOneById = async (id: string): Promise<Result<TransactionItemHistory | null>> => {
    let deletedTransactionItemHistory: TransactionItemHistory
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedTransactionItemHistory = await this.transactionItemHistoryRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TransactionItemHistory delete one by id failed, transaction history is not found.',
        null
      )
    }
    return new Result<TransactionItemHistory>(
      200,
      'TransactionItemHistory delete one by id succeed.',
      deletedTransactionItemHistory
    )
  }
}
