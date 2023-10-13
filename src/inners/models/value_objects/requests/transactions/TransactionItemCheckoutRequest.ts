import { type PaymentMethod } from '@prisma/client'

export default class TransactionItemCheckoutRequest {
  jajanItemId: string
  quantity: number

  constructor (jajanItemId: string, quantity: number) {
    this.jajanItemId = jajanItemId
    this.quantity = quantity
  }
}
