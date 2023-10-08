import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type TransactionHistory } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type TransactionHistoryManagement from '../../../inners/use_cases/managements/TransactionHistoryManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import TransactionHistoryManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/transaction_history_management/TransactionHistoryManagementReadOneResponse'
import TransactionHistoryManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/transaction_history_management/TransactionHistoryManagementReadManyResponse'
import TransactionHistoryManagementCreateResponse
  from '../../../inners/models/value_objects/responses/transaction_history_management/TransactionHistoryManagementCreateResponse'
import TransactionHistoryManagementPatchResponse
  from '../../../inners/models/value_objects/responses/transaction_history_management/TransactionHistoryManagementPatchResponse'
import type TransactionHistoryAggregate from '../../../inners/models/aggregates/TransactionHistoryAggregate'

export default class TransactionHistoryControllerRest {
  router: Router
  transactionHistoryManagement: TransactionHistoryManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, transactionHistoryManagement: TransactionHistoryManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.transactionHistoryManagement = transactionHistoryManagement
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
    const whereInput: any = where === undefined ? {} : JSON.parse(decodeURIComponent(where as string))
    const includeInput: any = include === undefined ? {} : JSON.parse(decodeURIComponent(include as string))
    this.transactionHistoryManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<TransactionHistory[] | TransactionHistoryAggregate[]>) => {
        const data: TransactionHistoryManagementReadManyResponse = new TransactionHistoryManagementReadManyResponse(
          result.data.length,
          result.data.map((transactionHistory: TransactionHistory | TransactionHistoryAggregate) =>
            new TransactionHistoryManagementReadOneResponse(
              transactionHistory.id,
              transactionHistory.userId,
              transactionHistory.jajanItemId,
              transactionHistory.amount,
              transactionHistory.paymentMethod,
              transactionHistory.lastLatitude,
              transactionHistory.lastLongitude,
              transactionHistory.updatedAt,
              transactionHistory.createdAt,
              (transactionHistory as TransactionHistoryAggregate).user,
              (transactionHistory as TransactionHistoryAggregate).jajanItem
            )
          )
        )
        const responseBody: ResponseBody<TransactionHistoryManagementReadManyResponse> = new ResponseBody<TransactionHistoryManagementReadManyResponse>(
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
    this.transactionHistoryManagement
      .readOneById(id)
      .then((result: Result<TransactionHistory | null>) => {
        let data: TransactionHistoryManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new TransactionHistoryManagementReadOneResponse(
            result.data.id,
            result.data.userId,
            result.data.jajanItemId,
            result.data.amount,
            result.data.paymentMethod,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.updatedAt,
            result.data.createdAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<TransactionHistoryManagementReadOneResponse | null> = new ResponseBody<TransactionHistoryManagementReadOneResponse | null>(
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
    this.transactionHistoryManagement
      .createOne(request.body)
      .then((result: Result<TransactionHistory | null>) => {
        let data: TransactionHistoryManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new TransactionHistoryManagementCreateResponse(
            result.data.id,
            result.data.userId,
            result.data.jajanItemId,
            result.data.amount,
            result.data.paymentMethod,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.updatedAt,
            result.data.createdAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<TransactionHistoryManagementCreateResponse | null> = new ResponseBody<TransactionHistoryManagementCreateResponse | null>(
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
    this.transactionHistoryManagement
      .patchOneById(id, request.body)
      .then((result: Result<TransactionHistory | null>) => {
        let data: TransactionHistoryManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new TransactionHistoryManagementPatchResponse(
            result.data.id,
            result.data.userId,
            result.data.jajanItemId,
            result.data.amount,
            result.data.paymentMethod,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.updatedAt,
            result.data.createdAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<TransactionHistoryManagementPatchResponse | null> = new ResponseBody<TransactionHistoryManagementPatchResponse | null>(
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
    this.transactionHistoryManagement
      .deleteOneById(id)
      .then((result: Result<TransactionHistory | null>) => {
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
