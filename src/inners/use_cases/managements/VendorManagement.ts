import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type VendorRepository from '../../../outers/repositories/VendorRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { type Vendor } from '@prisma/client'
import type VendorManagementCreateRequest
  from '../../models/value_objects/requests/vendor_managements/VendorManagementCreateRequest'
import type VendorManagementPatchRequest
  from '../../models/value_objects/requests/vendor_managements/VendorManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'

export default class VendorManagement {
  vendorRepository: VendorRepository
  objectUtility: ObjectUtility

  constructor (vendorRepository: VendorRepository, objectUtility: ObjectUtility) {
    this.vendorRepository = vendorRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination): Promise<Result<Vendor[]>> => {
    const foundVendors: Vendor[] = await this.vendorRepository.readMany(pagination)
    return new Result<Vendor[]>(
      200,
      'Vendor read all succeed.',
      foundVendors
    )
  }

  readOneById = async (id: string): Promise<Result<Vendor>> => {
    const foundVendor: Vendor = await this.vendorRepository.readOneById(id)
    return new Result<Vendor>(
      200,
      'Vendor read one by id succeed.',
      foundVendor
    )
  }

  readOneByUsername = async (username: string): Promise<Result<Vendor>> => {
    const foundVendor: Vendor = await this.vendorRepository.readOneByUsername(username)
    return new Result<Vendor>(
      200,
      'Vendor read one by username succeed.',
      foundVendor
    )
  }

  readOneByEmail = async (email: string): Promise<Result<Vendor>> => {
    const foundVendor: Vendor = await this.vendorRepository.readOneByEmail(email)
    return new Result<Vendor>(
      200,
      'Vendor read one by email succeed.',
      foundVendor
    )
  }

  readOneByUsernameAndPassword = async (username: string, password: string): Promise<Result<Vendor>> => {
    const foundVendor: Vendor = await this.vendorRepository.readOneByUsernameAndPassword(username, password)
    return new Result<Vendor>(
      200,
      'Vendor read one by username and password succeed.',
      foundVendor
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<Vendor>> => {
    const foundVendor: Vendor = await this.vendorRepository.readOneByEmailAndPassword(email, password)
    return new Result<Vendor>(
      200,
      'Vendor read one by email and password succeed.',
      foundVendor
    )
  }

  createOne = async (request: VendorManagementCreateRequest): Promise<Result<Vendor>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const vendorToCreate: Vendor = {
      id: randomUUID(),
      fullName: request.fullName,
      address: request.address,
      email: request.email,
      password: bcrypt.hashSync(request.password, salt),
      username: request.username,
      balance: 0,
      gender: request.gender,
      experience: 0,
      jajanImageUrl: request.jajanImageUrl,
      jajanName: request.jajanName,
      jajanDescription: request.jajanDescription,
      status: request.status,
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdVendor: any = await this.vendorRepository.createOne(vendorToCreate)
    return new Result<Vendor>(
      201,
      'Vendor create one succeed.',
      createdVendor
    )
  }

  createOneRaw = async (vendor: Vendor): Promise<Result<Vendor>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    const createdVendor: any = await this.vendorRepository.createOne(vendor)
    return new Result<Vendor>(
      201,
      'Vendor create one raw succeed.',
      createdVendor
    )
  }

  patchOneById = async (id: string, request: VendorManagementPatchRequest): Promise<Result<Vendor>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    if (request.password !== undefined) {
      request.password = bcrypt.hashSync(request.password, salt)
    }

    const foundVendor: Result<Vendor> = await this.readOneById(id)
    this.objectUtility.patch(foundVendor.data, request)
    const patchedVendor: Vendor = await this.vendorRepository.patchOneById(id, foundVendor.data)
    return new Result<Vendor>(
      200,
      'Vendor patch one by id succeed.',
      patchedVendor
    )
  }

  deleteOneById = async (id: string): Promise<Result<Vendor>> => {
    const deletedVendor: any = await this.vendorRepository.deleteOneById(id)
    return new Result<Vendor>(
      200,
      'Vendor delete one by id succeed.',
      deletedVendor
    )
  }
}
