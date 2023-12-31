import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type VendorManagement from '../../../inners/use_cases/managements/VendorManagement'
import { type Vendor } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import VendorManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementReadManyResponse'
import VendorManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementCreateResponse'
import VendorManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementPatchResponse'
import VendorManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementReadOneResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type VendorAggregate from '../../../inners/models/aggregates/VendorAggregate'
import type VendorManagementReadManyByDistanceAndLocationResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_managements/VendorManagementReadManyByDistanceAndLocationResponse'

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
    this.router.get('/locations', this.readManyByDistanceAndLocation)
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

    let whereInput: any = {}
    if (where !== undefined && where !== null) {
      try {
        whereInput = JSON.parse(decodeURIComponent(where as string))
      } catch (error) {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          'Query parameter where is invalid.',
          null
        )
        response.status(400).send(responseBody)
        return
      }
    }

    let includeInput: any = {}
    if (include !== undefined && include !== null) {
      try {
        includeInput = JSON.parse(decodeURIComponent(include as string))
      } catch (error) {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          'Query parameter include is invalid.',
          null
        )
        response.status(400).send(responseBody)
        return
      }
    }

    this.vendorManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<Vendor[] | VendorAggregate[]>) => {
        const data: VendorManagementReadManyResponse = new VendorManagementReadManyResponse(
          result.data.length,
          result.data.map((vendor: Vendor | VendorAggregate) =>
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
              vendor.updatedAt,
              vendor.deletedAt,
              (vendor as VendorAggregate).notificationHistories,
              (vendor as VendorAggregate).jajanItems,
              (vendor as VendorAggregate).jajanItemSnapshots,
              (vendor as VendorAggregate).payoutHistories
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

  readManyByDistanceAndLocation = (request: Request, response: Response): void => {
    const {
      pageNumber,
      pageSize,
      distance,
      latitude,
      longitude
    } = request.query
    const pagination: Pagination = new Pagination(
      pageNumber === undefined ? 1 : Number(pageNumber),
      pageSize === undefined ? 10 : Number(pageSize)
    )
    const distanceInput: number = distance === undefined ? 0 : Number(distance)
    const latitudeInput: number = latitude === undefined ? 0 : Number(latitude)
    const longitudeInput: number = longitude === undefined ? 0 : Number(longitude)
    this.vendorManagement
      .readManyByDistanceAndLocation(distanceInput, latitudeInput, longitudeInput, pagination)
      .then((result: Result<VendorManagementReadManyByDistanceAndLocationResponse>) => {
        const responseBody: ResponseBody<VendorManagementReadManyByDistanceAndLocationResponse> = new ResponseBody<VendorManagementReadManyByDistanceAndLocationResponse>(
          result.message,
          result.data
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
            result.data.updatedAt,
            result.data.deletedAt
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
      .then((result: Result<Vendor | null>) => {
        let data: VendorManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new VendorManagementCreateResponse(
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
            result.data.updatedAt,
            result.data.deletedAt
          )
        } else {
          data = null
        }
        const responseBody: ResponseBody<VendorManagementCreateResponse | null> = new ResponseBody<VendorManagementCreateResponse | null>(
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
            result.data.updatedAt,
            result.data.deletedAt
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
      this.vendorManagement
        .deleteSoftOneById(id)
        .then((result: Result<Vendor | null>) => {
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
      this.vendorManagement
        .deleteHardOneById(id)
        .then((result: Result<Vendor | null>) => {
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
