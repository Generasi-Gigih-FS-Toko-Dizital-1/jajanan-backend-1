import { type PaymentMethod } from '@prisma/client'

export default class TransactionHistoryManagementPatchResponse {
  id: string
  userId: string
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number
  updatedAt: Date
  createdAt: Date
  deletedAt: Date | null

  constructor (id: string, userId: string, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number, updatedAt: Date, createdAt: Date, deletedAt: Date | null = null) {
    this.id = id
    this.userId = userId
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
    this.updatedAt = updatedAt
    this.createdAt = createdAt
    this.deletedAt = deletedAt
  }
}
