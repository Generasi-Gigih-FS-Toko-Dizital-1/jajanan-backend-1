import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type VendorManagement from '../../../inners/use_cases/managements/VendorManagement'
import { type Vendor } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import VendorManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/vendor_managements/VendorManagementReadManyResponse'
import VendorManagementCreateResponse
  from '../../../inners/models/value_objects/responses/vendor_managements/VendorManagementCreateResponse'
import VendorManagementPatchResponse
  from '../../../inners/models/value_objects/responses/vendor_managements/VendorManagementPatchResponse'
import VendorManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/vendor_managements/VendorManagementReadOneResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'

export default class VendorControllerRest {
  router: Router
  vendorManagement: VendorManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, vendorManagement: VendorManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.vendorManagement = vendorManagement
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
    this.vendorManagement
      .readMany(pagination)
      .then((result: Result<Vendor[]>) => {
        const data: VendorManagementReadManyResponse = new VendorManagementReadManyResponse(
          result.data.length,
          result.data.map((vendor: Vendor) =>
            new VendorManagementReadOneResponse(
              vendor.id,
              vendor.fullName,
              vendor.gender,
              vendor.address,
              vendor.username,
              vendor.email,
              vendor.balance,
              vendor.experience,
              vendor.jajanImageUrl,
              vendor.jajanName,
              vendor.jajanDescription,
              vendor.status,
              vendor.lastLatitude,
              vendor.lastLongitude,
              vendor.createdAt,
              vendor.updatedAt
            )
          )
        )
        const responseBody: ResponseBody<VendorManagementReadManyResponse> = new ResponseBody<VendorManagementReadManyResponse>(
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
    this.vendorManagement
      .readOneById(id)
      .then((result: Result<Vendor | null>) => {
        let data: VendorManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new VendorManagementReadOneResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.address,
            result.data.username,
            result.data.email,
            result.data.balance,
            result.data.experience,
            result.data.jajanImageUrl,
            result.data.jajanName,
            result.data.jajanDescription,
            result.data.status,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<VendorManagementReadOneResponse | null> = new ResponseBody<VendorManagementReadOneResponse | null>(
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
    this.vendorManagement
      .createOne(request.body)
      .then((result: Result<Vendor>) => {
        const data: VendorManagementCreateResponse = new VendorManagementCreateResponse(
          result.data.id,
          result.data.fullName,
          result.data.gender,
          result.data.address,
          result.data.username,
          result.data.email,
          result.data.balance,
          result.data.experience,
          result.data.jajanImageUrl,
          result.data.jajanName,
          result.data.jajanDescription,
          result.data.status,
          result.data.lastLatitude,
          result.data.lastLongitude,
          result.data.createdAt,
          result.data.updatedAt
        )
        const responseBody: ResponseBody<VendorManagementCreateResponse> = new ResponseBody<VendorManagementCreateResponse>(
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
    this.vendorManagement
      .patchOneById(id, request.body)
      .then((result: Result<Vendor | null>) => {
        let data: VendorManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new VendorManagementPatchResponse(
            result.data.id,
            result.data.fullName,
            result.data.gender,
            result.data.address,
            result.data.username,
            result.data.email,
            result.data.balance,
            result.data.experience,
            result.data.jajanImageUrl,
            result.data.jajanName,
            result.data.jajanDescription,
            result.data.status,
            result.data.lastLatitude,
            result.data.lastLongitude,
            result.data.createdAt,
            result.data.updatedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<VendorManagementPatchResponse | null> = new ResponseBody<VendorManagementPatchResponse | null>(
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
    this.vendorManagement
      .deleteOneById(id)
      .then((result: Result<Vendor>) => {
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
