import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type AdminRepository from '../../../outers/repositories/AdminRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { type Admin } from '@prisma/client'
import type AdminManagementCreateRequest
  from '../../models/value_objects/requests/admin_managements/AdminManagementCreateRequest'
import type AdminManagementPatchRequest
  from '../../models/value_objects/requests/admin_managements/AdminManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'

export default class AdminManagement {
  adminRepository: AdminRepository
  objectUtility: ObjectUtility

  constructor (adminRepository: AdminRepository, objectUtility: ObjectUtility) {
    this.adminRepository = adminRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination): Promise<Result<Admin[]>> => {
    const foundAdmins: Admin[] = await this.adminRepository.readMany(pagination)
    return new Result<Admin[]>(
      200,
      'Admin read all succeed.',
      foundAdmins
    )
  }

  readOneById = async (id: string): Promise<Result<Admin>> => {
    const foundAdmin: Admin = await this.adminRepository.readOneById(id)
    return new Result<Admin>(
      200,
      'Admin read one by id succeed.',
      foundAdmin
    )
  }

  readOneByAdminname = async (username: string): Promise<Result<Admin>> => {
    const foundAdmin: Admin = await this.adminRepository.readOneByAdminname(username)
    return new Result<Admin>(
      200,
      'Admin read one by username succeed.',
      foundAdmin
    )
  }

  readOneByEmail = async (email: string): Promise<Result<Admin>> => {
    const foundAdmin: Admin = await this.adminRepository.readOneByEmail(email)
    return new Result<Admin>(
      200,
      'Admin read one by email succeed.',
      foundAdmin
    )
  }

  readOneByAdminnameAndPassword = async (username: string, password: string): Promise<Result<Admin>> => {
    const foundAdmin: Admin = await this.adminRepository.readOneByAdminnameAndPassword(username, password)
    return new Result<Admin>(
      200,
      'Admin read one by username and password succeed.',
      foundAdmin
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<Admin>> => {
    const foundAdmin: Admin = await this.adminRepository.readOneByEmailAndPassword(email, password)
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
    const createdAdmin: any = await this.adminRepository.createOne(adminToCreate)
    return new Result<Admin>(
      201,
      'Admin create one succeed.',
      createdAdmin
    )
  }

  patchOneById = async (id: string, request: AdminManagementPatchRequest): Promise<Result<Admin>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    if (request.password !== undefined) {
      request.password = bcrypt.hashSync(request.password, salt)
    }

    const foundAdmin: Result<Admin> = await this.readOneById(id)
    this.objectUtility.patch(foundAdmin.data, request)
    const patchedAdmin: Admin = await this.adminRepository.patchOneById(id, foundAdmin.data)
    return new Result<Admin>(
      200,
      'Admin patch one by id succeed.',
      patchedAdmin
    )
  }

  deleteOneById = async (id: string): Promise<Result<Admin>> => {
    const deletedAdmin: any = await this.adminRepository.deleteOneById(id)
    return new Result<Admin>(
      200,
      'Admin delete one by id succeed.',
      deletedAdmin
    )
  }
}
