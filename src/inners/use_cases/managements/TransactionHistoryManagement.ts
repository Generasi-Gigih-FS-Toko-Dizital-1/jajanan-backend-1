import type TransactionHistoryRepository from '../../../outers/repositories/TransactionHistoryRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type TransactionHistory } from '@prisma/client'
import type TransactionHistoryManagementCreateRequest
  from '../../models/value_objects/requests/managements/transaction_history_managements/TransactionHistoryManagementCreateRequest'
import { randomUUID } from 'crypto'
import type TransactionHistoryManagementPatchRequest
  from '../../models/value_objects/requests/managements/transaction_history_managements/TransactionHistoryManagementPatchRequest'
import type UserManagement from './UserManagement'
import type JajanItemManagement from './JajanItemManagement'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class TransactionHistoryManagement {
  userManagement: UserManagement
  jajanItemManagement: JajanItemManagement
  transactionHistoryRepository: TransactionHistoryRepository
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, jajanItemManagement: JajanItemManagement, transactionHistoryRepository: TransactionHistoryRepository, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.jajanItemManagement = jajanItemManagement
    this.transactionHistoryRepository = transactionHistoryRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<TransactionHistory[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundTransactionHistories: TransactionHistory[] = await this.transactionHistoryRepository.readMany(args)
    return new Result<TransactionHistory[]>(
      200,
      'TransactionHistory read many succeed.',
      foundTransactionHistories
    )
  }

  readOneById = async (id: string): Promise<Result<TransactionHistory | null>> => {
    let foundTransactionHistory: TransactionHistory
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundTransactionHistory = await this.transactionHistoryRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TransactionHistory read one by id failed, transaction history is not found.',
        null
      )
    }
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory read one by id succeed.',
      foundTransactionHistory
    )
  }

  readOneByUserId = async (userId: string): Promise<Result<TransactionHistory | null>> => {
    let foundTransactionHistory: TransactionHistory
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { userId },
        undefined,
        undefined
      )
      foundTransactionHistory = await this.transactionHistoryRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TransactionHistory read one by userId failed, transaction history is not found.',
        null
      )
    }
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory read one by userId succeed.',
      foundTransactionHistory
    )
  }

  createOne = async (request: TransactionHistoryManagementCreateRequest): Promise<Result<TransactionHistory | null>> => {
    const transactionHistory: TransactionHistory = {
      id: randomUUID(),
      userId: request.userId,
      paymentMethod: request.paymentMethod,
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdTransactionHistory: Result<TransactionHistory | null> = await this.createOneRaw(transactionHistory)
    if (createdTransactionHistory.status !== 201 || createdTransactionHistory.data === null) {
      return new Result<null>(
        createdTransactionHistory.status,
        `TransactionHistory create one failed, ${createdTransactionHistory.message}`,
        null
      )
    }

    return new Result<TransactionHistory>(
      201,
      'TransactionHistory create one succeed.',
      createdTransactionHistory.data
    )
  }

  createOneRaw = async (transactionHistory: TransactionHistory): Promise<Result<TransactionHistory | null>> => {
    const foundUser: Result<any> = await this.userManagement.readOneById(transactionHistory.userId)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        404,
        'TransactionHistory create one failed, user is not found.',
        null
      )
    }

    const args: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      transactionHistory
    )
    const createdTransactionHistory: any = await this.transactionHistoryRepository.createOne(args)
    return new Result<TransactionHistory>(
      201,
      'TransactionHistory create one raw succeed.',
      createdTransactionHistory
    )
  }

  patchOneById = async (id: string, request: TransactionHistoryManagementPatchRequest): Promise<Result<TransactionHistory | null>> => {
    const patchedTransactionHistory: Result<TransactionHistory | null> = await this.patchOneRawById(id, request)
    if (patchedTransactionHistory.status !== 200 || patchedTransactionHistory.data === null) {
      return new Result<null>(
        patchedTransactionHistory.status,
          `TransactionHistory patch one failed, ${patchedTransactionHistory.message}`,
          null
      )
    }
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory patch one succeed.',
      patchedTransactionHistory.data
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<TransactionHistory | null>> => {
    const foundTransactionHistory: Result<TransactionHistory | null> = await this.readOneById(id)
    if (foundTransactionHistory.status !== 200 || foundTransactionHistory.data === null) {
      return new Result<null>(
        404,
        'TransactionHistory patch one by id failed, transaction history is not found.',
        null
      )
    }
    this.objectUtility.patch(foundTransactionHistory.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundTransactionHistory.data
    )
    const patchedTransactionHistory: TransactionHistory = await this.transactionHistoryRepository.patchOne(args)
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory patch one by id succeed.',
      patchedTransactionHistory
    )
  }

  deleteHardOneById = async (id: string): Promise<Result<TransactionHistory | null>> => {
    let deletedTransactionHistory: TransactionHistory
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedTransactionHistory = await this.transactionHistoryRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TransactionHistory delete  hard one by id failed, transaction history is not found.',
        null
      )
    }
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory delete hard one by id succeed.',
      deletedTransactionHistory
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<TransactionHistory | null>> => {
    let deletedTransactionHistory: TransactionHistory
    try {
      const foundTransactionHistory: Result<TransactionHistory | null> = await this.readOneById(id)
      if (foundTransactionHistory.status !== 200 || foundTransactionHistory.data === null) {
        return new Result<null>(
          foundTransactionHistory.status,
          'TransactionHistory delete soft one by id failed, transaction history is not found.',
          null
        )
      }

      foundTransactionHistory.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundTransactionHistory.data
      )
      deletedTransactionHistory = await this.transactionHistoryRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'TransactionHistory delete soft one by id failed, transaction history is not found.',
        null
      )
    }
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory delete one by id succeed.',
      deletedTransactionHistory
    )
  }
}
