import { type PaymentMethod } from '@prisma/client'
import type TransactionItemCheckoutRequest from './TransactionItemCheckoutRequest'

export default class TransactionCheckoutRequest {
  userId: string
  transactionItems: TransactionItemCheckoutRequest[]
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number

  constructor (userId: string, transactionItems: TransactionItemCheckoutRequest[], paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number) {
    this.userId = userId
    this.transactionItems = transactionItems
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
