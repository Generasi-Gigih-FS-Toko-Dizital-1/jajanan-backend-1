import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import { type VendorLevel } from '@prisma/client'
import Pagination from '../../../inners/models/value_objects/Pagination'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type VendorLevelManagement from '../../../inners/use_cases/managements/VendorLevelManagement'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import VendorLevelManagementReadManyResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_level_managements/VendorLevelManagementReadManyResponse'
import VendorLevelManagementReadOneResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_level_managements/VendorLevelManagementReadOneResponse'
import VendorLevelManagementCreateResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_level_managements/VendorLevelManagementCreateResponse'
import VendorLevelManagementPatchResponse
  from '../../../inners/models/value_objects/responses/managements/vendor_level_managements/VendorLevelManagementPatchResponse'

export default class VendorLevelControllerRest {
  router: Router
  vendorLevelManagement: VendorLevelManagement
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, vendorLevelManagement: VendorLevelManagement, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.vendorLevelManagement = vendorLevelManagement
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.get('', this.readMany)
    this.router.get('/:id', this.readOneById)
    this.router.post('', this.createOne)
    this.router.patch('/:id', this.patchOneById)
    this.router.delete('/:id', this.deleteOneById)
    this.router.get('/experience/levels', this.readOneByExperience)
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
    this.vendorLevelManagement
      .readMany(pagination, whereInput, includeInput)
      .then((result: Result<VendorLevel[]>) => {
        const data: VendorLevelManagementReadManyResponse = new VendorLevelManagementReadManyResponse(
          result.data.length,
          result.data.map((vendorLevel: VendorLevel) =>
            new VendorLevelManagementReadOneResponse(
              vendorLevel.id,
              vendorLevel.name,
              vendorLevel.minimumExperience,
              vendorLevel.iconUrl,
              vendorLevel.createdAt,
              vendorLevel.updatedAt
            )
          )
        )
        const responseBody: ResponseBody<VendorLevelManagementReadManyResponse> = new ResponseBody<VendorLevelManagementReadManyResponse>(
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
    this.vendorLevelManagement
      .readOneById(id)
      .then((result: Result<VendorLevel | null>) => {
        let data: VendorLevelManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new VendorLevelManagementReadOneResponse(
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
        const responseBody: ResponseBody<VendorLevelManagementReadOneResponse | null> = new ResponseBody<VendorLevelManagementReadOneResponse | null>(
          result.message,
          data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  readOneByExperience = (request: Request, response: Response): void => {
    const { experience } = request.query

    if (experience === undefined || experience === null) {
      const responseBody: ResponseBody<null> = new ResponseBody<null>(
        'Experience query parameter is required.',
        null
      )
      response.status(400).send(responseBody)
      return
    }

    this.vendorLevelManagement
      .readOneByExperience(Number(experience))
      .then((result: Result<VendorLevel | null>) => {
        let data: VendorLevelManagementReadOneResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new VendorLevelManagementReadOneResponse(
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
        const responseBody: ResponseBody<VendorLevelManagementReadOneResponse | null> = new ResponseBody<VendorLevelManagementReadOneResponse | null>(
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
    this.vendorLevelManagement
      .createOne(request.body)
      .then((result: Result<VendorLevel | null>) => {
        let data: VendorLevelManagementCreateResponse | null
        if (result.status === 201 && result.data !== null) {
          data = new VendorLevelManagementCreateResponse(
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
        const responseBody: ResponseBody<VendorLevelManagementCreateResponse | null> = new ResponseBody<VendorLevelManagementCreateResponse | null>(
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
    this.vendorLevelManagement
      .patchOneById(id, request.body)
      .then((result: Result<VendorLevel | null>) => {
        let data: VendorLevelManagementPatchResponse | null
        if (result.status === 200 && result.data !== null) {
          data = new VendorLevelManagementPatchResponse(
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
        const responseBody: ResponseBody<VendorLevelManagementPatchResponse | null> = new ResponseBody<VendorLevelManagementPatchResponse | null>(
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
      this.vendorLevelManagement
        .deleteSoftOneById(id)
        .then((result: Result<VendorLevel | null>) => {
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
      this.vendorLevelManagement
        .deleteHardOneById(id)
        .then((result: Result<VendorLevel | null>) => {
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
