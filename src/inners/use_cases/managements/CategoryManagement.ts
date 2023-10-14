import { type Category } from '@prisma/client'
import type CategoryRepository from '../../../outers/repositories/CategoryRepository'
import Result from '../../models/value_objects/Result'
import type CategoryManagementCreateRequest
  from '../../models/value_objects/requests/managements/category_managements/CategoryManagementCreateRequest'
import { randomUUID } from 'crypto'
import type Pagination from '../../models/value_objects/Pagination'
import type CategoryManagementPatchRequest
  from '../../models/value_objects/requests/managements/category_managements/CategoryManagementPatchRequest'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type CategoryAggregate from '../../models/aggregates/CategoryAggregate'

export default class CategoryManagement {
  categoryRepository: CategoryRepository
  objectUtility: ObjectUtility

  constructor (categoryRepository: CategoryRepository, objectUtility: ObjectUtility) {
    this.categoryRepository = categoryRepository
    this.objectUtility = objectUtility
  }

  readMany = async (pagination: Pagination, whereInput: any, includeInput: any): Promise<Result<Category[] | CategoryAggregate[]>> => {
    const foundCategories: Category[] = await this.categoryRepository.readMany(pagination, whereInput, includeInput)
    return new Result<Category[]>(
      200,
      'Categories read all succeed.',
      foundCategories
    )
  }

  readOneById = async (id: string): Promise<Result<Category | null>> => {
    let foundCategory: Category
    try {
      foundCategory = await this.categoryRepository.readOneById(id)
    } catch (error) {
      return new Result<null>(
        404,
        'Category read one by id failed, category is not found.',
        null
      )
    }
    return new Result<Category>(
      200,
      'Category read one by id succeed.',
      foundCategory
    )
  }

  createOne = async (request: CategoryManagementCreateRequest): Promise<Result<Category | null>> => {
    const categoryToCreate: Category = {
      id: randomUUID(),
      name: request.name,
      iconUrl: request.iconUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }

    const createdCategory: Result<Category | null> = await this.createOneRaw(categoryToCreate)
    if (createdCategory.status !== 201 || createdCategory.data === null) {
      return new Result<null>(
        createdCategory.status,
          `Category create one failed, ${createdCategory.message}`,
          null
      )
    }
    return new Result<Category>(
      201,
      'Category create one succeed.',
      createdCategory.data
    )
  }

  createOneRaw = async (category: Category): Promise<Result<Category | null>> => {
    let createdCategory: Category
    try {
      createdCategory = await this.categoryRepository.createOne(category)
    } catch (error) {
      return new Result<null>(
        500,
        `Category create one failed, ${(error as Error).message}`,
        null
      )
    }
    return new Result<Category>(
      201,
      'Category create one succeed.',
      createdCategory
    )
  }

  patchOneById = async (id: string, request: CategoryManagementPatchRequest): Promise<Result<Category | null>> => {
    const patchedCategory: Result<Category | null> = await this.patchOneRawById(id, request)
    if (patchedCategory.status !== 200 || patchedCategory.data === null) {
      return new Result<null>(
        patchedCategory.status,
            `Category patch one failed, ${patchedCategory.message}`,
            null
      )
    }
    return new Result<Category>(
      200,
      'Category patch one succeed.',
      patchedCategory.data
    )
  }

  patchOneRawById = async (id: string, request: any): Promise<Result<Category | null>> => {
    const foundCategory: Result<Category | null> = await this.readOneById(id)
    if (foundCategory.status !== 200 || foundCategory.data === null) {
      return new Result<null>(
        404,
        'Category patch one raw by id failed, category is not found.',
        null
      )
    }
    this.objectUtility.patch(foundCategory.data, request)
    const patchedCategory: Category = await this.categoryRepository.patchOneById(id, foundCategory.data)
    return new Result<Category>(
      200,
      'Category patch one raw by id succeed.',
      patchedCategory
    )
  }

  deleteOneById = async (id: string): Promise<Result<Category | null>> => {
    let deletedCategory: Category
    try {
      deletedCategory = await this.categoryRepository.deleteOneById(id)
    } catch (error) {
      return new Result<null>(
        500,
        'Category delete one by id failed.',
        null
      )
    }
    return new Result<Category>(
      200,
      'Category delete one by id succeed.',
      deletedCategory
    )
  }
}
