import { type TopUpHistory } from '@prisma/client'
import { randomUUID } from 'crypto'
import type UserMock from './UserMock'

export default class TopUpHistoryMock {
  userMock: UserMock
  data: TopUpHistory[]

  constructor (
    userMock: UserMock
  ) {
    this.userMock = userMock
    this.data = [
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        amount: 0.0,
        media: 'media0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        amount: 1.0,
        media: 'media0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
