import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type Category } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type CategoryManagement from '../../../inners/use_cases/managements/CategoryManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import CategoryManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/category_managements/CategoryManagementReadManyResponse'
import CategoryManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/category_managements/CategoryManagementReadOneResponse'
import CategoryManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/category_managements/CategoryManagementCreateResponse'
import CategoryManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/category_managements/CategoryManagementPatchResponse'
import type CategoryAggregate from '../../../inners/models/aggregates/CategoryAggregate'

export default class CategoryControllerRest {
  router: Router
  categoryManagement: CategoryManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, categoryManagemenet: CategoryManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.categoryManagement = categoryManagemenet
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.get('', this.readMany)
    this.router.get('/:id', this.readOneById)
    this.router.post('', this.createOne)
    this.router.patch('/:id', this.patchOneById)
    this.router.delete('/:id', this.deleteOneById)
  }

  readMany = (request: Request, response: Response): void => {
    const {
      pageNumber,
      pageSize,
      where,
      include
    } = request.query
    const pagination: Pagination = new Pagination(
      pageNumber === undefined ? 1 : Number(pageNumber),
      pageSize === undefined ? 10 : Number(pageSize)
    )

    let whereInput: any = {}
    if (where !== undefined && where !== null) {
      try {
        whereInput = JSON.parse(decodeURIComponent(where as string))
      } catch (error) {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          'Query parameter where is invalid.',
          null
        )
        response.status(400).send(responseBody)
        return
      }
    }

    let includeInput: any = {}
    if (include !== undefined && include !== null) {
      try {
        includeInput = JSON.parse(decodeURIComponent(include as string))
      } catch (error) {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          'Query parameter include is invalid.',
          null
        )
        response.status(400).send(responseBody)
        return
      }
    }

    this.categoryManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<Category[] | CategoryAggregate[]>) => {
        const data: CategoryManagementReadManyResponse = new CategoryManagementReadManyResponse(
          result.data.length,
          result.data.map((category: Category) =>
            new CategoryManagementReadOneResponse(
              category.id,
              category.name,
              category.iconUrl,
              category.createdAt,
              category.updatedAt,
              category.deletedAt,
              (category as CategoryAggregate).jajanItems,
              (category as CategoryAggregate).jajanItemSnapshots,
              (category as CategoryAggregate).userSubscriptions
            )
          )
        )
        const responseBody: ResponseBody<CategoryManagementReadManyResponse> = new ResponseBody<CategoryManagementReadManyResponse>(
          result.message,
          data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  readOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.categoryManagement
      .readOneById(id)
      .then((result: Result<Category | null>) => {
        let data: CategoryManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new CategoryManagementReadOneResponse(
            result.data.id,
            result.data.name,
            result.data.iconUrl,
            result.data.createdAt,
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<CategoryManagementReadOneResponse | null> = new ResponseBody<CategoryManagementReadOneResponse | null>(
          result.message,
          data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  createOne = (request: Request, response: Response): void => {
    this.categoryManagement
      .createOne(request.body)
      .then((result: Result<Category | null>) => {
        let data: CategoryManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new CategoryManagementCreateResponse(
            result.data.id,
            result.data.name,
            result.data.iconUrl,
            result.data.createdAt,
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<CategoryManagementCreateResponse | null> = new ResponseBody<CategoryManagementCreateResponse | null>(
          result.message,
          data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  patchOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.categoryManagement
      .patchOneById(id, request.body)
      .then((result: Result<Category | null>) => {
        let data: CategoryManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new CategoryManagementPatchResponse(
            result.data.id,
            result.data.name,
            result.data.iconUrl,
            result.data.createdAt,
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<CategoryManagementPatchResponse | null> = new ResponseBody<CategoryManagementPatchResponse | null>(
          result.message,
          data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  deleteOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    const { method } = request.query

    if (method === undefined || method === null) {
      const responseBody: ResponseBody<null> = new ResponseBody<null>(
        'Query parameter method is required.',
        null
      )
      response.status(400).send(responseBody)
      return
    }

    if (method === 'soft') {
      this.categoryManagement
        .deleteSoftOneById(id)
        .then((result: Result<Category | null>) => {
          const responseBody: ResponseBody<null> = new ResponseBody<null>(
            result.message,
            null
          )
          response.status(result.status).send(responseBody)
        })
        .catch((error: Error) => {
          response.status(500).send(error.message)
        })
    } else if (method === 'hard') {
      this.categoryManagement
        .deleteHardOneById(id)
        .then((result: Result<Category | null>) => {
          const responseBody: ResponseBody<null> = new ResponseBody<null>(
            result.message,
            null
          )
          response.status(result.status).send(responseBody)
        })
        .catch((error: Error) => {
          response.status(500).send(error.message)
        })
    } else {
      const responseBody: ResponseBody<null> = new ResponseBody<null>(
        'Query parameter method is invalid.',
        null
      )
      response.status(400).send(responseBody)
    }
  }
}
