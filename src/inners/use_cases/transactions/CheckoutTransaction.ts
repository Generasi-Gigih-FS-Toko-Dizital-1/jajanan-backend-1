import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type JajanItem, type TransactionHistory, type User } from '@prisma/client'
import type TransactionCheckoutRequest from '../../models/value_objects/requests/transactions/TransactionCheckoutRequest'
import { randomUUID } from 'crypto'
import type TransactionHistoryManagement from '../managements/TransactionHistoryManagement'
import type UserManagement from '../managements/UserManagement'
import type JajanItemManagement from '../managements/JajanItemManagement'
import { $Enums } from '.prisma/client'

export default class CheckoutTransaction {
  userManagement: UserManagement
  jajanItemManagement: JajanItemManagement
  transactionHistoryManagement: TransactionHistoryManagement
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, jajanItemManagement: JajanItemManagement, transactionHistoryManagement: TransactionHistoryManagement, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.jajanItemManagement = jajanItemManagement
    this.transactionHistoryManagement = transactionHistoryManagement
    this.objectUtility = objectUtility
  }

  checkout = async (request: TransactionCheckoutRequest): Promise<Result<TransactionHistory | null>> => {
    const foundUser: Result<User | null> = await this.userManagement.readOneById(request.userId)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        foundUser.status,
        'Transaction create one failed, user is not found.',
        null
      )
    }

    const foundJajanItems: Result<JajanItem[] | null> = await this.jajanItemManagement.readManyByIds(request.jajanItemIds)
    if (foundJajanItems.status !== 200 || foundJajanItems.data === null) {
      return new Result<null>(
        foundJajanItems.status,
        `Transaction create one failed, ${foundJajanItems.message}`,
        null
      )
    }

    if (foundJajanItems.data.length !== request.jajanItemIds.length) {
      return new Result<null>(
        404,
        'Transaction create one failed, some jajan item ids is not found.',
        null
      )
    }

    const transactionHistoryToCreate: TransactionHistory = {
      id: randomUUID(),
      userId: request.userId,
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
