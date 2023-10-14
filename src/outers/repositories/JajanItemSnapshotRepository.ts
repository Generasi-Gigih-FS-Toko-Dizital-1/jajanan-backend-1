import { type JajanItemSnapshot } from '@prisma/client'
import type Pagination from '../../inners/models/value_objects/Pagination'
import type OneDatastore from '../datastores/OneDatastore'
import type JajanItemSnapshotAggregate from '../../inners/models/aggregates/JajanItemSnapshotAggregate'

export default class JajanItemSnapshotRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        origin: true,
        vendor: true,
        category: true,
        transactionItemHistories: true
      }
    }
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<JajanItemSnapshot[] | JajanItemSnapshotAggregate[]> => {
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

    const foundJajanItemSnapshots: JajanItemSnapshot[] | JajanItemSnapshotAggregate[] = await this.oneDatastore.client.jajanItemSnapshot.findMany(args)
    if (foundJajanItemSnapshots === null) {
      throw new Error('Found Jajan Item is undefined.')
    }
    return foundJajanItemSnapshots
  }

  readManyByIds = async (ids: string[], isAggregated?: boolean): Promise<JajanItemSnapshot[] | JajanItemSnapshotAggregate[]> => {
    const args: any = {
      data: {
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

    const foundJajanItemSnapshots: JajanItemSnapshot[] | JajanItemSnapshotAggregate[] = await this.oneDatastore.client.jajanItemSnapshot.findMany(args)
    if (foundJajanItemSnapshots === null) {
      throw new Error('Found Jajan Item is undefined.')
    }
    return foundJajanItemSnapshots
  }

  createOne = async (jajanItemSnapshot: JajanItemSnapshot, isAggregated?: boolean): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
    const args: any = {
      data: jajanItemSnapshot
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdItem: JajanItemSnapshot | JajanItemSnapshotAggregate = await this.oneDatastore.client.jajanItemSnapshot.create(args)

    return createdItem
  }

  createMany = async (jajanItemSnapshots: JajanItemSnapshot[], isAggregated?: boolean): Promise<JajanItemSnapshot[] | JajanItemSnapshotAggregate[]> => {
    const args: any = {
      data: jajanItemSnapshots
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    await this.oneDatastore.client.jajanItemSnapshot.createMany(args)

    return jajanItemSnapshots
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
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

    const foundJajanItemSnapshot: JajanItemSnapshot | JajanItemSnapshotAggregate | null = await this.oneDatastore.client.jajanItemSnapshot.findFirst(args)
    if (foundJajanItemSnapshot === null) {
      throw new Error('Found jajan item is null.')
    }
    return foundJajanItemSnapshot
  }

  patchOneById = async (id: string, jajanItemSnapshot: JajanItemSnapshot, isAggregated?: boolean): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: jajanItemSnapshot
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: JajanItemSnapshot | JajanItemSnapshotAggregate = await this.oneDatastore.client.jajanItemSnapshot.update(args)
    if (patchedUser === null) {
      throw new Error('Patched jajan item is undefined.')
    }
    return patchedUser
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<JajanItemSnapshot | JajanItemSnapshotAggregate> => {
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

    const deletedJajanItemSnapshot: JajanItemSnapshot | JajanItemSnapshotAggregate = await this.oneDatastore.client.jajanItemSnapshot.delete(args)

    return deletedJajanItemSnapshot
  }
}
