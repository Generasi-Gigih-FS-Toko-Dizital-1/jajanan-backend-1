import { type Request, type Response, type Router } from 'express'
import type TopUpHistoryManagement from '../../../inners/use_cases/managements/TopUpHistoryManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import Pagination from '../../../inners/models/value_objects/Pagination'
import type TopUpHistoryAggregate from '../../../inners/models/aggregates/TopUpHistoryAggregate'
import { type TopUpHistory } from '@prisma/client'
import TopUpHistoryManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/top_up_history_managements/TopUpHistoryManagementReadManyResponse'
import TopUpHistoryManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/top_up_history_managements/TopUpHistoryManagementReadOneResponse'
import type Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import TopUpHistoryManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/top_up_history_managements/TopUpHistoryManagementCreateResponse'
import TopUpHistoryManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/top_up_history_managements/TopUpHistoryManagementPatchResponse'

export default class TopUpHistoryController {
  router: Router
  topUpHistoryManagement: TopUpHistoryManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, topUpHistoryManagement: TopUpHistoryManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.topUpHistoryManagement = topUpHistoryManagement
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

    this.topUpHistoryManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<TopUpHistory[] | TopUpHistoryAggregate[]>) => {
        const data: TopUpHistoryManagementReadManyResponse = new TopUpHistoryManagementReadManyResponse(
          result.data.length,
          result.data.map((topUpHistory: TopUpHistory | TopUpHistoryAggregate) =>
            new TopUpHistoryManagementReadOneResponse(
              topUpHistory.id,
              topUpHistory.userId,
              topUpHistory.xenditInvoiceId,
              topUpHistory.amount,
              topUpHistory.media,
              topUpHistory.updatedAt,
              topUpHistory.createdAt,
              topUpHistory.deletedAt,
              (topUpHistory as TopUpHistoryAggregate).user
            )
          )
        )
        const responseBody: ResponseBody<TopUpHistoryManagementReadManyResponse> = new ResponseBody<TopUpHistoryManagementReadManyResponse>(
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
    this.topUpHistoryManagement
      .readOneById(id)
      .then((result: Result<TopUpHistory | null>) => {
        let data: TopUpHistoryManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new TopUpHistoryManagementReadOneResponse(
            result.data.id,
            result.data.userId,
            result.data.xenditInvoiceId,
            result.data.amount,
            result.data.media,
            result.data.updatedAt,
            result.data.createdAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }

        const responseBody: ResponseBody<TopUpHistoryManagementReadOneResponse | null> = new ResponseBody<TopUpHistoryManagementReadOneResponse | null>(
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
    this.topUpHistoryManagement
      .createOne(request.body)
      .then((result: Result<TopUpHistory | null>) => {
        let data: TopUpHistoryManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new TopUpHistoryManagementCreateResponse(
            result.data.id,
            result.data.userId,
            result.data.xenditInvoiceId,
            result.data.amount,
            result.data.media,
            result.data.updatedAt,
            result.data.createdAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }

        const responseBody: ResponseBody<TopUpHistoryManagementCreateResponse | null> = new ResponseBody<TopUpHistoryManagementCreateResponse | null>(
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
    this.topUpHistoryManagement
      .patchOneById(id, request.body)
      .then((result: Result<TopUpHistory | null>) => {
        let data: TopUpHistoryManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new TopUpHistoryManagementPatchResponse(
            result.data.id,
            result.data.userId,
            result.data.xenditInvoiceId,
            result.data.amount,
            result.data.media,
            result.data.updatedAt,
            result.data.createdAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }

        const responseBody: ResponseBody<TopUpHistoryManagementPatchResponse | null> = new ResponseBody<TopUpHistoryManagementPatchResponse | null>(
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
      this.topUpHistoryManagement
        .deleteSoftOneById(id)
        .then((result: Result<TopUpHistory | null>) => {
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
      this.topUpHistoryManagement
        .deleteHardOneById(id)
        .then((result: Result<TopUpHistory | null>) => {
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
