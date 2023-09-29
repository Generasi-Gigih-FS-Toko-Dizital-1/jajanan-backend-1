import { type Vendor } from '@prisma/client'
import { randomUUID } from 'crypto'

export default class VendorMock {
  data: Vendor[]

  constructor () {
    this.data = [
      {
        id: randomUUID(),
        fullName: 'fulName0',
        address: 'address0',
        email: 'email0',
        password: 'password0',
        username: 'username0',
        balance: 0.0,
        gender: 'MALE',
        experience: 0,
        lastLatitude: 0.0,
        lastLongitude: 0.0,
        jajanImageUrl: 'https://placehold.co/400x400?text=jajanImageUrl0',
        jajanName: 'jajanName0',
        jajanDescription: 'jajanDescription0',
        status: 'ON',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        fullName: 'fulName1',
        address: 'address1',
        email: 'email1',
        password: 'password1',
        username: 'username1',
        balance: 1.0,
        gender: 'MALE',
        experience: 1,
        lastLatitude: 1.0,
        lastLongitude: 1.0,
        jajanImageUrl: 'https://placehold.co/411x411?text=jajanImageUrl1',
        jajanName: 'jajanName1',
        jajanDescription: 'jajanDescription1',
        status: 'OFF',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
