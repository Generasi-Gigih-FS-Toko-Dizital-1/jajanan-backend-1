import { Xendit } from 'xendit-node'
import { type CreateInvoiceRequest } from 'xendit-node/invoice/models'

export default class PaymentGateway {
  client: Xendit | undefined

  constructor () {
    const apiKey: string | undefined = process.env.XENDIT_API_KEY
    if (apiKey === undefined) {
      throw new Error('Payment gateway api key undefined')
    }

    this.client = new Xendit({
      secretKey: apiKey
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
}
