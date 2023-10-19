import { type PayoutHistory } from '@prisma/client'
import type PayoutHistoryRepository from '../../../outers/repositories/PayoutHistoryRepository'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import Result from '../../models/value_objects/Result'
import type VendorManagement from './VendorManagement'

export default class PayoutHistoryManagement {
  constructor (
    private readonly payoutHistoryRepository: PayoutHistoryRepository,
    private readonly vendorManagement: VendorManagement,
    private readonly objectUtility: ObjectUtility) {}

  readOneById = async (id: string): Promise<Result<PayoutHistory | null>> => {
    let foundPayoutHistory: PayoutHistory | null
    try {
      const arg: RepositoryArgument = new RepositoryArgument({ id })
      foundPayoutHistory = await this.payoutHistoryRepository.readOne(arg)
    } catch (error) {
      return new Result<null>(404, `PayoutHistory read one by id failed, ${(error as Error).message}`, null)
    }

    return new Result<PayoutHistory>(200, 'PayoutHistory read one by id succeed.', foundPayoutHistory)
  }
}
