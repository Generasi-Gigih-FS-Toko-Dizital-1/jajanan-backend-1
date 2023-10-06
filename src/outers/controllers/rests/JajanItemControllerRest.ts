import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type JajanItem } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type JajanItemManagement from '../../../inners/use_cases/managements/JajanItemManagement'
import JajanItemManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/jajan_item_managements/JajanItemManagementReadManyResponse'
import JajanItemManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/jajan_item_managements/JajanItemManagementReadOneResponse'
import JajanItemManagementCreateResponse
  from '../../../inners/models/value_objects/responses/jajan_item_managements/JajanItemManagementCreateResponse'
import JajanItemManagementPatchResponse
  from '../../../inners/models/value_objects/responses/jajan_item_managements/JajanItemManagementPatchResponse'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'

export default class JajanItemControllerRest {
  router: Router
  jajanItemManagement: JajanItemManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, jajanItemManagement: JajanItemManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.jajanItemManagement = jajanItemManagement
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
    const { pageNumber, pageSize } = request.query
    const pagination: Pagination = new Pagination(
      pageNumber === undefined ? 1 : Number(pageNumber),
      pageSize === undefined ? 10 : Number(pageSize)
    )
    this.jajanItemManagement
      .readMany(pagination)
      .then((result: Result<JajanItem[]>) => {
        const data: JajanItemManagementReadManyResponse = new JajanItemManagementReadManyResponse(
          result.data.length,
          result.data.map((jajanItem: JajanItem) =>
            new JajanItemManagementReadOneResponse(
              jajanItem.id,
              jajanItem.vendorId,
              jajanItem.categoryId,
              jajanItem.name,
              jajanItem.price,
              jajanItem.imageUrl,
              jajanItem.createdAt,
              jajanItem.updatedAt
            )
          )
        )
        const responseBody: ResponseBody<JajanItemManagementReadManyResponse> = new ResponseBody<JajanItemManagementReadManyResponse>(
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
    this.jajanItemManagement
      .readOneById(id)
      .then((result: Result<JajanItem | null>) => {
        let data: JajanItemManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new JajanItemManagementReadOneResponse(
            result.data.id,
            result.data.vendorId,
            result.data.categoryId,
            result.data.name,
            result.data.price,
            result.data.imageUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<JajanItemManagementReadOneResponse | null> = new ResponseBody<JajanItemManagementReadOneResponse | null>(
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
    this.jajanItemManagement
      .createOne(request.body)
      .then((result: Result<JajanItem | null>) => {
        let data: JajanItemManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new JajanItemManagementCreateResponse(
            result.data.id,
            result.data.vendorId,
            result.data.categoryId,
            result.data.name,
            result.data.price,
            result.data.imageUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<JajanItemManagementCreateResponse | null> = new ResponseBody<JajanItemManagementCreateResponse | null>(
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
    this.jajanItemManagement
      .patchOneById(id, request.body)
      .then((result: Result<JajanItem | null>) => {
        let data: JajanItemManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new JajanItemManagementPatchResponse(
            result.data.id,
            result.data.vendorId,
            result.data.categoryId,
            result.data.name,
            result.data.price,
            result.data.imageUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<JajanItemManagementPatchResponse | null> = new ResponseBody<JajanItemManagementPatchResponse | null>(
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
    this.jajanItemManagement
      .deleteOneById(id)
      .then((result: Result<JajanItem | null>) => {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          result.message,
          null
        )
        response
          .status(result.status)
          .send(responseBody)
        response.status(result.status).send()
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
