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

  readMany = async (repositoryArgument: RepositoryArgument): Promise<UserLevel[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserLevels: UserLevel[] = await this.oneDatastore.client.userLevel.findMany(args)
    if (foundUserLevels === null) {
      throw new Error('Found userLevels is undefined.')
    }

    return foundUserLevels
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdUserLevel: UserLevel = await this.oneDatastore.client.userLevel.create(args)

    return createdUserLevel
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<UserLevel | null> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserLevel: UserLevel | null = await this.oneDatastore.client.userLevel.findFirst(args)

    return foundUserLevel
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: UserLevel = await this.oneDatastore.client.userLevel.update(args)
    if (patchedUser === null) {
      throw new Error('Patched userLevel is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<UserLevel> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUserLevel: UserLevel = await this.oneDatastore.client.userLevel.delete(args)

    return deletedUserLevel
  }
}
