import { type PaymentMethod } from '@prisma/client'
import type TransactionItemCheckoutResponse from './TransactionItemCheckoutResponse'

export default class TransactionCheckoutResponse {
  transactionId: string
  userId: string
  transactionItems: TransactionItemCheckoutResponse[]
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number
  updatedAt: Date
  createdAt: Date

  constructor (transactionId: string, userId: string, transactionItems: TransactionItemCheckoutResponse[], paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number, updatedAt: Date, createdAt: Date) {
    this.transactionId = transactionId
    this.userId = userId
    this.transactionItems = transactionItems
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.updatedAt = updatedAt
    this.createdAt = createdAt
  }
}
