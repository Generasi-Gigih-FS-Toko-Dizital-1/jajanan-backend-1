import type OneDatastore from '../datastores/OneDatastore'
import { type User } from '@prisma/client'
import type UserAggregate from '../../inners/models/aggregates/UserAggregate'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class UserRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<User[] | UserAggregate[]> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUsers: User[] | UserAggregate[] = await this.oneDatastore.client.user.findMany(args)
    if (foundUsers === null) {
      throw new Error('Found users is undefined.')
    }

    return foundUsers
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdUser: User | UserAggregate = await this.oneDatastore.client.user.create(args)

    return createdUser
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }

    return foundUser
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: User | UserAggregate = await this.oneDatastore.client.user.update(args)
    if (patchedUser === null) {
      throw new Error('Patched user is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUser: User | UserAggregate = await this.oneDatastore.client.user.delete(args)

    return deletedUser
  }
}
