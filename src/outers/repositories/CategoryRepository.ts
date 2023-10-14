import { type Category } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type CategoryAggregate from '../../inners/models/aggregates/CategoryAggregate'
import type Pagination from '../../inners/models/value_objects/Pagination'

export default class CategoryRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
    this.aggregatedArgs = {
      include: {
        jajanItems: true,
        jajanItemSnapshot: true,
        userSubscriptions: true
      }
    }
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Category[] | CategoryAggregate[]> => {
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

    const foundCategories: Category[] | CategoryAggregate[] = await this.oneDatastore.client.category.findMany(args)
    if (foundCategories === null) {
      throw new Error('Found category is undefined.')
    }
    return foundCategories
  }

  createOne = async (category: Category, isAggregated?: boolean): Promise<Category | CategoryAggregate> => {
    const args: any = {
      data: category
    }

    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdCategory: Category | CategoryAggregate = await this.oneDatastore.client.category.create(args)

    return createdCategory
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<Category | CategoryAggregate> => {
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

    const foundCategory: Category | CategoryAggregate | null = await this.oneDatastore.client.category.findFirst(args)
    if (foundCategory === null) {
      throw new Error('Found category is null.')
    }
    return foundCategory
  }

  patchOneById = async (id: string, jajanItem: Category, isAggregated?: boolean): Promise<Category | CategoryAggregate> => {
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

    const patchedUser: Category | CategoryAggregate = await this.oneDatastore.client.category.update(args)
    if (patchedUser === null) {
      throw new Error('Patched category is undefined.')
    }
    return patchedUser
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<Category | CategoryAggregate> => {
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

    const deletedCategory: Category | CategoryAggregate = await this.oneDatastore.client.category.delete(args)

    return deletedCategory
  }
}
