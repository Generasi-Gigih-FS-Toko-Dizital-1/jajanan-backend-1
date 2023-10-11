import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type AdminManagement from '../../../inners/use_cases/managements/AdminManagement'
import { type Admin } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import AdminManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/admin_managements/AdminManagementReadManyResponse'
import AdminManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/admin_managements/AdminManagementCreateResponse'
import AdminManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/admin_managements/AdminManagementPatchResponse'
import AdminManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/admin_managements/AdminManagementReadOneResponse'
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
    const {
      pageNumber,
      pageSize,
      where
    } = request.query
    const pagination: Pagination = new Pagination(
      pageNumber === undefined ? 1 : Number(pageNumber),
      pageSize === undefined ? 10 : Number(pageSize)
    )
    const whereInput: any = where === undefined ? {} : JSON.parse(decodeURIComponent(where as string))
    this.adminManagement
      .readMany(pagination, whereInput)
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
    this.adminManagement
      .readOneById(id)
      .then((result: Result<Admin | null>) => {
        let data: AdminManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new AdminManagementReadOneResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.email,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<AdminManagementReadOneResponse | null> = new ResponseBody<AdminManagementReadOneResponse | null>(
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
    this.adminManagement
      .patchOneById(id, request.body)
      .then((result: Result<Admin | null>) => {
        let data: AdminManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new AdminManagementPatchResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.email,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<AdminManagementPatchResponse | null> = new ResponseBody<AdminManagementPatchResponse | null>(
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
    this.adminManagement
      .deleteOneById(id)
      .then((result: Result<Admin | null>) => {
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
