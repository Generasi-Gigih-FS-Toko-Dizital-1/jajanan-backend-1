import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type VendorRepository from '../../../outers/repositories/VendorRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { User, type Vendor } from '@prisma/client'
import type VendorManagementCreateRequest
  from '../../models/value_objects/requests/vendor_managements/VendorManagementCreateRequest'
import type VendorManagementPatchRequest
  from '../../models/value_objects/requests/vendor_managements/VendorManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type VendorAggregate from '../../models/aggregates/VendorAggregate'

export default class VendorManagement {
  vendorRepository: VendorRepository
  objectUtility: ObjectUtility

  constructor (vendorRepository: VendorRepository, objectUtility: ObjectUtility) {
    this.vendorRepository = vendorRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<Vendor[] | VendorAggregate[]>> => {
    const foundVendors: Vendor[] = await this.vendorRepository.readMany(pagination, whereInput, includeInput)
    return new Result<Vendor[]>(
      200,
      'Vendor read many succeed.',
      foundVendors
    )
  }

  readOneById = async (id: string): Promise<Result<Vendor | null>> => {
    let foundVendor: Vendor
    try {
      foundVendor = await this.vendorRepository.readOneById(id)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor read one by id failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor read one by id succeed.',
      foundVendor
    )
  }

  readOneByUsername = async (username: string): Promise<Result<Vendor | null>> => {
    let foundVendor: Vendor
    try {
      foundVendor = await this.vendorRepository.readOneByUsername(username)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor read one by username failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor read one by username succeed.',
      foundVendor
    )
  }

  readOneByEmail = async (email: string): Promise<Result<Vendor | null>> => {
    let foundVendor: Vendor
    try {
      foundVendor = await this.vendorRepository.readOneByEmail(email)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor read one by email failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor read one by email succeed.',
      foundVendor
    )
  }

  readOneByUsernameAndPassword = async (username: string, password: string): Promise<Result<Vendor | null>> => {
    let foundVendor: Vendor
    try {
      foundVendor = await this.vendorRepository.readOneByUsernameAndPassword(username, password)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor read one by username and password failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor read one by username and password succeed.',
      foundVendor
    )
  }

  readOneByEmailAndPassword = async (email: string, password: string): Promise<Result<Vendor | null>> => {
    let foundVendor: Vendor
    try {
      foundVendor = await this.vendorRepository.readOneByEmailAndPassword(email, password)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor read one by email and password failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor read one by email and password succeed.',
      foundVendor
    )
  }

  createOne = async (request: VendorManagementCreateRequest): Promise<Result<Vendor | null>> => {
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

    const createdVendor: Result<Vendor | null> = await this.createOneRaw(vendorToCreate)
    if (createdVendor.status !== 201 || createdVendor.data === null) {
      return new Result<null>(
        createdVendor.status,
            `Vendor create one failed, ${createdVendor.message}`,
            null
      )
    }
    return new Result<Vendor>(
      201,
      'Vendor create one succeed.',
      createdVendor.data
    )
  }

  createOneRaw = async (vendor: Vendor): Promise<Result<Vendor | null>> => {
    let createdVendor: Vendor
    try {
      createdVendor = await this.vendorRepository.createOne(vendor)
    } catch (error) {
      return new Result<null>(
        500,
            `Vendor create one failed, ${(error as Error).message}`,
            null
      )
    }
    return new Result<Vendor>(
      201,
      'Vendor create one succeed.',
      createdVendor
    )
  }

  patchOneById = async (id: string, request: VendorManagementPatchRequest): Promise<Result<Vendor | null>> => {
    const salt: string | undefined = process.env.BCRYPT_SALT
    if (salt === undefined) {
      throw new Error('Salt is undefined.')
    }

    request.password = bcrypt.hashSync(request.password, salt)

    const patchedVendor: Result<Vendor | null> = await this.patchOneRawById(id, request)
    if (patchedVendor.status !== 200 || patchedVendor.data === null) {
      return new Result<null>(
        patchedVendor.status,
          `Vendor patch one by id failed, ${patchedVendor.message}}`,
          null
      )
    }

    return new Result<Vendor>(
      200,
      'Vendor patch one by id succeed.',
      patchedVendor.data
    )
  }

  patchOneRawById = async (id: string, request: VendorManagementPatchRequest): Promise<Result<Vendor | null>> => {
    const foundVendor: Result<Vendor | null> = await this.readOneById(id)
    if (foundVendor.status !== 200 || foundVendor.data === null) {
      return new Result<null>(
        foundVendor.status,
        'Vendor patch one by id failed, vendor is not found.',
        null
      )
    }
    this.objectUtility.patch(foundVendor.data, request)
    let patchedVendor: Vendor
    try {
      patchedVendor = await this.vendorRepository.patchOneById(id, foundVendor.data)
    } catch (error) {
      return new Result<null>(
        500,
            `Vendor patch one by id failed, ${(error as Error).message}`,
            null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor patch one by id succeed.',
      patchedVendor
    )
  }

  deleteOneById = async (id: string): Promise<Result<Vendor | null>> => {
    let deletedVendor: Vendor
    try {
      deletedVendor = await this.vendorRepository.deleteOneById(id)
    } catch (error) {
      return new Result<null>(
        500,
        'Vendor delete one by id failed.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor delete one by id succeed.',
      deletedVendor
    )
  }
}
