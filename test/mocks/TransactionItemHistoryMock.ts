import { type TransactionItemHistory } from '@prisma/client'
import { randomUUID } from 'crypto'
import type JajanItemSnapshotMock from './JajanItemSnapshotMock'
import type TransactionHistoryMock from './TransactionHistoryMock'

export default class TransactionItemHistoryMock {
  transactionHistoryMock: TransactionHistoryMock
  jajanItemSnapshotMock: JajanItemSnapshotMock
  data: TransactionItemHistory[]

  constructor (
    transactionHistoryMock: TransactionHistoryMock,
    jajanItemSnapshotMock: JajanItemSnapshotMock
  ) {
    this.transactionHistoryMock = transactionHistoryMock
    this.jajanItemSnapshotMock = jajanItemSnapshotMock
    this.data = [
      {
        id: randomUUID(),
        transactionId: this.transactionHistoryMock.data[0].id,
        jajanItemSnapshotId: this.jajanItemSnapshotMock.data[0].id,
        quantity: 0.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        transactionId: this.transactionHistoryMock.data[1].id,
        jajanItemSnapshotId: this.jajanItemSnapshotMock.data[1].id,
        quantity: 1.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
