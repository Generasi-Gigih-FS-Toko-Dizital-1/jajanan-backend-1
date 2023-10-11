import { type PaymentMethod } from '@prisma/client'

export default class TransactionCreateResponse {
  id: string
  userId: string
  jajanItemId: string
  amount: number
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number
  updatedAt: Date
  createdAt: Date

  constructor (id: string, userId: string, jajanItemId: string, amount: number, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number, updatedAt: Date, createdAt: Date) {
    this.id = id
    this.userId = userId
    this.jajanItemId = jajanItemId
    this.amount = amount
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.updatedAt = updatedAt
    this.createdAt = createdAt
  }
}
