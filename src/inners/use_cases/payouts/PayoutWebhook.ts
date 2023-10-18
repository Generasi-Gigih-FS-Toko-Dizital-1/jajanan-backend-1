import { type PayoutHistory, type Vendor } from '@prisma/client'
import type PayoutHistoryRepository from '../../../outers/repositories/PayoutHistoryRepository'
import type VendorRepository from '../../../outers/repositories/VendorRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import Result from '../../models/value_objects/Result'

export default class PayoutWebhook {
  constructor (
    private readonly payoutHistoryRepository: PayoutHistoryRepository,
    private readonly vendorRepository: VendorRepository
  ) {}

  execute = async (data: any): Promise<Result<PayoutHistory | null>> => {
    const { externalId: vendorId } = data
    const getVendorArgs: RepositoryArgument = new RepositoryArgument(
      { id: vendorId },
      undefined,
      undefined
    )
    const vendor: Vendor = await this.vendorRepository.readOne(getVendorArgs)
    try {
      const vendorArgs: RepositoryArgument = new RepositoryArgument(
        { xenditPayoutId: data.id },
        undefined,
        undefined,
        undefined
      )
      await this.payoutHistoryRepository.readOne(vendorArgs)
      return new Result(
        400,
        'This request already processed',
        null)
    } catch (error: any) {
      const payoutHistory: PayoutHistory = await this.payoutHistoryRepository.createByWebhook(data)

      const updatedBalanceVendor: Vendor = {
        ...vendor,
        balance: vendor.balance - payoutHistory.amount,
        updatedAt: new Date()
      }

      const patchVendorArgs: RepositoryArgument = new RepositoryArgument(
        { id: vendorId },
        undefined,
        undefined,
        updatedBalanceVendor
      )

      await this.vendorRepository.patchOne(patchVendorArgs)
      return new Result(
        200,
        'Top up succeed.',
        payoutHistory)
    }
  }
}
