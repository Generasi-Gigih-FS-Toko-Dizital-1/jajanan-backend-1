import type OneDatastore from '../datastores/OneDatastore'
import { type User } from '@prisma/client'
import type UserAggregate from '../../inners/models/aggregates/UserAggregate'

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

  readAll = async (isAggregated?: boolean): Promise<User[] | UserAggregate[]> => {
    const args: any = {}
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }
    const foundUser: User[] | UserAggregate[] | undefined = await this.oneDatastore.client?.user.findMany(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
    }
    return foundUser
  }

  readOneById = async (id: string, isAggregated?: boolean): Promise<User | UserAggregate | null > => {
    const args: any = {
      where: {
        id
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }
    const foundUser: User | UserAggregate | null | undefined = await this.oneDatastore.client?.user.findFirst(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
    }
    return foundUser
  }

  readOneByUsername = async (username: string, isAggregated?: boolean): Promise<User | UserAggregate | null > => {
    const args: any = {
      where: {
        username
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }
    const foundUser: User | UserAggregate | null | undefined = await this.oneDatastore.client?.user.findFirst(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
    }
    return foundUser
  }

  readOneByEmail = async (email: string, isAggregated?: boolean): Promise<any | null > => {
    const args: any = {
      where: {
        email
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }
    const foundUser: User | UserAggregate | null | undefined = await this.oneDatastore.client?.user.findFirst(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
    }
    return foundUser
  }

  readOneByUsernameAndPassword = async (username: string, password: string, isAggregated?: boolean): Promise<User | UserAggregate | null> => {
    const args: any = {
      where: {
        username,
        password
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }
    const foundUser: User | UserAggregate | null | undefined = await this.oneDatastore.client?.user.findFirst(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
    }
    return foundUser
  }

  readOneByEmailAndPassword = async (email: string, password: string, isAggregated?: boolean): Promise<User | UserAggregate | null> => {
    const args: any = {
      where: {
        email,
        password
      }
    }
    if (isAggregated === true) {
      args.include = this.aggregatedArgs.include
    }
    const foundUser: User | UserAggregate | null | undefined = await this.oneDatastore.client?.user.findFirst(args)
    if (foundUser === undefined) {
      throw new Error('Found user is undefined.')
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
    const createdUser: User | UserAggregate | undefined = await this.oneDatastore.client?.user.create(args)
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
    const patchedUser: User | UserAggregate | undefined = await this.oneDatastore.client?.user.update(args)
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
    const deletedUser: User | UserAggregate | undefined = await this.oneDatastore.client?.user.delete(args)
    if (deletedUser === undefined) {
      throw new Error('Deleted user is undefined.')
    }
    return deletedUser
  }
}
