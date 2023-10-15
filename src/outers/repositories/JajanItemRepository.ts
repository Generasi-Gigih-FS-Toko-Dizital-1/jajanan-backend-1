import { type JajanItem } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type JajanItemAggregate from '../../inners/models/aggregates/JajanItemAggregate'

import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class JajanItemRepository {
  oneDatastore: OneDatastore
  aggregatedArgs?: any

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (argument: RepositoryArgument): Promise<JajanItem[] | JajanItemAggregate[]> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundJajanItems: JajanItem[] | JajanItemAggregate[] = await this.oneDatastore.client.jajanItem.findMany(args)
    if (foundJajanItems === null) {
      throw new Error('Found jajanItems is undefined.')
    }

    return foundJajanItems
  }

  createOne = async (argument: RepositoryArgument): Promise<JajanItem | JajanItemAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdJajanItem: JajanItem | JajanItemAggregate = await this.oneDatastore.client.jajanItem.create(args)

    return createdJajanItem
  }

  readOne = async (argument: RepositoryArgument): Promise<JajanItem | JajanItemAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundJajanItem: JajanItem | JajanItemAggregate | null = await this.oneDatastore.client.jajanItem.findFirst(args)
    if (foundJajanItem === null) {
      throw new Error('Found jajanItem is null.')
    }

    return foundJajanItem
  }

  patchOne = async (argument: RepositoryArgument): Promise<JajanItem | JajanItemAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: JajanItem | JajanItemAggregate = await this.oneDatastore.client.jajanItem.update(args)
    if (patchedUser === null) {
      throw new Error('Patched jajanItem is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (argument: RepositoryArgument): Promise<JajanItem | JajanItemAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedJajanItem: JajanItem | JajanItemAggregate = await this.oneDatastore.client.jajanItem.delete(args)

    return deletedJajanItem
  }
}
