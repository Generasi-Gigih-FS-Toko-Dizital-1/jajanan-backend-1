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

  readMany = async (argument: RepositoryArgument): Promise<VendorLevel[]> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorLevels: VendorLevel[] = await this.oneDatastore.client.vendorLevel.findMany(args)
    if (foundVendorLevels === null) {
      throw new Error('Found vendorLevels is undefined.')
    }

    return foundVendorLevels
  }

  createOne = async (argument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdVendorLevel: VendorLevel = await this.oneDatastore.client.vendorLevel.create(args)

    return createdVendorLevel
  }

  readOne = async (argument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorLevel: VendorLevel | null = await this.oneDatastore.client.vendorLevel.findFirst(args)
    if (foundVendorLevel === null) {
      throw new Error('Found vendorLevel is null.')
    }

    return foundVendorLevel
  }

  patchOne = async (argument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedVendor: VendorLevel = await this.oneDatastore.client.vendorLevel.update(args)
    if (patchedVendor === null) {
      throw new Error('Patched vendorLevel is undefined.')
    }

    return patchedVendor
  }

  deleteOne = async (argument: RepositoryArgument): Promise<VendorLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedVendorLevel: VendorLevel = await this.oneDatastore.client.vendorLevel.delete(args)

    return deletedVendorLevel
  }
}
