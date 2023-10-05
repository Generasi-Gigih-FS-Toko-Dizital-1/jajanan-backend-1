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

export default class JajanItemManagement {
  jajanItemRepository: JajanItemRepository
  objectUtility: ObjectUtility

  constructor (jajananItemRepository: JajanItemRepository, objectUtility: ObjectUtility) {
    this.jajanItemRepository = jajananItemRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination): Promise<Result<JajanItem[]>> => {
    const foundAdmins: JajanItem[] = await this.jajanItemRepository.readMany(pagination)
    return new Result<JajanItem[]>(
      200,
      'Jajan Items read all succeed.',
      foundAdmins
    )
  }

  createOne = async (request: JajanItemManagementCreateRequest): Promise<Result<JajanItem>> => {
    const userToCreate: JajanItem = {
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
    const createdUser: any = await this.jajanItemRepository.createOne(userToCreate)
    return new Result<JajanItem>(
      201,
      'Jajan Item create one succeed.',
      createdUser
    )
  }

  readOneById = async (id: string): Promise<Result<JajanItem>> => {
    const foundItem: JajanItem = await this.jajanItemRepository.readOneById(id)
    return new Result<JajanItem>(
      200,
      'Jajan Item read one by id succeed.',
      foundItem
    )
  }

  patchOneById = async (id: string, request: JajanItemManagementPatchRequest): Promise<Result<JajanItem>> => {
    const foundJajanItem: Result<JajanItem> = await this.readOneById(id)
    this.objectUtility.patch(foundJajanItem.data, request)
    const patchedJajanItem: JajanItem = await this.jajanItemRepository.patchOneById(id, foundJajanItem.data)
    return new Result<JajanItem>(
      200,
      'Jajan Item patch one by id succeed.',
      patchedJajanItem
    )
  }

  deleteOneById = async (id: string): Promise<Result<JajanItem>> => {
    const deletedUser: any = await this.jajanItemRepository.deleteOneById(id)
    return new Result<JajanItem>(
      200,
      'Jajan Item delete one by id succeed.',
      deletedUser
    )
  }
}
