import axios from 'axios'
import { Xendit } from 'xendit-node'
import { type CreateInvoiceRequest } from 'xendit-node/invoice/models'

export default class PaymentGateway {
  client: Xendit | undefined
  apiKey: string | undefined
  constructor () {
    this.apiKey = process.env.XENDIT_API_KEY
    if (this.apiKey === undefined) {
      throw new Error('Payment gateway api key undefined')
    }

    this.client = new Xendit({
      secretKey: this.apiKey
    })
  }

  generateTopUpUrl = async (createInvoiceRequest: CreateInvoiceRequest): Promise<string> => {
    if (this.client === undefined) {
      throw new Error('Payment gateway client undefined')
    }
    const response: any = await this.client.Invoice.createInvoice({
      data: createInvoiceRequest
    })
    return response.invoiceUrl
  }

  generatePayoutUrl = async (data: any): Promise<any> => {
    if (this.apiKey === undefined) {
      throw new Error('Payment gateway api key undefined')
    }
    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.xendit.co/payouts',
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        },
        data
      })

      return response.data
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  voidPayout = async (payoutId: string): Promise<any> => {
    if (this.apiKey === undefined) {
      throw new Error('Payment gateway api key undefined')
    }
    try {
      await axios({
        method: 'post',
        url: `https://api.xendit.co/payouts/${payoutId}/void`,
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error: any) {
      if (error.response.status === 403) {
        throw new Error(error.message)
      }
    }
  }
}
