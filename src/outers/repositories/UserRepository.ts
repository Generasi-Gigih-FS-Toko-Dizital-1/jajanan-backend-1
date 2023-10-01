import type OneDatastore from '../datastores/OneDatastore'
import { type User } from '@prisma/client'
import type UserAggregate from '../../inners/models/aggregates/UserAggregate'
import type Pagination from '../../inners/models/value_objects/Pagination'

export default class UserRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (datastoreOne: OneDatastore) {
    this.oneDatastore = datastoreOne
    this.aggregatedArgs = {
      include: {
        notificationHistories: true,
        topUpHistories: true,
        transactionHistories: true,
        userSubscriptions: true
      }
    }
  }

  readMany = async (pagination: Pagination, isAggregated?: boolean): Promise<User[] | UserAggregate[]> => {
    const offset: number = (pagination.pageNumber - 1) * pagination.itemPerPage
    const args: any = {
      take: pagination.itemPerPage,
      skip: offset
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundUser: User[] | UserAggregate[] = await this.oneDatastore.client.user.findMany(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
    }
    return foundUser
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<User | UserAggregate> => {
    const args: any = {
      where: {
        id
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }
    return foundUser
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
      throw new Error('oneDatastore client is undefined')
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
      throw new Error('oneDatastore client is undefined')
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
      throw new Error('oneDatastore client is undefined')
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
      throw new Error('oneDatastore client is undefined')
    }

    const foundUser: User | UserAggregate | null = await this.oneDatastore.client.user.findFirst(args)
    if (foundUser === null) {
      throw new Error('Found user is null.')
    }
    return foundUser
  }

  createOne = async (user: User, isAggregated?: boolean): Promise<User | UserAggregate> => {
    const args: any = {
      data: user
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const createdUser: User | UserAggregate = await this.oneDatastore.client.user.create(args)
    if (createdUser === undefined) {
      throw new Error('Created user is undefined.')
    }
    return createdUser
  }

  patchOneById = async (id: string, user: User, isAggregated?: boolean): Promise<User | UserAggregate> => {
    const args: any = {
      where: {
        id
      },
      data: user
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const patchedUser: User | UserAggregate = await this.oneDatastore.client.user.update(args)
    if (patchedUser === undefined) {
      throw new Error('Patched user is undefined.')
    }
    return patchedUser
  }

  deleteOneById = async (id: string, isAggregated?: boolean): Promise<User | UserAggregate> => {
    const args: any = {
      where: {
        id
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const deletedUser: User | UserAggregate = await this.oneDatastore.client.user.delete(args)

    return deletedUser
  }
}
