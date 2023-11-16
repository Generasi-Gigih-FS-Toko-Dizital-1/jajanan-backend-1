import type UserRepository from '../../../outers/repositories/UserRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class UserStatistic {
  userRepository: UserRepository

  constructor (userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  count = async (whereInput: any): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput
    )

    const count: number = await this.userRepository.count(args)

    return count
  }
}
