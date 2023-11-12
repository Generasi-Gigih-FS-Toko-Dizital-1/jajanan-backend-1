import { randomUUID } from 'crypto'
import bcrypt from 'bcrypt'
import type VendorRepository from '../../../outers/repositories/VendorRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { type Vendor } from '@prisma/client'
import type VendorManagementCreateRequest
  from '../../models/value_objects/requests/managements/vendor_managements/VendorManagementCreateRequest'
import type VendorManagementPatchRequest
  from '../../models/value_objects/requests/managements/vendor_managements/VendorManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type VendorAggregate from '../../models/aggregates/VendorAggregate'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'
import type VendorManagementReadManyByDistanceAndLocationResponse
  from '../../models/value_objects/responses/managements/vendor_managements/VendorManagementReadManyByDistanceAndLocationResponse'

export default class VendorManagement {
  vendorRepository: VendorRepository
  objectUtility: ObjectUtility

  constructor (vendorRepository: VendorRepository, objectUtility: ObjectUtility) {
    this.vendorRepository = vendorRepository
    this.objectUtility = objectUtility
  }

  readManyByDistanceAndSubscribedUserIds = async (distance: number, userIds: string[], include: any): Promise<Result<Vendor[] | VendorAggregate[]>> => {
    const foundVendors: Vendor[] | VendorAggregate[] = await this.vendorRepository.readManyByDistanceAndSubscribedUserIds(distance, userIds, include)

    return new Result<Vendor[] | VendorAggregate[]>(
      200,
      'Vendor read many by distance and subscribed user ids succeed.',
      foundVendors
    )
  }

  readManyByDistanceAndLocation = async (distance: number, latitude: number, longitude: number, pagination: Pagination): Promise<Result<VendorManagementReadManyByDistanceAndLocationResponse>> => {
    const foundVendors: VendorManagementReadManyByDistanceAndLocationResponse = await this.vendorRepository.readManyByDistanceAndLocation(distance, latitude, longitude, pagination)
    return new Result<VendorManagementReadManyByDistanceAndLocationResponse>(
      200,
      'Vendor read many by distance and location succeed.',
      foundVendors
    )
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<Vendor[] | VendorAggregate[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundVendors: Vendor[] = await this.vendorRepository.readMany(args)
    return new Result<Vendor[]>(
      200,
      'Vendor read many succeed.',
      foundVendors
    )
  }

  readManyByIds = async (ids: string[]): Promise<Result<Vendor[] | null>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      { id: { in: ids } },
      undefined,
      undefined
    )
    const foundVendors: Vendor[] = await this.vendorRepository.readMany(args)

    if (foundVendors.length !== ids.length) {
      return new Result<null>(
        404,
        'Vendor read many by ids failed, some vendor ids is not found.',
        null
      )
    }

