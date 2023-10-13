import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type TransactionCheckoutResponse
  from '../../../inners/models/value_objects/responses/transactions/TransactionCheckoutResponse'
import type CheckoutTransaction from '../../../inners/use_cases/transactions/CheckoutTransaction'

export default class TransactionHistoryControllerRest {
  router: Router
  checkoutTransaction: CheckoutTransaction
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, checkoutTransaction: CheckoutTransaction, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.checkoutTransaction = checkoutTransaction
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('/checkout', this.checkout)
  }

  checkout = (request: Request, response: Response): void => {
    this.checkoutTransaction
      .checkout(request.body)
      .then((result: Result<TransactionCheckoutResponse | null>) => {
        const responseBody: ResponseBody<TransactionCheckoutResponse | null> = new ResponseBody<TransactionCheckoutResponse | null>(
          result.message,
          result.data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
