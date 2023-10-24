import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type SubscriptionUser from '../../../inners/use_cases/subscriptions/SubscriptionUser'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'

export default class UserSubscriptionControllerRest {
  router: Router
  subscriptionUser: SubscriptionUser
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, subscriptionUser: SubscriptionUser, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.subscriptionUser = subscriptionUser
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('/subscribe', this.subscribe)
    this.router.post('/unsubscribe', this.unsubscribe)
  }

  subscribe = (request: Request, response: Response): void => {
    this.subscriptionUser
      .subscribe(request.body)
      .then((result: Result<null>) => {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          result.message,
          result.data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  unsubscribe = (request: Request, response: Response): void => {
    this.subscriptionUser
      .unsubscribe(request.body)
      .then((result: Result<null>) => {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
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
