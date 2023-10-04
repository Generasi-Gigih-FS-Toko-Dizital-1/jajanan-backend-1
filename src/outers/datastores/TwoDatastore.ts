import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

export default class TwoDatastore {
  client: RedisClientType | undefined

  connect = async (): Promise<void> => {
    const url: string | undefined = process.env.DS_2_URL
    if (url === undefined) {
      throw new Error('URL is undefined.')
    }

    this.client = createClient({
      url
    })

    if (this.client === undefined) {
      throw new Error('Client is undefined.')
    }

    await this.client.connect()
  }

  disconnect = async (): Promise<void> => {
    if (this.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await this.client.disconnect()
  }
}
