import { type VendorPayout } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class VendorPayoutRepository {
  oneDatastore: OneDatastore
  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<VendorPayout | null> => {
    const args: any = repositoryArgument.convertToPrismaArgs()
    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorPayout: VendorPayout | null = await this.oneDatastore.client.vendorPayout.findFirst(args)

    return foundVendorPayout
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<VendorPayout | null> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdVendorPayout: VendorPayout | null = await this.oneDatastore.client.vendorPayout.create(args)

    return createdVendorPayout
  }

  delete = async (repositoryArgument: RepositoryArgument): Promise<void> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    await this.oneDatastore.client.vendorPayout.deleteMany(args)
  }
}
