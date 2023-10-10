import type TransactionHistoryRepository from '../../../outers/repositories/TransactionHistoryRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type TransactionHistory } from '@prisma/client'
import type TransactionHistoryManagementCreateRequest
  from '../../models/value_objects/requests/managements/transaction_history_management/TransactionHistoryManagementCreateRequest'
import { randomUUID } from 'crypto'
import type TransactionHistoryManagementPatchRequest
  from '../../models/value_objects/requests/managements/transaction_history_management/TransactionHistoryManagementPatchRequest'
import type UserManagement from './UserManagement'
import type JajanItemManagement from './JajanItemManagement'

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
    const foundTransactionHistories: TransactionHistory[] = await this.transactionHistoryRepository.readMany(pagination, whereInput, includeInput)
    return new Result<TransactionHistory[]>(
      200,
      'TransactionHistory read many succeed.',
      foundTransactionHistories
    )
  }

  readOneById = async (id: string): Promise<Result<TransactionHistory | null>> => {
    let foundTransactionHistory: TransactionHistory
    try {
      foundTransactionHistory = await this.transactionHistoryRepository.readOneById(id)
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
      foundTransactionHistory = await this.transactionHistoryRepository.readOneByUserId(userId)
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
      jajanItemId: request.jajanItemId,
      amount: request.amount,
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

    const foundJajanItem: Result<any> = await this.jajanItemManagement.readOneById(transactionHistory.jajanItemId)
    if (foundJajanItem.status !== 200 || foundJajanItem.data === null) {
      return new Result<null>(
        404,
        'TransactionHistory create one failed, jajan item is not found.',
        null
      )
    }

    const createdTransactionHistory: any = await this.transactionHistoryRepository.createOne(transactionHistory)
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

  patchOneRawById = async (id: string, request: TransactionHistoryManagementPatchRequest): Promise<Result<TransactionHistory | null>> => {
    const foundTransactionHistory: Result<TransactionHistory | null> = await this.readOneById(id)
    if (foundTransactionHistory.status !== 200 || foundTransactionHistory.data === null) {
      return new Result<null>(
        404,
        'TransactionHistory patch one by id failed, transaction history is not found.',
        null
      )
    }
    this.objectUtility.patch(foundTransactionHistory.data, request)
    const patchedTransactionHistory: TransactionHistory = await this.transactionHistoryRepository.patchOneById(id, foundTransactionHistory.data)
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory patch one by id succeed.',
      patchedTransactionHistory
    )
  }

  deleteOneById = async (id: string): Promise<Result<TransactionHistory>> => {
    const deletedTransactionHistory: any = await this.transactionHistoryRepository.deleteOneById(id)
    return new Result<TransactionHistory>(
      200,
      'TransactionHistory delete one by id succeed.',
      deletedTransactionHistory
    )
  }
}
