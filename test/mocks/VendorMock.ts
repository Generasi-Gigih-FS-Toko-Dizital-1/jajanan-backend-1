import { type Vendor } from '@prisma/client'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'

export default class VendorMock {
  data: Vendor[]

  constructor () {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }
    this.data = [
      {
        id: randomUUID(),
        fullName: 'fulName0',
        address: 'address0',
        email: `${randomUUID()}@mail.com`,
        password: bcrypt.hashSync('password0', salt),
        username: `${randomUUID()}`,
        balance: 100000.0,
        gender: 'MALE',
        experience: 0,
        lastLatitude: 0.0,
        lastLongitude: 10.0,
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
        email: `${randomUUID()}@mail.com`,
        password: bcrypt.hashSync('password1', salt),
        username: `${randomUUID()}`,
        balance: 1.0,
        gender: 'FEMALE',
        experience: 1,
        lastLatitude: 1.0,
        lastLongitude: 100.0,
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
