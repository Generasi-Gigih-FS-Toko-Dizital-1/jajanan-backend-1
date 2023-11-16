import type AdminRepository from '../../../outers/repositories/AdminRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class AdminStatistic {
  adminRepository: AdminRepository

  constructor (adminRepository: AdminRepository) {
    this.adminRepository = adminRepository
  }

  count = async (whereInput: any): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput
    )

    const count: number = await this.adminRepository.count(args)

    return count
  }
}
