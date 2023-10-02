import { type User } from '@prisma/client'
import { randomUUID } from 'crypto'

export default class UserMock {
  data: User[]

  constructor () {
    this.data = [
      {
        id: randomUUID(),
        fullName: 'fulName0',
        address: 'address0',
        email: 'email0@mail.com',
        password: 'password0',
        username: 'username0',
        balance: 0.0,
        gender: 'MALE',
        experience: 0,
        lastLatitude: 0.0,
        lastLongitude: 0.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        fullName: 'fulName1',
        address: 'address1',
        email: 'email1@mail.com',
        password: 'password1',
        username: 'username1',
        balance: 1.0,
        gender: 'FEMALE',
        experience: 1,
        lastLatitude: 1.0,
        lastLongitude: 1.0,
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
