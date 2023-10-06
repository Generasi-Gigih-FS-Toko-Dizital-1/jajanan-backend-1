import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { PaymentMethod, type TransactionHistory } from '@prisma/client'
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
import type TransactionManagement from '../../../inners/use_cases/managements/TransactionManagement'
import TransactionManagementCreateResponse
  from '../../../inners/models/value_objects/responses/transaction_management/TransactionManagementCreateResponse'

export default class TransactionHistoryControllerRest {
  router: Router
  transactionManagement: TransactionManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, transactionManagement: TransactionManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.transactionManagement = transactionManagement
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('', this.createOne)
  }

  createOne = (request: Request, response: Response): void => {
    this.transactionManagement
      .createOne(request.body)
      .then((result: Result<TransactionHistory>) => {
        const data: TransactionManagementCreateResponse = new TransactionManagementCreateResponse(
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
        const responseBody: ResponseBody<TransactionManagementCreateResponse> = new ResponseBody<TransactionManagementCreateResponse>(
          result.message,
          data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
