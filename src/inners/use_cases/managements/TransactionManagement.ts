import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type TransactionHistory } from '@prisma/client'
import type TransactionCreateRequest from '../../models/value_objects/requests/transactions/TransactionCreateRequest'
import type TransactionHistoryManagement from './TransactionHistoryManagement'
import { randomUUID } from 'crypto'

export default class TransactionManagement {
  transactionHistoryManagement: TransactionHistoryManagement
  objectUtility: ObjectUtility

  constructor (transactionHistoryManagement: TransactionHistoryManagement, objectUtility: ObjectUtility) {
    this.transactionHistoryManagement = transactionHistoryManagement
    this.objectUtility = objectUtility
  }

  createOne = async (request: TransactionCreateRequest): Promise<Result<TransactionHistory>> => {
    const transactionHistoryToCreate: TransactionHistory = {
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

    const createdTransactionHistory: any = await this.transactionHistoryManagement.createOneRaw(transactionHistoryToCreate)

    return new Result<TransactionHistory>(
      201,
      'Transaction create one succeed.',
      createdTransactionHistory
    )
  }
}
