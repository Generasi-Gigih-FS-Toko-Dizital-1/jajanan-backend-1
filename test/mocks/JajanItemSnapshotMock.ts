import { type JajanItemSnapshot } from '@prisma/client'
import type JajanItemMock from './JajanItemMock'
import { randomUUID } from 'crypto'

export default class JajanItemSnapshotMock {
  jajanItemMock: JajanItemMock
  data: JajanItemSnapshot[]

  constructor (
    jajanItemMock: JajanItemMock
  ) {
    this.jajanItemMock = jajanItemMock
    this.data = [
      {
        id: randomUUID(),
        originId: this.jajanItemMock.data[0].id,
        vendorId: this.jajanItemMock.data[0].vendorId,
        categoryId: this.jajanItemMock.data[0].categoryId,
        name: this.jajanItemMock.data[0].name,
        price: this.jajanItemMock.data[0].price,
        imageUrl: this.jajanItemMock.data[0].imageUrl,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        originId: this.jajanItemMock.data[1].id,
        vendorId: this.jajanItemMock.data[1].vendorId,
        categoryId: this.jajanItemMock.data[1].categoryId,
        name: this.jajanItemMock.data[1].name,
        price: this.jajanItemMock.data[1].price,
        imageUrl: this.jajanItemMock.data[1].imageUrl,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
