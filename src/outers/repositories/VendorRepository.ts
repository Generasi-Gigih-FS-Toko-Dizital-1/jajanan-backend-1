import type OneDatastore from '../datastores/OneDatastore'
import { type Vendor } from '@prisma/client'
import type VendorAggregate from '../../inners/models/aggregates/VendorAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class VendorRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<Vendor[] | VendorAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendors: Vendor[] | VendorAggregate[] = await this.oneDatastore.client.vendor.findMany(args)
    if (foundVendors === null) {
      throw new Error('Found vendors is undefined.')
    }

    return foundVendors
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.create(args)

    return createdVendor
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }

    return foundVendor
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.update(args)
    if (patchedVendor === null) {
      throw new Error('Patched vendor is undefined.')
    }

    return patchedVendor
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<Vendor | VendorAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.delete(args)

    return deletedVendor
  }

  patchMany = async (repositoryArguments: RepositoryArgument[]): Promise<Vendor[] | VendorAggregate[]> => {
    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const operations: any[] = []
    for (const repositoryArgument of repositoryArguments) {
      const args: any = repositoryArgument.convertToPrismaArgs()
      const operation: any = this.oneDatastore.client.vendor.update(args)
      operations.push(operation)
    }

    const patchedVendors: Vendor[] | VendorAggregate[] = await this.oneDatastore.client.$transaction(operations)

    return patchedVendors
  }
}
