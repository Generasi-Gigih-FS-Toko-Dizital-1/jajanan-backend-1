import { PrismaClient } from '@prisma/client'

export default class OneDatastore {
  client: PrismaClient | undefined

  connect = async (): Promise<void> => {
    const url = process.env.DS_1_URL
    if (url === undefined) {
      throw new Error('URL is undefined.')
    }

    this.client = new PrismaClient(
      {
        datasourceUrl: url
      }
    )
    await this.client.$connect()
  }

  disconnect = async (): Promise<void> => {
    if (this.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await this.client.$disconnect()
  }
}
