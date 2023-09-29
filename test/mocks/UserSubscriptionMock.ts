import { type UserSubscription } from '@prisma/client'
import { randomUUID } from 'crypto'
import type CategoryMock from './CategoryMock'
import type UserMock from './UserMock'

export default class UserSubscriptionMock {
  userMock: UserMock
  categoryMock: CategoryMock
  data: UserSubscription[]

  constructor (
    userMock: UserMock,
    categoryMock: CategoryMock
  ) {
    this.userMock = userMock
    this.categoryMock = categoryMock
    this.data = [
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        categoryId: this.categoryMock.data[0].id,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        categoryId: this.categoryMock.data[0].id,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
