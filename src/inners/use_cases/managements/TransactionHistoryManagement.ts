import type TransactionHistoryRepository from '../../../outers/repositories/TransactionHistoryRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type TransactionHistory } from '@prisma/client'

export default class TransactionHistoryManagement {
  transactionHistoryRepository: TransactionHistoryRepository
  objectUtility: ObjectUtility

  constructor (transactionHistoryRepository: TransactionHistoryRepository, objectUtility: ObjectUtility) {
    this.transactionHistoryRepository = transactionHistoryRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination): Promise<Result<TransactionHistory[]>> => {
    const foundTransactionHistories: TransactionHistory[] = await this.transactionHistoryRepository.readMany(pagination)
    return new Result<TransactionHistory[]>(
      200,
      'TransactionHistory read all succeed.',
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

  createOneRaw = async (transactionHistory: TransactionHistory): Promise<Result<TransactionHistory>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const createdTransactionHistory: any = await this.transactionHistoryRepository.createOne(transactionHistory)
    return new Result<TransactionHistory>(
      201,
      'TransactionHistory create one raw succeed.',
      createdTransactionHistory
    )
  }

  patchOneRawById = async (id: string, transactionHistory: TransactionHistory): Promise<Result<TransactionHistory | null>> => {
    const foundTransactionHistory: Result<TransactionHistory | null> = await this.readOneById(id)
    if (foundTransactionHistory.status !== 200 || foundTransactionHistory.data === null) {
      return new Result<null>(
        404,
        'TransactionHistory patch one by id failed, transaction history is not found.',
        null
      )
    }
    this.objectUtility.patch(foundTransactionHistory.data, transactionHistory)
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
