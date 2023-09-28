import type OneDatastore from '../datastores/OneDatastore'
import { randomUUID } from 'crypto'

export default class OneSeeder {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  up = async (): Promise<void> => {
    this.oneDatastore.client?.user.createMany({
      data: [
        {
          id: randomUUID(),
          fullName: 'John Doe',
          address: '456 Elm Street',
          email: 'john.doe@example.com',
          password: 'password',
          username: 'johndoe',
          balance: 50,
          gender: 'MALE',
          experience: 25,
          lastLatitude: 37.7833,
          lastLongitude: -122.4167,
          updatedAt: new Date(),
          createdAt: new Date()
        },
        {
          id: randomUUID(),
          fullName: 'Jane Doe',
          address: '789 Oak Street',
          email: 'jane.doe@example.com',
          password: 'password',
          username: 'janedoe',
          balance: 100,
          gender: 'FEMALE',
          experience: 50,
          lastLatitude: 37.7833,
          lastLongitude: -122.4167,
          updatedAt: new Date(),
          createdAt: new Date()
        }
      ]
    })
    console.log('One seeder up.')
  }

  down = async (): Promise<void> => {
    console.log('One seeder down.')
  }
}
