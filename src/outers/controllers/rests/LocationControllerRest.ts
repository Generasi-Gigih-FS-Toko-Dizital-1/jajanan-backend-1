import { type Request, type Response, type Router } from 'express'

import type Result from '../../../inners/models/value_objects/Result'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type LocationSync from '../../../inners/use_cases/locations/LocationSync'
import type UserLocationSyncResponse
  from '../../../inners/models/value_objects/responses/locations/UserLocationSyncResponse'
import type VendorLocationSyncResponse
  from '../../../inners/models/value_objects/responses/locations/VendorLocationSyncResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'

export default class LocationControllerRest {
  router: Router
  locationSync: LocationSync
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, locationSync: LocationSync, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.locationSync = locationSync
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('/sync-user', this.syncUser)
    this.router.post('/sync-vendor', this.syncVendor)
  }

  syncUser = (request: Request, response: Response): void => {
    const {
      include
    } = request.query

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
    this.locationSync
      .syncUserLocation(request.body, includeInput)
      .then((result: Result<UserLocationSyncResponse | null>) => {
        const responseBody: ResponseBody<UserLocationSyncResponse | null > = new ResponseBody<UserLocationSyncResponse | null>(
          result.message,
          result.data
        )
        response.status(result.status).send(responseBody)
        response.status(result.status).send(result.data)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }

  syncVendor = (request: Request, response: Response): void => {
    const {
      include
    } = request.query

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
    this.locationSync
      .syncVendorLocation(request.body, includeInput)
      .then((result: Result<VendorLocationSyncResponse | null>) => {
        const responseBody: ResponseBody<VendorLocationSyncResponse | null > = new ResponseBody<VendorLocationSyncResponse | null>(
          result.message,
          result.data
        )
        response.status(result.status).send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(error.message)
      })
  }
}
