import { type Admin } from '@prisma/client'
import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'

export default class AdminMock {
  data: Admin[]

  constructor () {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }
    this.data = [
      {
        id: randomUUID(),
        fullName: 'fullName0',
        email: `${randomUUID()}@mail.com`,
        password: bcrypt.hashSync('password0', salt),
        gender: 'MALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      },
      {
        id: randomUUID(),
        fullName: 'fullName1',
        email: `${randomUUID()}@mail.com`,
        password: bcrypt.hashSync('password1', salt),
        gender: 'FEMALE',
        updatedAt: new Date(),
        createdAt: new Date(),
        deletedAt: null
      }
    ]
  }
}
