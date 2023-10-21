import { type Request, type Response, type Router } from 'express'
import type PayoutHistoryManagement from '../../../inners/use_cases/managements/PayoutHistoryManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import Pagination from '../../../inners/models/value_objects/Pagination'
import { type PayoutHistory } from '@prisma/client'
import type Result from '../../../inners/models/value_objects/Result'
import type PayoutHistoryAggregate from '../../../inners/models/aggregates/PayoutHistoryAggregate'
import PayoutHistoryManagementReadManyResponse from '../../../inners/models/value_objects/responses/managements/payout_history_management/PayoutHistoryManagementReadManyResponse'
import PayoutHistoryManagementReadOneResponse from '../../../inners/models/value_objects/responses/managements/payout_history_management/PayoutHistoryManagementReadOneResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import PayoutHistoryManagementCreateResponse from '../../../inners/models/value_objects/responses/managements/payout_history_management/PayoutHistoryManagementCreateResponse'
import PayoutHistoryManagementPatchResponse from '../../../inners/models/value_objects/responses/managements/payout_history_management/PayoutHistoryManagementPatchResponse'

export default class PayoutHistoryController {
  constructor (
    public readonly router: Router,
    private readonly payoutHistoryManagement: PayoutHistoryManagement,
    private readonly authenticationValidation: AuthenticationValidation
  ) {}

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

    this.payoutHistoryManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<PayoutHistory[] | PayoutHistoryAggregate[]>) => {
        const data: PayoutHistoryManagementReadManyResponse = new PayoutHistoryManagementReadManyResponse(
          result.data.length,
          result.data.map((payoutHistory: PayoutHistory | PayoutHistoryAggregate) =>
            new PayoutHistoryManagementReadOneResponse(
              payoutHistory.id,
              payoutHistory.vendorId,
              payoutHistory.xenditPayoutId,
              payoutHistory.amount,
              payoutHistory.media,
              payoutHistory.createdAt,
              payoutHistory.updatedAt,
              (payoutHistory as PayoutHistoryAggregate).vendor
            )
          )
        )

        const responseBody: ResponseBody<PayoutHistoryManagementReadManyResponse> = new ResponseBody<PayoutHistoryManagementReadManyResponse>(
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

    this.payoutHistoryManagement
      .readOneById(id)
      .then((result: Result<PayoutHistory | null>) => {
        let data: PayoutHistoryManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new PayoutHistoryManagementReadOneResponse(
            result.data.id,
            result.data.vendorId,
            result.data.xenditPayoutId,
            result.data.amount,
            result.data.media,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }

        const responseBody: ResponseBody<PayoutHistoryManagementReadOneResponse | null> = new ResponseBody<PayoutHistoryManagementReadOneResponse | null>(
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
    this.payoutHistoryManagement
      .createOne(request.body)
      .then((result: Result<PayoutHistory | null>) => {
        let data: PayoutHistoryManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new PayoutHistoryManagementCreateResponse(
            result.data.id,
            result.data.vendorId,
            result.data.xenditPayoutId,
            result.data.amount,
            result.data.media,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }

        const responseBody: ResponseBody<PayoutHistoryManagementCreateResponse | null> = new ResponseBody<PayoutHistoryManagementCreateResponse | null>(
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
    this.payoutHistoryManagement
      .patchOneById(id, request.body)
      .then((result: Result<PayoutHistory | null>) => {
        let data: PayoutHistoryManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new PayoutHistoryManagementPatchResponse(
            result.data.id,
            result.data.vendorId,
            result.data.xenditPayoutId,
            result.data.amount,
            result.data.media,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<PayoutHistoryManagementPatchResponse | null> = new ResponseBody<PayoutHistoryManagementPatchResponse | null>(
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
    this.payoutHistoryManagement
      .deleteOneById(id)
      .then((result: Result<PayoutHistory | null>) => {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          result.message,
          null
        )
        response
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
