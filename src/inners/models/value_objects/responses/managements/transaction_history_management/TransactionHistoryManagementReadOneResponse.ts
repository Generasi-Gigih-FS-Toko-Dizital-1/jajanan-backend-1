import { type JajanItem, type PaymentMethod, type User } from '@prisma/client'

export default class TransactionHistoryManagementReadOneResponse {
  id: string
  userId: string
  jajanItemId: string
  amount: number
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number
  updatedAt: Date
  createdAt: Date
  user?: User
  jajanItem?: JajanItem

  constructor (id: string, userId: string, jajanItemId: string, amount: number, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number, updatedAt: Date, createdAt: Date, user?: User, jajanItem?: JajanItem) {
    this.id = id
    this.userId = userId
    this.jajanItemId = jajanItemId
    this.amount = amount
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.updatedAt = updatedAt
    this.createdAt = createdAt
    this.user = user
    this.jajanItem = jajanItem
  }
}
