import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type UserSubscription } from '@prisma/client'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type UserSubscriptionManagement from '../../../inners/use_cases/subscriptions/UserSubscriptionManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import UserSubscriptionManagementCreateResponse from '../../../inners/models/value_objects/responses/managements/user_subscription_managements/UserSubscriptionManagementCreateResponse'

export default class UserSubscriptionControllerRest {
  router: Router
  userSubscriptionManagement: UserSubscriptionManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, userSubscriptionManagement: UserSubscriptionManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.userSubscriptionManagement = userSubscriptionManagement
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('', this.createOne)
    this.router.delete('/:id', this.deleteOneById)
  }

  createOne = (request: Request, response: Response): void => {
    this.userSubscriptionManagement
      .createOne(request.body)
      .then((result: Result<UserSubscription | null>) => {
        let data: UserSubscriptionManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new UserSubscriptionManagementCreateResponse(
            result.data.id,
            result.data.userId,
            result.data.categoryId,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserSubscriptionManagementCreateResponse | null> = new ResponseBody<UserSubscriptionManagementCreateResponse | null>(
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
    this.userSubscriptionManagement
      .deleteOneById(id)
      .then((result: Result<UserSubscription | null>) => {
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
