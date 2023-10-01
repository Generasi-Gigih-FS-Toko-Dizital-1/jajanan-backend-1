import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type UserManagement from '../../../inners/use_cases/managements/UserManagement'
import { type User } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import UserManagementReadManyResponse from '../../../inners/models/value_objects/responses/user_managements/UserManagementReadManyResponse'
import UserManagementCreateResponse from '../../../inners/models/value_objects/responses/user_managements/UserManagementCreateResponse'
import UserManagementUpdateResponse from '../../../inners/models/value_objects/responses/user_managements/UserManagementUpdateResponse'
import UserManagementReadOneResponse from '../../../inners/models/value_objects/responses/user_managements/UserManagementReadOneResponse'

export default class UserControllerRest {
  router: Router
  userManagement: UserManagement

  constructor (router: Router, userManagement: UserManagement) {
    this.router = router
    this.userManagement = userManagement
  }

  registerRoutes = (): void => {
    this.router.get('', this.readMany)
    this.router.get('/:id', this.readOneById)
    this.router.post('', this.createOne)
    this.router.patch('/:id', this.patchOneById)
    this.router.delete('/:id', this.deleteOneById)
  }

  readMany = (request: Request, response: Response): void => {
    const { page, perPage } = request.query
    this.userManagement
      .readMany(new Pagination(Number(page), Number(perPage)))
      .then((result: Result<User[]>) => {
        const data: UserManagementReadManyResponse = new UserManagementReadManyResponse(
          result.data.length,
          result.data
        )
        response.status(result.status).send(data)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  readOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.userManagement
      .readOneById(id)
      .then((result: Result<User>) => {
        const data: UserManagementReadOneResponse = new UserManagementReadOneResponse(
          result.data.id,
          result.data.fullName,
          result.data.username,
          result.data.email,
          result.data.gender,
          result.data.balance,
          result.data.experience,
          result.data.lastLatitude,
          result.data.lastLongitude,
          result.message
        )
        response.status(result.status).send(data)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  createOne = (request: Request, response: Response): void => {
    this.userManagement
      .createOne(request.body)
      .then((result: Result<User>) => {
        const data: UserManagementCreateResponse = new UserManagementCreateResponse(
          result.data.id,
          result.data.fullName,
          result.data.username,
          result.data.email,
          result.data.gender,
          result.message
        )
        response.status(result.status).send(data)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  patchOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.userManagement
      .patchOneById(id, request.body)
      .then((result: Result<User>) => {
        const data: UserManagementUpdateResponse = new UserManagementUpdateResponse(
          result.data.id,
          result.data.fullName,
          result.data.username,
          result.data.email,
          result.data.gender,
          result.message
        )
        response.status(result.status).send(data)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  deleteOneById = (request: Request, response: Response): void => {
    const { id } = request.params
    this.userManagement
      .deleteOneById(id)
      .then((result: Result<User>) => {
        response.status(result.status).send()
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
