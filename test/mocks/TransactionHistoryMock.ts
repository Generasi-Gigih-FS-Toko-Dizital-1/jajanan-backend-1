import { type TransactionHistory } from '@prisma/client'
import { randomUUID } from 'crypto'
import type JajanItemMock from './JajanItemMock'
import type UserMock from './UserMock'

export default class TransactionHistoryMock {
  userMock: UserMock
  jajanItemMock: JajanItemMock
  data: TransactionHistory[]

  constructor (
    userMock: UserMock,
    jajanItemMock: JajanItemMock
  ) {
    this.userMock = userMock
    this.jajanItemMock = jajanItemMock
    this.data = [
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        jajanItemId: this.jajanItemMock.data[0].id,
        amount: 0.0,
        paymentType: 'CASH',
        lastLatitude: 0.0,
        lastLongitude: 0.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        userId: this.userMock.data[1].id,
        jajanItemId: this.jajanItemMock.data[1].id,
        amount: 1.0,
        paymentType: 'BALANCE',
        lastLatitude: 1.0,
        lastLongitude: 1.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}