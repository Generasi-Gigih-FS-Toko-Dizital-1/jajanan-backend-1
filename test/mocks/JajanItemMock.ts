import { type JajanItem } from '@prisma/client'
import { randomUUID } from 'crypto'
import type VendorMock from './VendorMock'
import type CategoryMock from './CategoryMock'

export default class JajanItemMock {
  vendorMock: VendorMock
  categoryMock: CategoryMock
  data: JajanItem[]

  constructor (
    vendorMock: VendorMock,
    categoryMock: CategoryMock
  ) {
    this.vendorMock = vendorMock
    this.categoryMock = categoryMock
    this.data = [
      {
        id: randomUUID(),
        vendorId: this.vendorMock.data[0].id,
        categoryId: this.categoryMock.data[0].id,
        name: 'name0',
        price: 0.0,
        imageUrl: 'https://placehold.co/400x400?text=imageUrl0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        vendorId: this.vendorMock.data[1].id,
        categoryId: this.categoryMock.data[1].id,
        name: 'name1',
        price: 1.0,
        imageUrl: 'https://placehold.co/400x400?text=imageUrl1',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
