import { type Category } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type CategoryAggregate from '../../inners/models/aggregates/CategoryAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class CategoryRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<Category[] | CategoryAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundCategories: Category[] | CategoryAggregate[] = await this.oneDatastore.client.category.findMany(args)
    if (foundCategories === null) {
      throw new Error('Found categories is undefined.')
    }

    return foundCategories
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<Category | CategoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdCategory: Category | CategoryAggregate = await this.oneDatastore.client.category.create(args)

    return createdCategory
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<Category | CategoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundCategory: Category | CategoryAggregate | null = await this.oneDatastore.client.category.findFirst(args)
    if (foundCategory === null) {
      throw new Error('Found category is null.')
    }

    return foundCategory
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<Category | CategoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: Category | CategoryAggregate = await this.oneDatastore.client.category.update(args)
    if (patchedUser === null) {
      throw new Error('Patched category is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<Category | CategoryAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedCategory: Category | CategoryAggregate = await this.oneDatastore.client.category.delete(args)

    return deletedCategory
  }
}
