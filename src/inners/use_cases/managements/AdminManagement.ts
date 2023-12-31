import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type AdminRepository from '../../../outers/repositories/AdminRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { type Admin } from '@prisma/client'
import type AdminManagementCreateRequest
  from '../../models/value_objects/requests/managements/admin_managements/AdminManagementCreateRequest'
import type AdminManagementPatchRequest
  from '../../models/value_objects/requests/managements/admin_managements/AdminManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class AdminManagement {
  adminRepository: AdminRepository
  objectUtility: ObjectUtility

  constructor (adminRepository: AdminRepository, objectUtility: ObjectUtility) {
    this.adminRepository = adminRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any): Promise<Result<Admin[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      undefined,
      pagination
    )

    const foundAdmins: Admin[] = await this.adminRepository.readMany(args)
    return new Result<Admin[]>(
      200,
      'Admin read many succeed.',
      foundAdmins
    )
  }

  readOneById = async (id: string): Promise<Result<Admin | null>> => {
    let foundAdmin: Admin
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundAdmin = await this.adminRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Admin read one by id failed, admin is not found.',
        null
      )
    }

    return new Result<Admin>(
      200,
      'Admin read one by id succeed.',
      foundAdmin
    )
  }

  readOneByEmail = async (email: string): Promise<Result<Admin | null>> => {
    let foundAdmin: Admin
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { email },
        undefined,
        undefined
      )
      foundAdmin = await this.adminRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Admin read one by email failed, admin is not found.',
        null
      )
    }
    return new Result<Admin>(
      200,
      'Admin read one by email succeed.',
      foundAdmin
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<Admin | null>> => {
    let foundAdmin: Admin
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { email, password },
        undefined,
        undefined
      )
      foundAdmin = await this.adminRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Admin read one by email and password failed, admin is not found.',
        null
      )
    }
    return new Result<Admin>(
      200,
      'Admin read one by email and password succeed.',
      foundAdmin
    )
  }

  createOne = async (request: AdminManagementCreateRequest): Promise<Result<Admin>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const adminToCreate: Admin = {
      id: randomUUID(),
      fullName: request.fullName,
      email: request.email,
      password: bcrypt.hashSync(request.password, salt),
      gender: request.gender,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const args: RepositoryArgument = new RepositoryArgument(
      undefined,
      undefined,
      undefined,
      adminToCreate
    )
    const createdAdmin: any = await this.adminRepository.createOne(args)
    return new Result<Admin>(
      201,
      'Admin create one succeed.',
      createdAdmin
    )
  }

  patchOneById = async (id: string, request: AdminManagementPatchRequest): Promise<Result<Admin | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      return new Result<null>(
        500,
        'Admin patch one by id failed, salt is undefined.',
        null
      )
    }

    if (request.password !== undefined) {
      request.password = bcrypt.hashSync(request.password, salt)
    }
    request.oldPassword = bcrypt.hashSync(request.oldPassword, salt)

    const foundAdmin: Result<Admin | null> = await this.readOneById(id)
    if (foundAdmin.status !== 200 || foundAdmin.data === null) {
      return new Result<null>(
        foundAdmin.status,
        'Admin patch one by id failed, admin is not found.',
        null
      )
    }

    if (request.oldPassword !== foundAdmin.data.password) {
      return new Result<null>(
        400,
        'Admin patch one by id failed, old password is not match to the current password.',
        null
      )
    }

    const { oldPassword, ...admin } = request
    this.objectUtility.patch(foundAdmin.data, admin)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundAdmin.data
    )
    let patchedAdmin: Admin
    try {
      patchedAdmin = await this.adminRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        `Admin patch one by id failed, ${(error as Error).message}`,
        null
      )
    }

    return new Result<Admin>(
      200,
      'Admin patch one by id succeed.',
      patchedAdmin
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<Admin | null>> => {
    const foundAdmin: Result<Admin | null> = await this.readOneById(id)
    if (foundAdmin.status !== 200 || foundAdmin.data === null) {
      return new Result<null>(
        foundAdmin.status,
        'Admin patch one raw by id failed, admin is not found.',
        null
      )
    }

    this.objectUtility.patch(foundAdmin.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundAdmin.data
    )
    const patchedAdmin: Admin = await this.adminRepository.patchOne(args)
    return new Result<Admin>(
      200,
      'Admin patch one raw by id succeed.',
      patchedAdmin
    )
  }

  deleteHardOneById = async (id: string): Promise<Result<Admin | null>> => {
    let deletedAdmin: Admin
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedAdmin = await this.adminRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Admin delete hard one by id failed, admin is not found.',
        null
      )
    }
    return new Result<Admin>(
      200,
      'Admin delete hard one by id succeed.',
      deletedAdmin
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<Admin | null>> => {
    let deletedAdmin: Admin
    try {
      const foundAdmin: Result<Admin | null> = await this.readOneById(id)
      if (foundAdmin.status !== 200 || foundAdmin.data === null) {
        return new Result<null>(
          foundAdmin.status,
          'Admin delete soft one by id failed, admin is not found.',
          null
        )
      }

      foundAdmin.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundAdmin.data
      )
      deletedAdmin = await this.adminRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Admin delete soft one by id failed, admin is not found.',
        null
      )
    }
    return new Result<Admin>(
      200,
      'Admin delete soft one by id succeed.',
      deletedAdmin
    )
  }
}
