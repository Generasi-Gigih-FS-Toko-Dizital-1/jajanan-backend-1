import { type VendorLevel } from '@prisma/client'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import { randomUUID } from 'crypto'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type VendorLevelManagementPatchRequest
  from '../../models/value_objects/requests/managements/vendor_level_managements/VendorLevelManagementCreateRequest'
import type VendorLevelManagementCreateRequest
  from '../../models/value_objects/requests/managements/vendor_level_managements/VendorLevelManagementPatchRequest'
import type VendorLevelRepository from '../../../outers/repositories/VendorLevelRepository'
import RepositoryArgument from '../../models/value_objects/RepositoryArgument'

export default class VendorLevelManagement {
  vendorLevelRepository: VendorLevelRepository
  objectUtility: ObjectUtility

  constructor (vendorLevelRepository: VendorLevelRepository, objectUtility: ObjectUtility) {
    this.vendorLevelRepository = vendorLevelRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<VendorLevel[]>> => {
    const args: RepositoryArgument = new RepositoryArgument(
      whereInput,
      includeInput,
      pagination
    )
    const foundVendorLevels: VendorLevel[] = await this.vendorLevelRepository.readMany(args)
    return new Result<VendorLevel[]>(
      200,
      'Vendor levels read many succeed.',
      foundVendorLevels
    )
  }

  readOneById = async (id: string): Promise<Result<VendorLevel | null>> => {
    let foundVendorLevel: VendorLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined
      )
      foundVendorLevel = await this.vendorLevelRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor level read one by id failed, vendor level is not found.',
        null
      )
    }
    return new Result<VendorLevel>(
      200,
      'Vendor level read one by id succeed.',
      foundVendorLevel
    )
  }

  readOneByExp = async (exp: number): Promise<Result<VendorLevel | null>> => {
    let foundVendorLevel: VendorLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        {
          minimumExperience: {
            lte: exp
          }
        },
        undefined,
        undefined,
        undefined,
        {
          minimumExperience: 'desc'
        }
      )
      foundVendorLevel = await this.vendorLevelRepository.readOne(args)
    } catch (error) {
      return new Result<null>(
        404,
        'Vendor level read one by exp failed, vendor level is not found.',
        null
      )
    }
    return new Result<VendorLevel>(
      200,
      'Vendor level read one by exp succeed.',
      foundVendorLevel
    )
  }

  createOne = async (request: VendorLevelManagementCreateRequest): Promise<Result<VendorLevel | null>> => {
    const vendorLevelToCreate: VendorLevel = {
      id: randomUUID(),
      name: request.name,
      minimumExperience: request.minimumExperience,
      iconUrl: request.iconUrl,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdVendorLevel: Result<VendorLevel | null> = await this.createOneRaw(vendorLevelToCreate)
    if (createdVendorLevel.status !== 201 || createdVendorLevel.data === null) {
      return new Result<null>(
        createdVendorLevel.status,
        `Vendor level create one failed, ${createdVendorLevel.message}`,
        null
      )
    }
    return new Result<VendorLevel>(
      201,
      'Vendor level create one succeed.',
      createdVendorLevel.data
    )
  }

  createOneRaw = async (vendorLevel: VendorLevel): Promise<Result<VendorLevel | null>> => {
    let createdVendorLevel: VendorLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        undefined,
        undefined,
        undefined,
        vendorLevel
      )
      createdVendorLevel = await this.vendorLevelRepository.createOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        `Vendor level create one failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<VendorLevel>(
      201,
      'Vendor level create one succeed.',
      createdVendorLevel
    )
  }

  patchOneById = async (id: string, request: VendorLevelManagementPatchRequest): Promise<Result<VendorLevel | null>> => {
    const patchedVendorLevel: Result<VendorLevel | null> = await this.patchOneRawById(id, request)
    if (patchedVendorLevel.status !== 200 || patchedVendorLevel.data === null) {
      return new Result<null>(
        patchedVendorLevel.status,
            `Vendor level patch one failed, ${patchedVendorLevel.message}`,
            null
      )
    }
    return new Result<VendorLevel>(
      200,
      'Vendor level patch one succeed.',
      patchedVendorLevel.data
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<VendorLevel | null>> => {
    const foundVendorLevel: Result<VendorLevel | null> = await this.readOneById(id)
    if (foundVendorLevel.status !== 200 || foundVendorLevel.data === null) {
      return new Result<null>(
        404,
        'Vendor level patch one raw by id failed, vendor level is not found.',
        null
      )
    }
    this.objectUtility.patch(foundVendorLevel.data, request)
    const args: RepositoryArgument = new RepositoryArgument(
      { id },
      undefined,
      undefined,
      foundVendorLevel.data
    )
    const patchedVendorLevel: VendorLevel = await this.vendorLevelRepository.patchOne(args)
    return new Result<VendorLevel>(
      200,
      'Vendor level patch one raw by id succeed.',
      patchedVendorLevel
    )
  }

  deleteOneById = async (id: string): Promise<Result<VendorLevel | null>> => {
    let deletedVendorLevel: VendorLevel
    try {
      const args: RepositoryArgument = new RepositoryArgument(
        { id },
        undefined,
        undefined,
        undefined
      )
      deletedVendorLevel = await this.vendorLevelRepository.deleteOne(args)
    } catch (error) {
      return new Result<null>(
        500,
        'VendorLevel delete one by id failed',
        null
      )
    }
    return new Result<VendorLevel>(
      200,
      'Vendor level delete one by id succeed.',
      deletedVendorLevel
    )
  }
}
