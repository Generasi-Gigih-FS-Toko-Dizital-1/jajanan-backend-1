import { type User } from '@prisma/client'
import { type Xendit } from 'xendit-node'
import { type CreateInvoiceRequest } from 'xendit-node/invoice/models'

export default class PaymentGatewayXendit {
  xenditClient: Xendit
  constructor (xenditClient: Xendit) {
    this.xenditClient = xenditClient
  }

  generatedTopUpUrl = async (user: User, amount: number): Promise<string> => {
    const data: CreateInvoiceRequest = {
      amount: 10000,
      externalId: user.id,
      currency: 'IDR',
      reminderTime: 1,
      payerEmail: user.email,
      customer: {
        givenNames: user.fullName,
        email: user.email
      }

    }
    const response: any = await this.xenditClient.Invoice.createInvoice({
      data
    })
    return response.invoice_url
  }
}
