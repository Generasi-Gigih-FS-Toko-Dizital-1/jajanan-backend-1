import type PayoutHistoryRepository from '../../../outers/repositories/PayoutHistoryRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class PayoutHistoryStatistic {
  payoutHistoryRepository: PayoutHistoryRepository

  constructor (payoutHistoryRepository: PayoutHistoryRepository) {
    this.payoutHistoryRepository = payoutHistoryRepository
  }

  count = async (): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      {
        deletedAt: null
      }
    )

    const count: number = await this.payoutHistoryRepository.count(args)

    return count
  }
}
