import { type PaymentMethod } from '@prisma/client'

export default class TransactionManagementCreateRequest {
  userId: string
  jajanItemId: string
  amount: number
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number

  constructor (userId: string, jajanItemId: string, amount: number, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number) {
    this.userId = userId
    this.jajanItemId = jajanItemId
    this.amount = amount
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
