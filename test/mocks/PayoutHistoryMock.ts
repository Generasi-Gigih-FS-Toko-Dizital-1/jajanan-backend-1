import { type PayoutHistory } from '@prisma/client'
import { randomUUID } from 'crypto'
import type VendorMock from './VendorMock'

export default class PayoutHistoryMock {
  vendorMock: VendorMock
  data: PayoutHistory[]

  constructor (
    vendorMock: VendorMock
  ) {
    this.vendorMock = vendorMock
    this.data = [
      {
        id: randomUUID(),
        vendorId: this.vendorMock.data[0].id,
        xenditPayoutId: randomUUID(),
        amount: 0.0,
        media: 'media0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        vendorId: this.vendorMock.data[1].id,
        xenditPayoutId: randomUUID(),
        amount: 1.0,
        media: 'media0',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
