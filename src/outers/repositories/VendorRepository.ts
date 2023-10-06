import type OneDatastore from '../datastores/OneDatastore'
import { type Vendor } from '@prisma/client'
import type VendorAggregate from '../../inners/models/aggregates/VendorAggregate'
import type Pagination from '../../inners/models/value_objects/Pagination'

export default class VendorRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        notificationHistories: true,
        jajanItems: true
      }
    }
  }

  readMany = async (pagination: Pagination, isAggregated?: boolean): Promise<Vendor[] | VendorAggregate[]> => {
    const offset: number = (pagination.pageNumber - 1) * pagination.pageSize
    const args: any = {
      take: pagination.pageSize,
      skip: offset
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor[] | VendorAggregate[] = await this.oneDatastore.client.vendor.findMany(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is undefined.')
    }
    return foundVendor
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      where: {
        id
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }
    return foundVendor
  }

  readOneByUsername = async (username: string, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      where: {
        username
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }
    return foundVendor
  }

  readOneByEmail = async (email: string, isAggregated?: boolean): Promise<any > => {
    const args: any = {
      where: {
        email
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }
    return foundVendor
  }

  readOneByUsernameAndPassword = async (username: string, password: string, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      where: {
        username,
        password
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }
    return foundVendor
  }

  readOneByEmailAndPassword = async (email: string, password: string, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      where: {
        email,
        password
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundVendor: Vendor | VendorAggregate | null = await this.oneDatastore.client.vendor.findFirst(args)
    if (foundVendor === null) {
      throw new Error('Found vendor is null.')
    }
    return foundVendor
  }

  createOne = async (vendor: Vendor, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      data: vendor
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.create(args)

    return createdVendor
  }

  patchOneById = async (id: string, vendor: Vendor, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: vendor
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.update(args)
    if (patchedVendor === null) {
      throw new Error('Patched vendor is undefined.')
    }
    return patchedVendor
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<Vendor | VendorAggregate> => {
    const args: any = {
      where: {
        id
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedVendor: Vendor | VendorAggregate = await this.oneDatastore.client.vendor.delete(args)

    return deletedVendor
  }
}
