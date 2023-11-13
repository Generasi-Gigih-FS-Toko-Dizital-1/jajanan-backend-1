import { type PaymentMethod, type TransactionItemHistory, type User } from '@prisma/client'

export default class TransactionHistoryManagementReadOneResponse {
  id: string
  userId: string
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number
  updatedAt: Date
  createdAt: Date
  deletedAt: Date | null
  user?: User
  transactionItems?: TransactionItemHistory[]

  constructor (id: string, userId: string, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number, updatedAt: Date, createdAt: Date, deletedAt: Date | null = null, user?: User, transactionItems?: TransactionItemHistory[]) {
    this.id = id
    this.userId = userId
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.updatedAt = updatedAt
    this.createdAt = createdAt
    this.user = user
    this.transactionItems = transactionItems
    this.deletedAt = deletedAt
  }
}
