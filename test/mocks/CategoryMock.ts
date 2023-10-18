import { type Category } from '@prisma/client'
import { randomUUID } from 'crypto'

export default class CategoryMock {
  data: Category[]

  constructor () {
    this.data = [
      {
        id: randomUUID(),
        name: 'name0',
        iconUrl: 'https://placehold.co/400x400?text=iconUrl0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        name: 'name0',
        iconUrl: 'https://placehold.co/400x400?text=iconUrl0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
