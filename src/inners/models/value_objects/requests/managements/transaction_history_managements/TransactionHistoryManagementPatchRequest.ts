import { type PaymentMethod } from '@prisma/client'

export default class TransactionHistoryManagementPatchRequest {
  userId: string
  paymentMethod: PaymentMethod
  lastLatitude: number
  lastLongitude: number

  constructor (userId: string, paymentMethod: PaymentMethod, lastLatitude: number, lastLongitude: number) {
    this.userId = userId
    this.paymentMethod = paymentMethod
    this.lastLatitude = lastLatitude
    this.lastLongitude = lastLongitude
  }
}
