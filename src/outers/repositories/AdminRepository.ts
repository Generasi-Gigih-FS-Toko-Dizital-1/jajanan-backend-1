import type OneDatastore from '../datastores/OneDatastore'
import { type Admin } from '@prisma/client'
import type Pagination from '../../inners/models/value_objects/Pagination'

export default class AdminRepository {
  oneDatastore: OneDatastore
  aggregatedArgs: any

  constructor (datastoreOne: OneDatastore) {
    this.oneDatastore = datastoreOne
  }

  readMany = async (pagination: Pagination): Promise<Admin[] > => {
    const offset: number = (pagination.pageNumber - 1) * pagination.pageSize
    const args: any = {
      take: pagination.pageSize,
      skip: offset
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundAdmin: Admin[] = await this.oneDatastore.client.admin.findMany(args)
    if (foundAdmin === null) {
      throw new Error('Found admins is undefined.')
    }
    return foundAdmin
  }

  readOneById = async (id: string): Promise<Admin > => {
    const args: any = {
      where: {
        id
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundAdmin: Admin | null = await this.oneDatastore.client.admin.findFirst(args)
    if (foundAdmin === null) {
      throw new Error('Found admins is null.')
    }
    return foundAdmin
  }

  readOneByAdminname = async (adminname: string): Promise<Admin > => {
    const args: any = {
      where: {
        adminname
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundAdmin: Admin | null = await this.oneDatastore.client.admin.findFirst(args)
    if (foundAdmin === null) {
      throw new Error('Found admins is null.')
    }
    return foundAdmin
  }

  readOneByEmail = async (email: string): Promise<any > => {
    const args: any = {
      where: {
        email
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundAdmin: Admin | null = await this.oneDatastore.client.admin.findFirst(args)
    if (foundAdmin === null) {
      throw new Error('Found admins is null.')
    }
    return foundAdmin
  }

  readOneByAdminnameAndPassword = async (adminname: string, password: string): Promise<Admin > => {
    const args: any = {
      where: {
        adminname,
        password
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundAdmin: Admin | null = await this.oneDatastore.client.admin.findFirst(args)
    if (foundAdmin === null) {
      throw new Error('Found admins is null.')
    }
    return foundAdmin
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Admin > => {
    const args: any = {
      where: {
        email,
        password
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const foundAdmin: Admin | null = await this.oneDatastore.client.admin.findFirst(args)
    if (foundAdmin === null) {
      throw new Error('Found admins is null.')
    }
    return foundAdmin
  }

  createOne = async (admin: Admin): Promise<Admin > => {
    const args: any = {
      data: admin
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const createdAdmin: Admin = await this.oneDatastore.client.admin.create(args)
    if (createdAdmin === undefined) {
      throw new Error('Created admins is undefined.')
    }
    return createdAdmin
  }

  patchOneById = async (id: string, admin: Admin): Promise<Admin > => {
    const args: any = {
      where: {
        id
      },
      data: admin
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const patchedAdmin: Admin = await this.oneDatastore.client.admin.update(args)
    if (patchedAdmin === null) {
      throw new Error('Patched admins is undefined.')
    }
    return patchedAdmin
  }

  deleteOneById = async (id: string): Promise<Admin > => {
    const args: any = {
      where: {
        id
      }
    }

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined')
    }

    const deletedAdmin: Admin = await this.oneDatastore.client.admin.delete(args)

    return deletedAdmin
  }
}
