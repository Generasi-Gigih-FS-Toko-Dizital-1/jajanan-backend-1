import Result from '../../models/value_objects/Result'
import type TopUpCreateRequest from '../../models/value_objects/requests/top_ups/TopUpCreateRequest'
import { type User } from '@prisma/client'
import type PaymentGateway from '../../../outers/gateways/PaymentGateway'
import type UserManagement from '../managements/UserManagement'
import { type CreateInvoiceRequest } from 'xendit-node/invoice/models'

export default class TopUp {
  paymentGateway: PaymentGateway
  userManagement: UserManagement

  constructor (paymentGateway: PaymentGateway, userManagement: UserManagement) {
    this.paymentGateway = paymentGateway
    this.userManagement = userManagement
  }

  generateTopUpUrl = async (request: TopUpCreateRequest): Promise<Result<string | null>> => {
    const foundUser: Result<User | null> = await this.userManagement.readOneById(request.userId)
    if (foundUser.status !== 200 || foundUser.data === null) {
      return new Result<string | null>(
        404,
        'User not found.',
        null
      )
    }

    const createInvoiceRequest: CreateInvoiceRequest = {
      amount: request.amount,
      externalId: foundUser.data.id,
      currency: 'IDR',
      reminderTime: 1,
      payerEmail: foundUser.data.email,
      customer: {
        givenNames: foundUser.data.fullName,
        email: foundUser.data.email
      }

    }

    const generatedTopUpUrl = await this.paymentGateway.generateTopUpUrl(createInvoiceRequest)

    return new Result<string>(
      201,
      'TopUp url generated successfully.',
      generatedTopUpUrl
    )
  }
}
