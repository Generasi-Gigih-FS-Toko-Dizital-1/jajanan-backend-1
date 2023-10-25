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
        paymentMethod: 'CASH',
        lastLatitude: 0.0,
        lastLongitude: 0.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        userId: this.userMock.data[1].id,
        paymentMethod: 'BALANCE',
        lastLatitude: 1.0,
        lastLongitude: 1.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
