import { type TopUpHistory, type User } from '@prisma/client'
import type TopUpHistoryRepository from '../../../outers/repositories/TopUpHistoryRepository'
import type UserRepository from '../../../outers/repositories/UserRepository'
import Result from '../../models/value_objects/Result'

export default class TopUpWebhook {
  topUpHistoryRepository: TopUpHistoryRepository
  userRepository: UserRepository
  constructor (topUpHistoryRepository: TopUpHistoryRepository, userRepository: UserRepository) {
    this.topUpHistoryRepository = topUpHistoryRepository
    this.userRepository = userRepository
  }

  execute = async (data: any): Promise<Result<TopUpHistory | null>> => {
    const { externalId: userId, id } = data
    const user: User = await this.userRepository.readOneById(userId)
    const sameId = await this.topUpHistoryRepository.readOneById(id, true)
    if (sameId !== null) {
      return new Result(400, 'Top up history already exist', null)
    }
    const topUpHistory: TopUpHistory = await this.topUpHistoryRepository.createByWebhook(data)
    const updatedBalanceUser: User = {
      ...user,
      balance: user.balance + topUpHistory.amount,
      updatedAt: new Date()
    }
    await this.userRepository.patchOneById(userId, updatedBalanceUser)
    return new Result(
      200,
      'Top up succeed.',
      topUpHistory
    )
  }
}
