import { type VendorPayout, type Vendor } from '@prisma/client'
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
      return new Result<null>(
        404,
        'Vendor not found.',
        null
      )
    }

    if (request.amount > foundVendor.data.balance) {
      return new Result<null>(
        400,
        'Insufficient balance.',
        null
      )
    }

    const readArgs: RepositoryArgument = new RepositoryArgument(
      { vendorId: request.vendorId },
      undefined,
      undefined
    )

    const VendorPayout = await this.vendorPayoutRepository.readOne(readArgs)

    if (VendorPayout !== null) {
      await this.paymentGateway.voidPayout(VendorPayout.payoutId)
      await this.vendorPayoutRepository.delete(readArgs)
    }

    const createPayoutRequest: XenditCreatePayoutRequest = {
      external_id: foundVendor.data.id,
      amount: request.amount,
      email: foundVendor.data.email
    }

    const generatedPayout = await this.paymentGateway.generatePayoutUrl(createPayoutRequest)

    const createVendorPayout: VendorPayout = {
      id: randomUUID(),
      vendorId: foundVendor.data.id,
      payoutId: generatedPayout.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    const createArgs: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      createVendorPayout
    )
    await this.vendorPayoutRepository.createOne(createArgs)

    return new Result<string | null>(201, 'Payout url generated.', generatedPayout.payout_url)
  }
}
