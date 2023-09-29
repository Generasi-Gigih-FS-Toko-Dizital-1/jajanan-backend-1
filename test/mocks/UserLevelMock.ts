import { type UserLevel } from '@prisma/client'
import { randomUUID } from 'crypto'

export default class UserLevelMock {
  data: UserLevel[]

  constructor () {
    this.data = [
      {
        id: randomUUID(),
        name: 'name0',
        minimumExperience: 0,
        iconUrl: 'https://placehold.co/400x400?text=iconUrl0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        name: 'name1',
        minimumExperience: 1,
        iconUrl: 'https://placehold.co/400x400?text=iconUrl1',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
