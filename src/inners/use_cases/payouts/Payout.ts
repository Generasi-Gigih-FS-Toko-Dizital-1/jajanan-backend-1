import { type Vendor } from '@prisma/client'
import type PaymentGateway from '../../../outers/gateways/PaymentGateway'
import Result from '../../models/value_objects/Result'
import type PayoutCreateRequest from '../../models/value_objects/requests/payouts/PayoutCreateRequest'
import type VendorManagement from '../managements/VendorManagement'
import type VendorPayoutRepository from '../../../outers/repositories/VendorPayoutRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import type XenditCreatePayoutRequest from '../../models/value_objects/requests/payouts/XenditCreatePayoutRequest'
import { randomUUID } from 'crypto'

export default class Payout {
  paymentGateway: PaymentGateway
  vendorManagement: VendorManagement
  vendorPayoutRepository: VendorPayoutRepository

  constructor (vendorPayoutRepository: VendorPayoutRepository, paymentGateway: PaymentGateway, vendorManagement: VendorManagement) {
    this.paymentGateway = paymentGateway
    this.vendorManagement = vendorManagement
    this.vendorPayoutRepository = vendorPayoutRepository
  }

  generatePayoutUrl = async (request: PayoutCreateRequest): Promise<Result<string | null>> => {
    const foundVendor: Result<Vendor | null> = await this.vendorManagement.readOneById(request.vendorId)
    if (foundVendor.status !== 200 || foundVendor.data === null) {
      return new Result<string | null>(
        404,
        'Vendor not found.',
        null
      )
    }

    const deleteArgs: RepositoryArgument = new RepositoryArgument(
      { vendorId: request.vendorId },
      undefined,
      undefined
    )

    const deletedVendorPayout = await this.vendorPayoutRepository.delete(deleteArgs)

    if (deletedVendorPayout !== null) {
      const response = await this.paymentGateway.voidPayout(deletedVendorPayout.payoutId)
      console.log('void payout response :', response)
    }

    const createPayoutRequest: XenditCreatePayoutRequest = {
      externalId: foundVendor.data.id,
      amount: request.amount,
      email: foundVendor.data.email
    }

    const generatedPayout = await this.paymentGateway.generatePayoutUrl(createPayoutRequest)
    console.log('generatedPayoutUrl :', generatedPayout)

    const createArgs: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      { id: randomUUID(), vendorId: foundVendor.data.id, payoutId: generatedPayout.id }
    )
    const newVendorPayout = await this.vendorPayoutRepository.createOne(createArgs)

    console.log('newVendorPayout :', newVendorPayout)

    return new Result<string | null>(200, 'Payout url generated.', generatedPayout.payout_url)
  }
}
