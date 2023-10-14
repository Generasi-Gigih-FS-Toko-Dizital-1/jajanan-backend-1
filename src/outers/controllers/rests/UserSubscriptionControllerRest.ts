import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type UserSubscription } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type UserSubscriptionManagement from '../../../inners/use_cases/managements/UserSubscriptionManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type UserSubscriptionAggregate from '../../../inners/models/aggregates/UserSubscriptionAggregate'
import UserSubscriptionManagementReadManyResponse from '../../../inners/models/value_objects/responses/managements/user_subscription_managements/UserSubscriptionManagementReadManyResponse'
import UserSubscriptionManagementReadOneResponse from '../../../inners/models/value_objects/responses/managements/user_subscription_managements/UserSubscriptionManagementReadOneResponse'
import UserSubscriptionManagementCreateResponse from '../../../inners/models/value_objects/responses/managements/user_subscription_managements/UserSubscriptionManagementCreateResponse'
import UserSubscriptionManagementPatchResponse from '../../../inners/models/value_objects/responses/managements/user_subscription_managements/UserSubscriptionManagementPatchResponse'

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
    this.userSubscriptionManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<UserSubscription[] | UserSubscriptionAggregate[]>) => {
        const data: UserSubscriptionManagementReadManyResponse = new UserSubscriptionManagementReadManyResponse(
          result.data.length,
          result.data.map((userSubscription: UserSubscription | UserSubscriptionAggregate) =>
            new UserSubscriptionManagementReadOneResponse(
              userSubscription.id,
              userSubscription.userId,
              userSubscription.categoryId,
              userSubscription.createdAt,
              userSubscription.updatedAt,
              (userSubscription as UserSubscriptionAggregate).user,
              (userSubscription as UserSubscriptionAggregate).category
            )
          )
        )
        const responseBody: ResponseBody<UserSubscriptionManagementReadManyResponse> = new ResponseBody<UserSubscriptionManagementReadManyResponse>(
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
    this.userSubscriptionManagement
      .readOneById(id)
      .then((result: Result<UserSubscription | null>) => {
        let data: UserSubscriptionManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new UserSubscriptionManagementReadOneResponse(
            result.data.id,
            result.data.userId,
            result.data.categoryId,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserSubscriptionManagementReadOneResponse | null> = new ResponseBody<UserSubscriptionManagementReadOneResponse | null>(
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

  patchOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.userSubscriptionManagement
      .patchOneById(id, request.body)
      .then((result: Result<UserSubscription | null>) => {
        let data: UserSubscriptionManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new UserSubscriptionManagementPatchResponse(
            result.data.id,
            result.data.userId,
            result.data.categoryId,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserSubscriptionManagementPatchResponse | null> = new ResponseBody<UserSubscriptionManagementPatchResponse | null>(
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
