import { type VendorLevel } from '@prisma/client'
import type Pagination from '../../inners/models/value_objects/Pagination'
import type OneDatastore from '../datastores/OneDatastore'

export default class VendorLevelRepository {
  oneDatastore: OneDatastore

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<VendorLevel[]> => {
    const offset: number = (pagination.pageNumber - 1) * pagination.pageSize
    const args: any = {
      take: pagination.pageSize,
      skip: offset,
      where: whereInput,
      include: includeInput
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorLevels: VendorLevel[] = await this.oneDatastore.client.vendorLevel.findMany(args)
    if (foundVendorLevels === null) {
      throw new Error('Found vendor level is undefined.')
    }
    return foundVendorLevels
  }

  createOne = async (vendorLevel: VendorLevel): Promise<VendorLevel> => {
    const args: any = {
      data: vendorLevel
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdItem: VendorLevel = await this.oneDatastore.client.vendorLevel.create(args)

    return createdItem
  }

  readOneById = async (id: string): Promise<VendorLevel> => {
    const args: any = {
      where: {
        id
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendorLevel: VendorLevel | null = await this.oneDatastore.client.vendorLevel.findFirst(args)
    if (foundVendorLevel === null) {
      throw new Error('Found vendor level is null.')
    }
    return foundVendorLevel
  }

  patchOneById = async (id: string, vendorLevel: VendorLevel): Promise<VendorLevel> => {
    const args: any = {
      where: {
        id
      },
      data: vendorLevel
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedVendor: VendorLevel = await this.oneDatastore.client.vendorLevel.update(args)
    if (patchedVendor === null) {
      throw new Error('Patched vendor level is undefined.')
    }
    return patchedVendor
  }

  deleteOneById = async (id: string): Promise<VendorLevel> => {
    const args: any = {
      where: {
        id
      }

    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedVendorLevel: VendorLevel = await this.oneDatastore.client.vendorLevel.delete(args)

    return deletedVendorLevel
  }
}
