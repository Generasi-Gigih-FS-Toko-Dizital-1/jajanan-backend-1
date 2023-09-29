import { type NotificationHistory } from '@prisma/client'
import { randomUUID } from 'crypto'
import type UserMock from './UserMock'
import type VendorMock from './VendorMock'

export default class NotificationHistoryMock {
  userMock: UserMock
  vendorMock: VendorMock
  data: NotificationHistory[]

  constructor (
    userMock: UserMock,
    vendorMock: VendorMock
  ) {
    this.userMock = userMock
    this.vendorMock = vendorMock
    this.data = [
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        vendorId: this.vendorMock.data[0].id,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        userId: this.userMock.data[0].id,
        vendorId: this.vendorMock.data[0].id,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
