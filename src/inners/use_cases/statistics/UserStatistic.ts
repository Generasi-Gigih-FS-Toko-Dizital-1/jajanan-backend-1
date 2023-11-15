import type UserRepository from '../../../outers/repositories/UserRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class UserStatistic {
  userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  count = async (): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      {
        deletedAt: null
      }
    )

    const count: number = await this.userRepository.count(args)

    return count
  }
}
