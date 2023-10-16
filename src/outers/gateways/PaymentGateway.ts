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

  generatePayoutUrl = async (data: any): Promise<string> => {
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

      console.log('Payout request successful. Response:', response.data)
      return response.data.payout_url
    } catch (error: any) {
      console.error('Error making the payout request:', error)
      throw new Error(error.message)
    }
  }

  getPayoutListByUserId = async (userId: string): Promise<any> => {
    if (this.apiKey === undefined) {
      throw new Error('Payment gateway api key undefined')
    }
    try {
      const response = await axios({
        method: 'get',
        url: 'https://api.xendit.co/payouts?statuses=["PENDING","EXPIRED"]',
        headers: {
          Authorization: `Basic ${Buffer.from(this.apiKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Payout request successful. Response:', response.data)
    } catch (error: any) {
      console.error('Error making the payout request:', error)
    }
  }

  getPayouts = async (userId: string): Promise<any> => {
    const response = await this.client?.Payout.getPayouts({
      referenceId: userId
    })
    console.log('Payouts:', response)
    return response
  }
}
