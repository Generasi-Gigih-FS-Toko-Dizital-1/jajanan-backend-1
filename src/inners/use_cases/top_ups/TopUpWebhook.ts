import { type TopUpHistory, type User } from '@prisma/client'
import type TopUpHistoryRepository from '../../../outers/repositories/TopUpHistoryRepository'
import type UserRepository from '../../../outers/repositories/UserRepository'
import Result from '../../models/value_objects/Result'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class TopUpWebhook {
  topUpHistoryRepository: TopUpHistoryRepository
  userRepository: UserRepository
  constructor (topUpHistoryRepository: TopUpHistoryRepository, userRepository: UserRepository) {
    this.topUpHistoryRepository = topUpHistoryRepository
    this.userRepository = userRepository
  }

  execute = async (data: any): Promise<Result<TopUpHistory | null>> => {
    const { externalId: userId } = data

    const userArgs: RepositoryArgument = new RepositoryArgument(
      { id: userId },
      undefined,
      undefined
    )
    const user: User = await this.userRepository.readOne(userArgs)
    const topUpHistory: TopUpHistory = await this.topUpHistoryRepository.createByWebhook(data)
    const updatedBalanceUser: User = {
      ...user,
      balance: user.balance + topUpHistory.amount,
      updatedAt: new Date()
    }
    const args: RepositoryArgument = new RepositoryArgument(
      { id: userId },
      undefined,
      undefined,
      updatedBalanceUser
    )
    await this.userRepository.patchOne(args)
    return new Result(
      200,
      'Top up succeed.',
      topUpHistory
    )
  }
}
