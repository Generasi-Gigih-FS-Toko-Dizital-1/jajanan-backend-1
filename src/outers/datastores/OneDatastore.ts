import { PrismaClient } from '@prisma/client'

export default class OneDatastore {
  db: PrismaClient | undefined

  connect = async (): Promise<void> => {
    const host = process.env.DS_1_HOST
    if (host === undefined) {
      throw new Error('Host is undefined.')
    }

    const port = process.env.DS_1_PORT
    if (port === undefined) {
      throw new Error('Port is undefined.')
    }

    const user = process.env.DS_1_USER
    if (user === undefined) {
      throw new Error('User is undefined.')
    }

    const password = process.env.DS_1_PASSWORD
    if (password === undefined) {
      throw new Error('Password is undefined.')
    }

    const database = process.env.DS_1_DATABASE
    if (database === undefined) {
      throw new Error('Database is undefined.')
    }

    const url = `postgresql://${user}:${password}@${host}:${port}/${database}`

    this.db = new PrismaClient({ datasourcesUrl: url })
  }

  disconnect = async (): Promise<void> => {
    if (this.db === undefined) {
      throw new Error('Database is undefined.')
    }
  }
}
