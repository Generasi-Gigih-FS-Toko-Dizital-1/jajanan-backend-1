import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type JajanItem, type JajanItemSnapshot, type TransactionHistory, type User } from '@prisma/client'
import type TransactionCheckoutRequest
  from '../../models/value_objects/requests/transactions/TransactionCheckoutRequest'
import { randomUUID } from 'crypto'
import type TransactionHistoryManagement from '../managements/TransactionHistoryManagement'
import type UserManagement from '../managements/UserManagement'
import type JajanItemManagement from '../managements/JajanItemManagement'
import type JajanItemSnapshotManagement from '../managements/JajanItemSnapshotManagement'
import type TransactionItemCheckoutRequest
  from '../../models/value_objects/requests/transactions/TransactionItemCheckoutRequest'
import TransactionCheckoutResponse from '../../models/value_objects/responses/transactions/TransactionCheckoutResponse'
import TransactionItemCheckoutResponse
  from '../../models/value_objects/responses/transactions/TransactionItemCheckoutResponse'

export default class CheckoutTransaction {
  userManagement: UserManagement
  jajanItemManagement: JajanItemManagement
  jajanItemSnapshotManagement: JajanItemSnapshotManagement
  transactionHistoryManagement: TransactionHistoryManagement
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, jajanItemManagement: JajanItemManagement, jajanItemSnapshotManagement: JajanItemSnapshotManagement, transactionHistoryManagement: TransactionHistoryManagement, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.jajanItemManagement = jajanItemManagement
    this.jajanItemSnapshotManagement = jajanItemSnapshotManagement
    this.transactionHistoryManagement = transactionHistoryManagement
    this.objectUtility = objectUtility
  }

  checkout = async (request: TransactionCheckoutRequest): Promise<Result<TransactionCheckoutResponse | null>> => {
    const foundUser: Result<User | null> = await this.userManagement.readOneById(request.userId)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        foundUser.status,
        `Transaction checkout failed, ${foundUser.message}`,
        null
      )
    }

    const transactionItemIds: string[] = request.transactionItems.map((transactionItem: TransactionItemCheckoutRequest) => transactionItem.jajanItemId)
    const foundJajanItems: Result<JajanItem[] | null> = await this.jajanItemManagement.readManyByIds(transactionItemIds)
    if (foundJajanItems.status !== 200 || foundJajanItems.data === null) {
      return new Result<null>(
        foundJajanItems.status,
        `Transaction checkout failed, ${foundJajanItems.message}`,
        null
      )
    }

    if (foundJajanItems.data.length !== request.transactionItems.length) {
      return new Result<null>(
        404,
        'Transaction checkout failed, some jajan item ids is not found.',
        null
      )
    }

    const jajanItemSnapshots: JajanItemSnapshot[] = foundJajanItems.data.map((jajanItem: JajanItem) => {
      return {
        id: randomUUID(),
        originId: jajanItem.id,
        vendorId: jajanItem.vendorId,
        categoryId: jajanItem.categoryId,
        name: jajanItem.name,
        price: jajanItem.price,
        imageUrl: jajanItem.imageUrl,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    })

    const createdJajanItemSnapshots: Result<JajanItemSnapshot[] | null> = await this.jajanItemSnapshotManagement.createManyRaw(jajanItemSnapshots)

    if (createdJajanItemSnapshots.status !== 201 || createdJajanItemSnapshots.data === null) {
      return new Result<null>(
        createdJajanItemSnapshots.status,
        `Transaction checkout failed, ${createdJajanItemSnapshots.message}`,
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
    const createdTransactionHistory: Result<TransactionHistory | null> = await this.transactionHistoryManagement.createOneRaw(transactionHistoryToCreate)

    if (createdTransactionHistory.status !== 201 || createdTransactionHistory.data === null) {
      return new Result<null>(
        createdTransactionHistory.status,
            `Transaction checkout failed, ${createdTransactionHistory.message}`,
            null
      )
    }

    let responseTransactionItems: TransactionItemCheckoutResponse[] | undefined
    try {
      responseTransactionItems = createdJajanItemSnapshots.data.map((jajanItemSnapshot: JajanItemSnapshot) => {
        const foundTransactionItem: TransactionItemCheckoutRequest | undefined = request.transactionItems.find((transactionItem: TransactionItemCheckoutRequest) => transactionItem.jajanItemId === jajanItemSnapshot.originId)

        if (foundTransactionItem === undefined) {
          throw new Error('Found transaction item is undefined.')
        }

        return new TransactionItemCheckoutResponse(
          jajanItemSnapshot.id,
          foundTransactionItem.quantity
        )
      })
    } catch (error) {
      return new Result<null>(
        500,
            `Transaction checkout failed, ${(error as Error).message}`,
            null
      )
    }

    const transactionCheckout: TransactionCheckoutResponse = new TransactionCheckoutResponse(
      createdTransactionHistory.data.id,
      createdTransactionHistory.data.userId,
      responseTransactionItems,
      createdTransactionHistory.data.paymentMethod,
      createdTransactionHistory.data.lastLatitude,
      createdTransactionHistory.data.lastLongitude,
      createdTransactionHistory.data.updatedAt,
      createdTransactionHistory.data.createdAt
    )

    return new Result<TransactionCheckoutResponse>(
      201,
      'Transaction checkout succeed.',
      transactionCheckout
    )
  }
}
