import type TopUpCreateRequest from '../../inners/models/value_objects/requests/top_up/TopUpCreateRequest'
import { type User } from '@prisma/client'

export default class TopUpRepository {
  snap
  constructor (snap: any) {
    this.snap = snap
  }

  generateTopUpUrl = async (topUpData: TopUpCreateRequest, user: User): Promise<string> => {
    const parameter = {
      transaction_details: {
        order_id: '123',
        gross_amount: topUpData.amount
      },
      customer_details: {
        email: user.email
      }
    }

    const generatedTopUpUrl = this.snap.createTransactionRedirectUrl(parameter)
      .then((redirectUrl: string) => {
        return redirectUrl
      })

    return generatedTopUpUrl
  }
}
