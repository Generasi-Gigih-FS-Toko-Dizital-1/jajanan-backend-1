import type TopUpHistoryRepository from '../../../outers/repositories/TopUpHistoryRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class TopUpHistoryStatistic {
  topUpHistoryRepository: TopUpHistoryRepository

  constructor (topUpHistoryRepository: TopUpHistoryRepository) {
    this.topUpHistoryRepository = topUpHistoryRepository
  }

  count = async (): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      {
        deletedAt: null
      }
    )

    const count: number = await this.topUpHistoryRepository.count(args)

    return count
  }
}
