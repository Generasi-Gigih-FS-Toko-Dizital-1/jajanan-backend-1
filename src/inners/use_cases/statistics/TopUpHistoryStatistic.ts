import type TopUpHistoryRepository from '../../../outers/repositories/TopUpHistoryRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class TopUpHistoryStatistic {
  topUpHistoryRepository: TopUpHistoryRepository

  constructor (topUpHistoryRepository: TopUpHistoryRepository) {
    this.topUpHistoryRepository = topUpHistoryRepository
  }

  count = async (whereInput: any): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput
    )

    const count: number = await this.topUpHistoryRepository.count(args)

    return count
  }
}
