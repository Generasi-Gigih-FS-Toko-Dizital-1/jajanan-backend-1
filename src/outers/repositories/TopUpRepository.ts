import type TopUpCreateRequest from '../../inners/models/value_objects/requests/top_up/TopUpCreateRequest'
import { type User } from '@prisma/client'

export default class TopUpRepository {
  paymentGateway
  idGenerator
  constructor (paymentGateway: any, idGenerator: () => string) {
    this.paymentGateway = paymentGateway
    this.idGenerator = idGenerator
  }

  generateTopUpUrl = async (topUpData: TopUpCreateRequest, user: User): Promise<string> => {
    const parameter = {
      transaction_details: {
        order_id: `topup-${this.idGenerator()}`,
        gross_amount: topUpData.amount
      },
      user_id: user.id
    }

    const generatedTopUpUrl = await this.paymentGateway.snap.createTransaction(parameter)
      .then((transaction: any) => {
        // transaction redirect_url
        return transaction.redirect_url
      })
    return generatedTopUpUrl
  }
}
