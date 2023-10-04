import type TopUpRepository from '../../../outers/repositories/TopUpRepository'
import type UserRepository from '../../../outers/repositories/UserRepository'
import Result from '../../models/value_objects/Result'
import type TopUpCreateRequest from '../../models/value_objects/requests/top_up/TopUpCreateRequest'
import { type User } from '@prisma/client'

export default class TopUp {
  topUpRepository
  userRepository

  constructor (topUpRepository: TopUpRepository, userRepository: UserRepository) {
    this.topUpRepository = topUpRepository
    this.userRepository = userRepository
  }

  generateTopUpUrl = async (request: TopUpCreateRequest): Promise<Result<string>> => {
    const user: User = await this.userRepository.readOneById(request.userId)

    const generatedTopUpUrl = await this.topUpRepository.generateTopUpUrl(request, user)

    return new Result<string>(
      201,
      'Top up url generated successfully.',
      generatedTopUpUrl
    )
  }
}
