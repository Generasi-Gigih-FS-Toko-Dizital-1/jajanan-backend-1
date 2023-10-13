import { type JajanItem } from '@prisma/client'
import type Pagination from '../../inners/models/value_objects/Pagination'
import type OneDatastore from '../datastores/OneDatastore'
import type JajanItemAggregate from '../../inners/models/aggregates/JajanItemAggregate'

export default class JajanItemRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        vendor: true,
        category: true
      }
    }
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<JajanItem[] | JajanItemAggregate[]> => {
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

    const foundJajanItems: JajanItem[] | JajanItemAggregate[] = await this.oneDatastore.client.jajanItem.findMany(args)
    if (foundJajanItems === null) {
      throw new Error('Found Jajan Item is undefined.')
    }
    return foundJajanItems
  }

  readManyByIds = async (ids: string[], isAggregated?: boolean): Promise<JajanItem[] | JajanItemAggregate[]> => {
    const args: any = {
      where: {
        id: {
          in: ids
        }
      }
    }

    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundJajanItems: JajanItem[] | JajanItemAggregate[] = await this.oneDatastore.client.jajanItem.findMany(args)
    if (foundJajanItems === null) {
      throw new Error('Found Jajan Item is undefined.')
    }
    return foundJajanItems
  }

  createOne = async (jajanItem: JajanItem, isAggregated?: boolean): Promise<JajanItem | JajanItemAggregate> => {
    const args: any = {
      data: jajanItem
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdItem: JajanItem | JajanItemAggregate = await this.oneDatastore.client.jajanItem.create(args)

    return createdItem
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<JajanItem | JajanItemAggregate> => {
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

    const foundJajanItem: JajanItem | JajanItemAggregate | null = await this.oneDatastore.client.jajanItem.findFirst(args)
    if (foundJajanItem === null) {
      throw new Error('Found jajan item is null.')
    }
    return foundJajanItem
  }

  patchOneById = async (id: string, jajanItem: JajanItem, isAggregated?: boolean): Promise<JajanItem | JajanItemAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: jajanItem
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: JajanItem | JajanItemAggregate = await this.oneDatastore.client.jajanItem.update(args)
    if (patchedUser === null) {
      throw new Error('Patched jajan item is undefined.')
    }
    return patchedUser
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<JajanItem | JajanItemAggregate> => {
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

    const deletedJajanItem: JajanItem | JajanItemAggregate = await this.oneDatastore.client.jajanItem.delete(args)

    return deletedJajanItem
  }
}
