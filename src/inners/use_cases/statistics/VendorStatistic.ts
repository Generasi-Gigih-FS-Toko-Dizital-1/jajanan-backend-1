import type VendorRepository from '../../../outers/repositories/VendorRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class VendorStatistic {
  vendorRepository: VendorRepository

  constructor (vendorRepository: VendorRepository) {
    this.vendorRepository = vendorRepository
  }

  count = async (whereInput: any): Promise<number> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput
    )

    const count: number = await this.vendorRepository.count(args)

    return count
  }
}
