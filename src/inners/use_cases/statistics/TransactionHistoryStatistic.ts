import type TransactionHistoryRepository from '../../../outers/repositories/TransactionHistoryRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class TransactionHistoryStatistic {
  transactionHistoryRepository: TransactionHistoryRepository

  constructor (transactionHistoryRepository: TransactionHistoryRepository) {
    this.transactionHistoryRepository = transactionHistoryRepository
  }

  count = async (): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      {
        deletedAt: null
      }
    )

    const count: number = await this.transactionHistoryRepository.count(args)

    return count
  }
}
