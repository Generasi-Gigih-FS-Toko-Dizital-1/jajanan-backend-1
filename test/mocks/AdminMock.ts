import { type Admin } from '@prisma/client'
import { randomUUID } from 'crypto'

export default class AdminMock {
  data: Admin[]

  constructor () {
    this.data = [
      {
        id: randomUUID(),
        fullName: 'fullName0',
        email: 'email0@mail.com',
        password: 'password0',
        gender: 'MALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        fullName: 'fullName1',
        email: 'email1@mail.com',
        password: 'password1',
        gender: 'FEMALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
