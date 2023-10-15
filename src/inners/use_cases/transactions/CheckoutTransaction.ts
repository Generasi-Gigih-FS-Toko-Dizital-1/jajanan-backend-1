import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import { type JajanItem, type JajanItemSnapshot, type TransactionHistory, type User, type Vendor } from '@prisma/client'
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
import type VendorManagement from '../managements/VendorManagement'

export default class CheckoutTransaction {
  userManagement: UserManagement
  vendorManagement: VendorManagement
  jajanItemManagement: JajanItemManagement
  jajanItemSnapshotManagement: JajanItemSnapshotManagement
  transactionHistoryManagement: TransactionHistoryManagement
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, vendorManagement: VendorManagement, jajanItemManagement: JajanItemManagement, jajanItemSnapshotManagement: JajanItemSnapshotManagement, transactionHistoryManagement: TransactionHistoryManagement, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.vendorManagement = vendorManagement
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

    let totalPrice: number = 0
    const vendorIds: string[] = []

    const jajanItemSnapshots: JajanItemSnapshot[] = foundJajanItems.data.map((jajanItem: JajanItem) => {
      totalPrice += jajanItem.price
      vendorIds.push(jajanItem.vendorId)
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

    foundUser.data.experience += totalPrice

    if (request.paymentMethod === 'BALANCE') {
      foundUser.data.balance -= totalPrice
      if (foundUser.data.balance < 0) {
        return new Result<null>(
          403,
          'Transaction checkout failed, user has insufficient balance.',
          null
        )
      }

      const foundVendors: Result<Vendor[] | null> = await this.vendorManagement.readManyByIds(vendorIds)
      if (foundVendors.status !== 200 || foundVendors.data === null) {
        return new Result<null>(
          foundVendors.status,
            `Transaction checkout failed, ${foundVendors.message}`,
            null
        )
      }

      foundVendors.data.forEach((vendor: Vendor) => {
        vendor.balance += totalPrice
      })

      const patchedVendors: Result<Vendor[] | null> = await this.vendorManagement.patchManyRawByIds(vendorIds, foundVendors.data)
      if (patchedVendors.status !== 200 || patchedVendors.data === null) {
        return new Result<null>(
          patchedVendors.status,
            `Transaction checkout failed, ${patchedVendors.message}`,
            null
        )
      }
    }

    const patchedUser: Result<User | null> = await this.userManagement.patchOneRawById(request.userId, foundUser.data)
    if (patchedUser.status !== 200 || patchedUser.data === null) {
      return new Result<null>(
        patchedUser.status,
            `Transaction checkout failed, ${patchedUser.message}`,
            null
      )
    }

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
