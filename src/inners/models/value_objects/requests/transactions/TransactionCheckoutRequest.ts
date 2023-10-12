import { type PaymentMethod } from '@prisma/client'

export default class TransactionCheckoutRequest {
  userId: string
  jajanItemIds: string[]
  amount: number
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number

  constructor (userId: string, jajanItemIds: string[], amount: number, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number) {
    this.userId = userId
    this.jajanItemIds = jajanItemIds
    this.amount = amount
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
