import { Xendit } from 'xendit-node'

export default class PaymentGateway {
  client: Xendit | undefined

  connect = async (): Promise<void> => {
    const apiKey: string | undefined = process.env.XENDIT_API_KEY
    if (apiKey === undefined) {
      throw new Error('Payment gateway api key undefined')
    }

    this.client = new Xendit({
      secretKey: apiKey
    })
  }
}
