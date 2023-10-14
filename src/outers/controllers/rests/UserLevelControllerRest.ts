import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type UserLevel } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type UserLevelManagement from '../../../inners/use_cases/managements/UserLevelManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import UserLevelManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/user_level_managements/UserLevelManagementReadManyResponse'
import UserLevelManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/user_level_managements/UserLevelManagementReadOneResponse'
import UserLevelManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/user_level_managements/UserLevelManagementCreateResponse'
import UserLevelManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/user_level_managements/UserLevelManagementPatchResponse'

export default class UserLevelControllerRest {
  router: Router
  userLevelManagement: UserLevelManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, userLevelManagement: UserLevelManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.userLevelManagement = userLevelManagement
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
    this.userLevelManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<UserLevel[]>) => {
        const data: UserLevelManagementReadManyResponse = new UserLevelManagementReadManyResponse(
          result.data.length,
          result.data.map((userLevel: UserLevel) =>
            new UserLevelManagementReadOneResponse(
              userLevel.id,
              userLevel.name,
              userLevel.minimumExperience,
              userLevel.iconUrl,
              userLevel.createdAt,
              userLevel.updatedAt
            )
          )
        )
        const responseBody: ResponseBody<UserLevelManagementReadManyResponse> = new ResponseBody<UserLevelManagementReadManyResponse>(
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
    this.userLevelManagement
      .readOneById(id)
      .then((result: Result<UserLevel | null>) => {
        let data: UserLevelManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new UserLevelManagementReadOneResponse(
            result.data.id,
            result.data.name,
            result.data.minimumExperience,
            result.data.iconUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserLevelManagementReadOneResponse | null> = new ResponseBody<UserLevelManagementReadOneResponse | null>(
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
    this.userLevelManagement
      .createOne(request.body)
      .then((result: Result<UserLevel | null>) => {
        let data: UserLevelManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new UserLevelManagementCreateResponse(
            result.data.id,
            result.data.name,
            result.data.minimumExperience,
            result.data.iconUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserLevelManagementCreateResponse | null> = new ResponseBody<UserLevelManagementCreateResponse | null>(
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
    this.userLevelManagement
      .patchOneById(id, request.body)
      .then((result: Result<UserLevel | null>) => {
        let data: UserLevelManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new UserLevelManagementPatchResponse(
            result.data.id,
            result.data.name,
            result.data.minimumExperience,
            result.data.iconUrl,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<UserLevelManagementPatchResponse | null> = new ResponseBody<UserLevelManagementPatchResponse | null>(
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
    this.userLevelManagement
      .deleteOneById(id)
      .then((result: Result<UserLevel | null>) => {
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