    return new Result<Vendor[]>(
      200,
      'Vendor read many by ids succeed.',
      foundVendors
    )
  }

  readOneById = async (id: string): Promise<Result<Vendor | null>> => {
    let foundVendor: Vendor
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundVendor = await this.vendorRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { username },
        undefined,
        undefined,
        undefined
      )
      foundVendor = await this.vendorRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { email },
        undefined,
        undefined,
        undefined
      )
      foundVendor = await this.vendorRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { username, password },
        undefined,
        undefined,
        undefined
      )
      foundVendor = await this.vendorRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        { email, password },
        undefined,
        undefined,
        undefined
      )
      foundVendor = await this.vendorRepository.readOne(args)
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
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        vendor
      )
      createdVendor = await this.vendorRepository.createOne(args)
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
      return new Result<null>(
        500,
        'Vendor patch one by id failed, salt is undefined.',
        null
      )
    }

    if (request.password !== undefined) {
      request.password = bcrypt.hashSync(request.password, salt)
    }
    request.oldPassword = bcrypt.hashSync(request.oldPassword, salt)

    const foundVendor: Result<Vendor | null> = await this.readOneById(id)
    if (foundVendor.status !== 200 || foundVendor.data === null) {
      return new Result<null>(
        foundVendor.status,
        'Vendor patch one by id failed, vendor is not found.',
        null
      )
    }

    if (request.oldPassword !== foundVendor.data.password) {
      return new Result<null>(
        400,
        'Vendor patch one by id failed, old password is not match to the current password.',
        null
      )
    }

    const { oldPassword, ...vendor } = request
    this.objectUtility.patch(foundVendor.data, vendor)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundVendor.data
    )
    let patchedVendor: Vendor
    try {
      patchedVendor = await this.vendorRepository.patchOne(args)
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

  patchOneRawById = async (id: string, request: any): Promise<Result<Vendor | null>> => {
    const foundVendor: Result<Vendor | null> = await this.readOneById(id)
    if (foundVendor.status !== 200 || foundVendor.data === null) {
      return new Result<null>(
        foundVendor.status,
        'Vendor patch one raw by id failed, vendor is not found.',
        null
      )
    }
    this.objectUtility.patch(foundVendor.data, request)
    let patchedVendor: Vendor
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundVendor.data
      )
      patchedVendor = await this.vendorRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        500,
            `Vendor patch one raw by id failed, ${(error as Error).message}`,
            null
      )
    }
    return new Result<Vendor>(
      200,
      'Vendor patch one raw by id succeed.',
      patchedVendor
    )
  }

  deleteHardOneById = async (id: string): Promise<Result<Vendor | null>> => {
    let deletedvendor: Vendor
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedvendor = await this.vendorRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'vendor delete hard one by id failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'vendor delete hard one by id succeed.',
      deletedvendor
    )
  }

  deleteSoftOneById = async (id: string): Promise<Result<Vendor | null>> => {
    let deletedvendor: Vendor
    try {
      const foundvendor: Result<Vendor | null> = await this.readOneById(id)
      if (foundvendor.status !== 200 || foundvendor.data === null) {
        return new Result<null>(
          foundvendor.status,
          'vendor delete soft one by id failed, vendor is not found.',
          null
        )
      }

      foundvendor.data.deletedAt = new Date()

      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        foundvendor.data
      )
      deletedvendor = await this.vendorRepository.patchOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'vendor delete soft one by id failed, vendor is not found.',
        null
      )
    }
    return new Result<Vendor>(
      200,
      'vendor delete soft one by id succeed.',
      deletedvendor
    )
  }

  patchManyRawByIds = async (ids: string[], vendors: Vendor[]): Promise<Result<Vendor[] | null>> => {
    const foundVendors: Result<Vendor[] | null> = await this.readManyByIds(ids)
    if (foundVendors.status !== 200 || foundVendors.data === null) {
      return new Result<null>(
        foundVendors.status,
        `Vendor patch many by ids failed, ${foundVendors.message}`,
        null
      )
    }

    const args: RepositoryArgument[] = []
    for (let i = 0; i < ids.length; i++) {
      const vendorId: string = ids[i]
      const foundVendor: Vendor | undefined = foundVendors.data.find((vendor: Vendor) => vendor.id === vendorId)
      if (foundVendor === undefined) {
        return new Result<null>(
          500,
          'Vendor patch many by ids failed, vendor is not found.',
          null
        )
      }
      const vendor: Vendor = vendors[i]
      this.objectUtility.patch(foundVendor, vendor)
      const arg = new RepositoryArgument(
        { id: vendorId },
        undefined,
        undefined,
        foundVendor
      )
      args.push(arg)
    }

    let patchedVendors: Vendor[]
    try {
      patchedVendors = await this.vendorRepository.patchMany(args)
    } catch (error) {
      return new Result<null>(
        500,
          `Vendor patch one by id failed, ${(error as Error).message}`,
          null
      )
    }
    return new Result<Vendor[]>(
      200,
      'Vendor patch one by id succeed.',
      patchedVendors
    )
  }
}
