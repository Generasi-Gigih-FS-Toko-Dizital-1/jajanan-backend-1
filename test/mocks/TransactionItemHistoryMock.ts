import { type TransactionItemHistory } from '@prisma/client'
import { randomUUID } from 'crypto'
import type JajanItemMock from './JajanItemMock'
import type TransactionHistoryMock from './TransactionHistoryMock'

export default class TransactionItemHistoryMock {
  transactionHistoryMock: TransactionHistoryMock
  jajanItemMock: JajanItemMock
  data: TransactionItemHistory[]

  constructor (
    transactionHistoryMock: TransactionHistoryMock,
    jajanItemMock: JajanItemMock
  ) {
    this.transactionHistoryMock = transactionHistoryMock
    this.jajanItemMock = jajanItemMock
    this.data = [
      {
        id: randomUUID(),
        transactionId: this.transactionHistoryMock.data[0].id,
        jajanItemId: this.jajanItemMock.data[0].id,
        quantity: 0.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        transactionId: this.transactionHistoryMock.data[1].id,
        jajanItemId: this.jajanItemMock.data[1].id,
        quantity: 1.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
