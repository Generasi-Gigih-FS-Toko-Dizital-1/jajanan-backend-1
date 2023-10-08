import { type JajanItem } from '@prisma/client'
import type JajanItemRepository from '../../../outers/repositories/JajanItemRepository'
import type Pagination from '../../models/value_objects/Pagination'
import Result from '../../models/value_objects/Result'
import type JajanItemManagementCreateRequest
  from '../../models/value_objects/requests/jajan_item_management/JajanItemManagementCreateRequest'
import { randomUUID } from 'crypto'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type JajanItemManagementPatchRequest
  from '../../models/value_objects/requests/jajan_item_management/JajanItemManagementPatchRequest'
import VendorManagement from './VendorManagement'

export default class JajanItemManagement {
  jajanItemRepository: JajanItemRepository
  objectUtility: ObjectUtility

  constructor (jajananItemRepository: JajanItemRepository, objectUtility: ObjectUtility) {
    this.jajanItemRepository = jajananItemRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<JajanItem[]>> => {
    const foundJajanItems: JajanItem[] = await this.jajanItemRepository.readMany(pagination, whereInput, includeInput)
    return new Result<JajanItem[]>(
      200,
      'Jajan Items read many succeed.',
      foundJajanItems
    )
  }

  readOneById = async (id: string): Promise<Result<JajanItem | null>> => {
    let foundJajanItem: JajanItem
    try {
      foundJajanItem = await this.jajanItemRepository.readOneById(id)
    } catch (error) {
      return new Result<null>(
        404,
        'Jajan Item read one by id failed, jajan item is not found.',
        null
      )
    }
    return new Result<JajanItem>(
      200,
      'Jajan Item read one by id succeed.',
      foundJajanItem
    )
  }

  createOne = async (request: JajanItemManagementCreateRequest): Promise<Result<JajanItem | null>> => {
    const jajanItemToCreate: JajanItem = {
      id: randomUUID(),
      vendorId: request.vendorId,
      categoryId: request.categoryId,
      imageUrl: request.imageUrl,
      name: request.name,
      price: request.price,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }
    const createdJajanItem: Result<JajanItem | null> = await this.createOneRaw(jajanItemToCreate)
    if (createdJajanItem.status !== 201 || createdJajanItem.data === null) {
      return new Result<null>(
        createdJajanItem.status,
        `Jajan Item create one failed, ${createdJajanItem.message}`,
        null
      )
    }
    return new Result<JajanItem>(
      201,
      'Jajan Item create one succeed.',
      createdJajanItem.data
    )
  }

  createOneRaw = async (jajanItem: JajanItem): Promise<Result<JajanItem | null>> => {
    let createdJajanItem: JajanItem
    try {
      createdJajanItem = await this.jajanItemRepository.createOne(jajanItem)
    } catch (error) {
      return new Result<null>(
        500,
        `Jajan Item create one failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<JajanItem>(
      201,
      'Jajan Item create one succeed.',
      createdJajanItem
    )
  }

  patchOneById = async (id: string, request: JajanItemManagementPatchRequest): Promise<Result<JajanItem | null>> => {
    const patchedJajanItem: Result<JajanItem | null> = await this.patchOneRawById(id, request)
    if (patchedJajanItem.status !== 200 || patchedJajanItem.data === null) {
      return new Result<null>(
        patchedJajanItem.status,
            `Jajan Item patch one failed, ${patchedJajanItem.message}`,
            null
      )
    }
    return new Result<JajanItem>(
      200,
      'Jajan Item patch one succeed.',
      patchedJajanItem.data
    )
  }

  patchOneRawById = async (id: string, request: JajanItemManagementPatchRequest): Promise<Result<JajanItem | null>> => {
    const foundJajanItem: Result<JajanItem | null> = await this.readOneById(id)
    if (foundJajanItem.status !== 200 || foundJajanItem.data === null) {
      return new Result<null>(
        404,
        'Jajan Item patch one raw by id failed, jajan item is not found.',
        null
      )
    }
    this.objectUtility.patch(foundJajanItem.data, request)
    const patchedJajanItem: JajanItem = await this.jajanItemRepository.patchOneById(id, foundJajanItem.data)
    return new Result<JajanItem>(
      200,
      'Jajan Item patch one raw by id succeed.',
      patchedJajanItem
    )
  }

  deleteOneById = async (id: string): Promise<Result<JajanItem | null>> => {
    let deletedJajanItem: JajanItem
    try {
      deletedJajanItem = await this.jajanItemRepository.deleteOneById(id)
    } catch (error) {
      return new Result<null>(
        500,
        'JajanItem delete one by id failed',
        null
      )
    }
    return new Result<JajanItem>(
      200,
      'Jajan Item delete one by id succeed.',
      deletedJajanItem
    )
  }
}
