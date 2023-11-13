import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type UserManagement from '../../../inners/use_cases/managements/UserManagement'
import { type User } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import UserManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/user_managements/UserManagementReadManyResponse'
import UserManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/user_managements/UserManagementCreateResponse'
import UserManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/user_managements/UserManagementPatchResponse'
import UserManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/user_managements/UserManagementReadOneResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type UserAggregate from '../../../inners/models/aggregates/UserAggregate'

export default class UserControllerRest {
  router: Router
  userManagement: UserManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, userManagement: UserManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.userManagement = userManagement
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
    this.userManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<User[] | UserAggregate[]>) => {
        const data: UserManagementReadManyResponse = new UserManagementReadManyResponse(
          result.data.length,
          result.data.map((user: User | UserAggregate) =>
            new UserManagementReadOneResponse(
              user.id,
              user.fullName,
              user.gender,
              user.address,
              user.username,
              user.email,
              user.balance,
              user.experience,
              user.lastLatitude,
              user.lastLongitude,
              user.createdAt,
              user.updatedAt,
              user.deletedAt,
              (user as UserAggregate).notificationHistories,
              (user as UserAggregate).topUpHistories,
              (user as UserAggregate).transactionHistories,
              (user as UserAggregate).userSubscriptions
            )
          )
        )
        const responseBody: ResponseBody<UserManagementReadManyResponse> = new ResponseBody<UserManagementReadManyResponse>(
          result.message,
          data
        )
        response
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  readOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.userManagement
      .readOneById(id)
      .then((result: Result<User | null>) => {
        let data: UserManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new UserManagementReadOneResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.address,
            result.data.username,
            result.data.email,
            result.data.balance,
            result.data.experience,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.createdAt,
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserManagementReadOneResponse | null> = new ResponseBody<UserManagementReadOneResponse | null>(
          result.message,
          data
        )
        response
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  createOne = (request: Request, response: Response): void => {
    this.userManagement
      .createOne(request.body)
      .then((result: Result<User | null>) => {
        let data: UserManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new UserManagementCreateResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.address,
            result.data.username,
            result.data.email,
            result.data.balance,
            result.data.experience,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.createdAt,
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserManagementCreateResponse | null> = new ResponseBody<UserManagementCreateResponse | null>(
          result.message,
          data
        )
        response
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  patchOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.userManagement
      .patchOneById(id, request.body)
      .then((result: Result<User | null>) => {
        let data: UserManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new UserManagementPatchResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.address,
            result.data.username,
            result.data.email,
            result.data.balance,
            result.data.experience,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.createdAt,
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserManagementPatchResponse | null> = new ResponseBody<UserManagementPatchResponse | null>(
          result.message,
          data
        )
        response
          .status(result.status)
          .send(responseBody)
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
      this.userManagement
        .deleteSoftOneById(id)
        .then((result: Result<User | null>) => {
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
      this.userManagement
        .deleteHardOneById(id)
        .then((result: Result<User | null>) => {
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
