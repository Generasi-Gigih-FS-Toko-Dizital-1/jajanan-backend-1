import { type Admin } from '@prisma/client'
import { randomUUID } from 'crypto'

export default class AdminMock {
  data: Admin[]

  constructor () {
    this.data = [
      {
        id: randomUUID(),
        fullName: 'fullName0',
        email: 'email0',
        password: 'password0',
        gender: 'MALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        fullName: 'fullName1',
        email: 'email1',
        password: 'password1',
        gender: 'FEMALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
