import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import type VendorLoginAuthentication from '../../../inners/use_cases/authentications/vendors/VendorLoginAuthentication'
import type VendorRegisterByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { type Vendor } from '@prisma/client'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import VendorLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/vendors/VendorLoginByEmailAndPasswordResponse'
import type VendorLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import VendorRegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/vendors/VendorRegisterByEmailAndPasswordResponse'
import type VendorRegisterAuthentication
  from '../../../inners/use_cases/authentications/vendors/VendorRegisterAuthentication'

import type Session from '../../../inners/models/value_objects/Session'
import type VendorRefreshAccessTokenRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorRefreshAccessTokenRequest'

import type VendorRefreshAuthentication
  from '../../../inners/use_cases/authentications/vendors/VendorRefreshAuthentication'

export default class VendorAuthenticationControllerRest {
  router: Router
  vendorLoginAuthentication: VendorLoginAuthentication
  vendorRegisterAuthentication: VendorRegisterAuthentication
  vendorRefreshAuthentication: VendorRefreshAuthentication

  constructor (
    router: Router,
    loginAuthentication: VendorLoginAuthentication,
    registerAuthentication: VendorRegisterAuthentication,
    vendorAuthenticationRefresh: VendorRefreshAuthentication
  ) {
    this.router = router
    this.vendorLoginAuthentication = loginAuthentication
    this.vendorRegisterAuthentication = registerAuthentication
    this.vendorRefreshAuthentication = vendorAuthenticationRefresh
  }

  registerRoutes = (): void => {
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
    this.router.post('/refreshes/access-token', this.refreshAccessToken)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByEmailAndPassword: VendorLoginByEmailAndPasswordRequest = request.body
      this.vendorLoginAuthentication.loginByEmailAndPassword(requestToLoginByEmailAndPassword)
        .then((result: Result<Session | null>) => {
          let data: VendorLoginByEmailAndPasswordResponse | null = null
          if (result.data !== null) {
            data = new VendorLoginByEmailAndPasswordResponse(
              result.data
            )
          }
          const responseBody: ResponseBody<VendorLoginByEmailAndPasswordResponse | null> = new ResponseBody<VendorLoginByEmailAndPasswordResponse | null>(
            result.message,
            data
          )
          response
            .status(result.status)
            .send(responseBody)
        })
        .catch((error: Error) => {
          response.status(500).send(
            new Result<null>(
              500,
                    `Login by method ${method} failed: ${error.message}`,
                    null
            )
          )
        })
    } else {
      response.status(400).send(
        new Result<null>(
          400,
              `Login by method ${method as string} failed, unknown method.`,
              null
        )
      )
    }
  }

  register = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const registerByEmailAndPasswordRequest: VendorRegisterByEmailAndPasswordRequest = request.body
      this.vendorRegisterAuthentication.registerByEmailAndPassword(registerByEmailAndPasswordRequest)
        .then((result: Result<Vendor | null>) => {
          let data: VendorRegisterByEmailAndPasswordResponse | null
          if (result.status === 201 && result.data !== null) {
            data = new VendorRegisterByEmailAndPasswordResponse(
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
            data = result.data
          }
          const responseBody: ResponseBody<VendorRegisterByEmailAndPasswordResponse | null> = new ResponseBody<VendorRegisterByEmailAndPasswordResponse | null>(
            result.message,
            data
          )
          response.status(result.status).send(responseBody)
        })
        .catch((error: Error) => {
          response.status(500).send(
            new Result<null>(
              500,
                    `Register by method ${method} failed: ${error.message}`,
                    null
            )
          )
        })
    } else {
      response.status(400).send(
        new Result<null>(
          400,
              `Register by method ${method as string} failed, unknown method.`,
              null
        )
      )
    }
  }

  refreshAccessToken = (request: Request, response: Response): void => {
    const requestToRefreshAccessToken: VendorRefreshAccessTokenRequest = request.body
    this.vendorRefreshAuthentication.refreshAccessToken(requestToRefreshAccessToken)
      .then((result: Result<Session | null>) => {
        let data: VendorLoginByEmailAndPasswordResponse | null = null
        if (result.data !== null) {
          data = new VendorLoginByEmailAndPasswordResponse(
            result.data
          )
        }
        const responseBody: ResponseBody<VendorLoginByEmailAndPasswordResponse | null> = new ResponseBody<VendorLoginByEmailAndPasswordResponse | null>(
          result.message,
          data
        )
        response
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(
          new Result<null>(
            500,
                  `Refresh access token failed: ${error.message}`,
                  null
          )
        )
      })
  }
}
