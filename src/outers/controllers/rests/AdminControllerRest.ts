import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type AdminManagement from '../../../inners/use_cases/managements/AdminManagement'
import { type Admin } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import AdminManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/admin_managements/AdminManagementReadManyResponse'
import AdminManagementCreateResponse
  from '../../../inners/models/value_objects/responses/admin_managements/AdminManagementCreateResponse'
import AdminManagementPatchResponse
  from '../../../inners/models/value_objects/responses/admin_managements/AdminManagementPatchResponse'
import AdminManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/admin_managements/AdminManagementReadOneResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'

export default class AdminControllerRest {
  router: Router
  adminManagement: AdminManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, adminManagement: AdminManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.adminManagement = adminManagement
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
    const { pageNumber, pageSize } = request.query
    const pagination: Pagination = new Pagination(
      pageNumber === undefined ? 1 : Number(pageNumber),
      pageSize === undefined ? 10 : Number(pageSize)
    )
    this.adminManagement
      .readMany(pagination)
      .then((result: Result<Admin[]>) => {
        const data: AdminManagementReadManyResponse = new AdminManagementReadManyResponse(
          result.data.length,
          result.data.map((admin: Admin) =>
            new AdminManagementReadOneResponse(
              admin.id,
              admin.fullName,
              admin.gender,
              admin.email,
              admin.createdAt,
              admin.updatedAt
            )
          )
        )
        const responseBody: ResponseBody<AdminManagementReadManyResponse> = new ResponseBody<AdminManagementReadManyResponse>(
          result.message,
          data
        )

        const sessionString = JSON.stringify(response.locals.session)
        response
          .cookie(
            'session',
            sessionString,
            {
              expires: response.locals.session.expiredAt
            }
          )
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  readOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.adminManagement
      .readOneById(id)
      .then((result: Result<Admin>) => {
        const data: AdminManagementReadOneResponse = new AdminManagementReadOneResponse(
          result.data.id,
          result.data.fullName,
          result.data.gender,
          result.data.email,
          result.data.createdAt,
          result.data.updatedAt
        )
        const responseBody: ResponseBody<AdminManagementReadOneResponse> = new ResponseBody<AdminManagementReadOneResponse>(
          result.message,
          data
        )
        const sessionString = JSON.stringify(response.locals.session)
        response
          .cookie(
            'session',
            sessionString,
            {
              expires: response.locals.session.expiredAt
            }
          )
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  createOne = (request: Request, response: Response): void => {
    this.adminManagement
      .createOne(request.body)
      .then((result: Result<Admin>) => {
        const data: AdminManagementCreateResponse = new AdminManagementCreateResponse(
          result.data.id,
          result.data.fullName,
          result.data.gender,
          result.data.email,
          result.data.createdAt,
          result.data.updatedAt
        )
        const responseBody: ResponseBody<AdminManagementCreateResponse> = new ResponseBody<AdminManagementCreateResponse>(
          result.message,
          data
        )
        const sessionString = JSON.stringify(response.locals.session)
        response
          .cookie(
            'session',
            sessionString,
            {
              expires: response.locals.session.expiredAt
            }
          )
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  patchOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.adminManagement
      .patchOneById(id, request.body)
      .then((result: Result<Admin>) => {
        const responseBody: ResponseBody<AdminManagementPatchResponse> = new ResponseBody<AdminManagementPatchResponse>(
          result.message,
          new AdminManagementPatchResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.email,
            result.data.createdAt,
            result.data.updatedAt
          )
        )
        const sessionString = JSON.stringify(response.locals.session)
        response
          .cookie(
            'session',
            sessionString,
            {
              expires: response.locals.session.expiredAt
            }
          )
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  deleteOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.adminManagement
      .deleteOneById(id)
      .then((result: Result<Admin>) => {
        const sessionString = JSON.stringify(response.locals.session)
        response
          .cookie(
            'session',
            sessionString,
            {
              expires: response.locals.session.expiredAt
            }
          )
          .status(result.status)
          .send()
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
