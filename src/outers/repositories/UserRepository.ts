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

  readOneByUsername = async (username: string, isAggregated?: boolean): Promise<User | UserAggregate> => {
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

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }
    return foundUser
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

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }
    return foundUser
  }

  readOneByUsernameAndPassword = async (username: string, password: string, isAggregated?: boolean): Promise<User | UserAggregate> => {
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

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }
    return foundUser
  }

  readOneByEmailAndPassword = async (email: string, password: string, isAggregated?: boolean): Promise<User | UserAggregate> => {
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

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }
    return foundUser
  }

  readMany = async (argument: RepositoryArgument): Promise<User[] | UserAggregate[]> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUsers: User[] | UserAggregate[] = await this.oneDatastore.client.user.findMany(args)
    if (foundUsers === null) {
      throw new Error('Found users is undefined.')
    }

    return foundUsers
  }

  createOne = async (argument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdUser: User | UserAggregate = await this.oneDatastore.client.user.create(args)

    return createdUser
  }

  readOne = async (argument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }

    return foundUser
  }

  patchOne = async (argument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: User | UserAggregate = await this.oneDatastore.client.user.update(args)
    if (patchedUser === null) {
      throw new Error('Patched user is undefined.')
    }

    return patchedUser
  }

  deleteOne = async (argument: RepositoryArgument): Promise<User | UserAggregate> => {
    const args: any = argument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUser: User | UserAggregate = await this.oneDatastore.client.user.delete(args)

    return deletedUser
  }
}
