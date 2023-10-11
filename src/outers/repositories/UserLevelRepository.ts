import { type UserLevel } from '@prisma/client'
import type Pagination from '../../inners/models/value_objects/Pagination'
import type OneDatastore from '../datastores/OneDatastore'

export default class UserLevelRepository {
  oneDatastore: OneDatastore

  constructor (
    oneDatastore: OneDatastore
  ) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<UserLevel[]> => {
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

    const foundUserLevels: UserLevel[] = await this.oneDatastore.client.userLevel.findMany(args)
    if (foundUserLevels === null) {
      throw new Error('Found user level is undefined.')
    }
    return foundUserLevels
  }

  createOne = async (userLevel: UserLevel): Promise<UserLevel> => {
    const args: any = {
      data: userLevel
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdItem: UserLevel = await this.oneDatastore.client.userLevel.create(args)

    return createdItem
  }

  readOneById = async (id: string): Promise<UserLevel> => {
    const args: any = {
      where: {
        id
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundUserLevel: UserLevel | null = await this.oneDatastore.client.userLevel.findFirst(args)
    if (foundUserLevel === null) {
      throw new Error('Found user level is null.')
    }
    return foundUserLevel
  }

  patchOneById = async (id: string, userLevel: UserLevel): Promise<UserLevel> => {
    const args: any = {
      where: {
        id
      },
      data: userLevel
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedUser: UserLevel = await this.oneDatastore.client.userLevel.update(args)
    if (patchedUser === null) {
      throw new Error('Patched user level is undefined.')
    }
    return patchedUser
  }

  deleteOneById = async (id: string): Promise<UserLevel> => {
    const args: any = {
      where: {
        id
      }

    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedUserLevel: UserLevel = await this.oneDatastore.client.userLevel.delete(args)

    return deletedUserLevel
  }
}
