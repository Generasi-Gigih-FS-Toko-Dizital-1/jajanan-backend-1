import { type VendorLevel } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class VendorLevelRepository {
  oneDatastore: OneDatastore

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<VendorLevel[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorLevels: VendorLevel[] = await this.oneDatastore.client.vendorLevel.findMany(args)
    if (foundVendorLevels === null) {
      throw new Error('Found vendorLevels is undefined.')
    }

    return foundVendorLevels
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdVendorLevel: VendorLevel = await this.oneDatastore.client.vendorLevel.create(args)

    return createdVendorLevel
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<VendorLevel | null> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorLevel: VendorLevel | null = await this.oneDatastore.client.vendorLevel.findFirst(args)

    return foundVendorLevel
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedVendor: VendorLevel = await this.oneDatastore.client.vendorLevel.update(args)
    if (patchedVendor === null) {
      throw new Error('Patched vendorLevel is undefined.')
    }

    return patchedVendor
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedVendorLevel: VendorLevel = await this.oneDatastore.client.vendorLevel.delete(args)

    return deletedVendorLevel
  }
}
