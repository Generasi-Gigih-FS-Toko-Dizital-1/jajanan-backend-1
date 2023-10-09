import type TopUpCreateRequest from '../../inners/models/value_objects/requests/top_up/TopUpCreateRequest'
import { type User } from '@prisma/client'
import type PaymentGateway from '../payment_gateway/PaymentGateway'
import { type CreateInvoiceRequest } from 'xendit-node/invoice/models'

export default class TopUpRepository {
  paymentGateway
  constructor (paymentGateway: PaymentGateway) {
    this.paymentGateway = paymentGateway
  }

  generateTopUpUrl = async (topUpData: TopUpCreateRequest, user: User): Promise<string> => {
    const data: CreateInvoiceRequest = {
      amount: topUpData.amount,
      externalId: user.id,
      currency: 'IDR',
      reminderTime: 1,
      payerEmail: user.email,
      customer: {
        givenNames: user.fullName,
        email: user.email
      }

    }
    const response: any = await this.paymentGateway.client?.Invoice.createInvoice({
      data
    })
    return response.invoiceUrl
  }
}
