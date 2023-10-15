import { type UserLevel } from '@prisma/client'
import type OneDatastore from '../datastores/OneDatastore'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class UserLevelRepository {
  oneDatastore: OneDatastore

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (argument: RepositoryArgument): Promise<UserLevel[]> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserLevels: UserLevel[] = await this.oneDatastore.client.userLevel.findMany(args)
    if (foundUserLevels === null) {
      throw new Error('Found userLevels is undefined.')
    }

    return foundUserLevels
  }

  createOne = async (argument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdUserLevel: UserLevel = await this.oneDatastore.client.userLevel.create(args)

    return createdUserLevel
  }

  readOne = async (argument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserLevel: UserLevel | null = await this.oneDatastore.client.userLevel.findFirst(args)
    if (foundUserLevel === null) {
      throw new Error('Found userLevel is null.')
    }

    return foundUserLevel
  }

  patchOne = async (argument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: UserLevel = await this.oneDatastore.client.userLevel.update(args)
    if (patchedUser === null) {
      throw new Error('Patched userLevel is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (argument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUserLevel: UserLevel = await this.oneDatastore.client.userLevel.delete(args)

    return deletedUserLevel
  }
}
