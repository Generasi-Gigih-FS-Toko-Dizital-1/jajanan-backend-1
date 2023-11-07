import Result from '../../models/value_objects/Result'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import {
  type JajanItem,
  type JajanItemSnapshot,
  type TransactionHistory,
  type TransactionItemHistory,
  type User,
  type Vendor
} from '@prisma/client'
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
import type TransactionItemHistoryManagement from '../managements/TransactionItemHistoryManagement'

export default class TransactionCheckout {
  userManagement: UserManagement
  vendorManagement: VendorManagement
  jajanItemManagement: JajanItemManagement
  jajanItemSnapshotManagement: JajanItemSnapshotManagement
  transactionHistoryManagement: TransactionHistoryManagement
  transactionItemHistoryManagement: TransactionItemHistoryManagement
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, vendorManagement: VendorManagement, jajanItemManagement: JajanItemManagement, jajanItemSnapshotManagement: JajanItemSnapshotManagement, transactionHistoryManagement: TransactionHistoryManagement, transactionItemHistoryManagement: TransactionItemHistoryManagement, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.vendorManagement = vendorManagement
    this.jajanItemManagement = jajanItemManagement
    this.jajanItemSnapshotManagement = jajanItemSnapshotManagement
    this.transactionHistoryManagement = transactionHistoryManagement
    this.transactionItemHistoryManagement = transactionItemHistoryManagement
    this.objectUtility = objectUtility
  }

  checkout = async (request: TransactionCheckoutRequest): Promise<Result<TransactionCheckoutResponse | null>> => {
    if (!['BALANCE', 'CASH'].includes(request.paymentMethod)) {
      return new Result<null>(
        400,
        'Transaction checkout failed, payment method is invalid.',
        null
      )
    }

    const foundUser: Result<User | null> = await this.userManagement.readOneById(request.userId)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<null>(
        foundUser.status,
        `Transaction checkout failed, ${foundUser.message}`,
        null
      )
    }

    const jajananItemIds: string[] = []
    const groupedTransactionItemsByJajananItemId: TransactionItemCheckoutRequest[] = []
    request.transactionItems.forEach((transactionItem: TransactionItemCheckoutRequest) => {
      const foundTransactionItem: TransactionItemCheckoutRequest | undefined = groupedTransactionItemsByJajananItemId.find((groupedTransactionItem: TransactionItemCheckoutRequest) => groupedTransactionItem.jajanItemId === transactionItem.jajanItemId)
      if (foundTransactionItem === undefined) {
        groupedTransactionItemsByJajananItemId.push(transactionItem)
        jajananItemIds.push(transactionItem.jajanItemId)
      } else {
        foundTransactionItem.quantity += transactionItem.quantity
      }
    })

    const foundJajanItems: Result<JajanItem[] | null> = await this.jajanItemManagement.readManyByIds(jajananItemIds)
    if (foundJajanItems.status !== 200 || foundJajanItems.data === null) {
      return new Result<null>(
        foundJajanItems.status,
        `Transaction checkout failed, ${foundJajanItems.message}`,
        null
      )
    }

    let transactionTotalPrice: number = 0
    const vendorToTotalPriceMap: Map<string, number> = new Map<string, number>()

    const jajanItemSnapshots: JajanItemSnapshot[] = foundJajanItems.data.map((jajanItem: JajanItem) => {
      transactionTotalPrice += jajanItem.price
      if (vendorToTotalPriceMap.get(jajanItem.vendorId) === undefined) {
        vendorToTotalPriceMap.set(jajanItem.vendorId, jajanItem.price)
      } else {
        const oldTotalPrice: number = vendorToTotalPriceMap.get(jajanItem.vendorId)
        const newTotalPrice: number = oldTotalPrice + jajanItem.price
        vendorToTotalPriceMap.set(jajanItem.vendorId, newTotalPrice)
      }
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

    const vendorIds: string[] = Array.from(vendorToTotalPriceMap.keys())
    const foundVendors: Result<Vendor[] | null> = await this.vendorManagement.readManyByIds(vendorIds)
    if (foundVendors.status !== 200 || foundVendors.data === null) {
      return new Result<null>(
        foundVendors.status,
          `Transaction checkout failed, ${foundVendors.message}`,
          null
      )
    }

    foundUser.data.experience += transactionTotalPrice

    foundVendors.data.forEach((vendor: Vendor) => {
      const totalPricePerVendor: number | undefined = vendorToTotalPriceMap.get(vendor.id)
      if (totalPricePerVendor === undefined) {
        return new Result<null>(
          500,
          'Transaction checkout failed, vendor total price is undefined.',
          null
        )
      }
      vendor.experience += totalPricePerVendor
    })

    if (request.paymentMethod === 'BALANCE') {
      foundUser.data.balance -= transactionTotalPrice
      if (foundUser.data.balance < 0) {
        return new Result<null>(
          403,
          'Transaction checkout failed, user has insufficient balance.',
          null
        )
      }

      foundVendors.data.forEach((vendor: Vendor) => {
        const totalPricePerVendor: number | undefined = vendorToTotalPriceMap.get(vendor.id)
        if (totalPricePerVendor === undefined) {
          return new Result<null>(
            500,
            'Transaction checkout failed, vendor total price is undefined.',
            null
          )
        }
        vendor.balance += totalPricePerVendor
      })
    }

    const foundVendorIds: string[] = foundVendors.data.map((vendor: Vendor) => vendor.id)
    const patchedVendors: Result<Vendor[] | null> = await this.vendorManagement.patchManyRawByIds(foundVendorIds, foundVendors.data)
    if (patchedVendors.status !== 200 || patchedVendors.data === null) {
      return new Result<null>(
        patchedVendors.status,
          `Transaction checkout failed, ${patchedVendors.message}`,
          null
      )
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

    const transactionItemHistories: TransactionItemHistory[] = []
    const responseTransactionItems: TransactionItemCheckoutResponse[] = []
    try {
      createdJajanItemSnapshots.data.forEach((jajanItemSnapshot: JajanItemSnapshot) => {
        const foundTransactionItem: TransactionItemCheckoutRequest | undefined = groupedTransactionItemsByJajananItemId.find((groupedTransactionItem: TransactionItemCheckoutRequest) => groupedTransactionItem.jajanItemId === jajanItemSnapshot.originId)

        if (foundTransactionItem === undefined) {
          throw new Error('Transaction item not found.')
        }

        const transactionItemHistory: TransactionItemHistory = {
          id: randomUUID(),
          transactionId: createdTransactionHistory.data.id,
          jajanItemSnapshotId: jajanItemSnapshot.id,
          quantity: foundTransactionItem.quantity,
          updatedAt: new Date(),
          createdAt: new Date(),
          deletedAt: null
        }
        transactionItemHistories.push(transactionItemHistory)

        const responseTransactionItem: TransactionItemCheckoutResponse = new TransactionItemCheckoutResponse(
          transactionItemHistory.id,
          jajanItemSnapshot.id,
          foundTransactionItem.quantity
        )
        responseTransactionItems.push(responseTransactionItem)
      })
    } catch (error) {
      return new Result<null>(
        500,
            `Transaction checkout failed, ${(error as Error).message}`,
            null
      )
    }

    const createdTransactionItems: Result<TransactionItemHistory[] | null> = await this.transactionItemHistoryManagement.createManyRaw(transactionItemHistories)
    if (createdTransactionItems.status !== 201 || createdTransactionItems.data === null) {
      return new Result<null>(
        createdTransactionItems.status,
                `Transaction checkout failed, ${createdTransactionItems.message}`,
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
