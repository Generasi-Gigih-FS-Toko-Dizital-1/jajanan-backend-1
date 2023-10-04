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

export default class JajanItemControllerRest {
  router: Router
  jajanItemManagement: JajanItemManagement

  constructor (router: Router, jajanItemManagement: JajanItemManagement) {
    this.router = router
    this.jajanItemManagement = jajanItemManagement
  }

  registerRoutes = (): void => {
    this.router.get('', this.readMany)
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

  createOne = (request: Request, response: Response): void => {
    this.jajanItemManagement
      .createOne(request.body)
      .then((result: Result<JajanItem>) => {
        const data: JajanItemManagementCreateResponse = new JajanItemManagementCreateResponse(
          result.data.id,
          result.data.vendorId,
          result.data.categoryId,
          result.data.name,
          result.data.price,
          result.data.imageUrl,
          result.data.createdAt,
          result.data.updatedAt
        )
        const responseBody: ResponseBody<JajanItemManagementCreateResponse> = new ResponseBody<JajanItemManagementCreateResponse>(
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
      .then((result: Result<JajanItem>) => {
        const responseBody: ResponseBody<JajanItemManagementPatchResponse> = new ResponseBody<JajanItemManagementPatchResponse>(
          result.message,
          new JajanItemManagementPatchResponse(
            result.data.id,
            result.data.vendorId,
            result.data.categoryId,
            result.data.name,
            result.data.price,
            result.data.imageUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
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
      .then((result: Result<JajanItem>) => {
        response.status(result.status).send()
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
