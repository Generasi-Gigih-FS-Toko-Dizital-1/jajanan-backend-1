import type OneDatastore from '../datastores/OneDatastore'
import { type Admin } from '@prisma/client'
import type RepositoryArgument from '../../inners/models/value_objects/RepositoryArgument'

export default class AdminRepository {
  oneDatastore: OneDatastore

  constructor (oneDatastore: OneDatastore) {
    this.oneDatastore = oneDatastore
  }

  readMany = async (repositoryArgument: RepositoryArgument): Promise<Admin[] > => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundAdmins: Admin[] = await this.oneDatastore.client.admin.findMany(args)
    if (foundAdmins === null) {
      throw new Error('Found admins is undefined.')
    }

    return foundAdmins
  }

  createOne = async (repositoryArgument: RepositoryArgument): Promise<Admin> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const createdAdmin: Admin = await this.oneDatastore.client.admin.create(args)

    return createdAdmin
  }

  readOne = async (repositoryArgument: RepositoryArgument): Promise<Admin> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const foundAdmin: Admin | null = await this.oneDatastore.client.admin.findFirst(args)
    if (foundAdmin === null) {
      throw new Error('Found admin is null.')
    }

    return foundAdmin
  }

  patchOne = async (repositoryArgument: RepositoryArgument): Promise<Admin> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const patchedAdmin: Admin = await this.oneDatastore.client.admin.update(args)
    if (patchedAdmin === null) {
      throw new Error('Patched admin is undefined.')
    }

    return patchedAdmin
  }

  deleteOne = async (repositoryArgument: RepositoryArgument): Promise<Admin> => {
    const args: any = repositoryArgument.convertToPrismaArgs()

    if (this.oneDatastore.client === undefined) {
      throw new Error('oneDatastore client is undefined.')
    }

    const deletedAdmin: Admin = await this.oneDatastore.client.admin.delete(args)

    return deletedAdmin
  }
}
