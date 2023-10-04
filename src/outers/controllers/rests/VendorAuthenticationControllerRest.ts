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

export default class VendorAuthenticationControllerRest {
  router: Router
  loginAuthentication: VendorLoginAuthentication
  registerAuthentication: VendorRegisterAuthentication

  constructor (
    router: Router,
    loginAuthentication: VendorLoginAuthentication,
    registerAuthentication: VendorRegisterAuthentication
  ) {
    this.router = router
    this.loginAuthentication = loginAuthentication
    this.registerAuthentication = registerAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/login', this.login)
    this.router.post('/register', this.registerByEmailAndPassword)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByEmailAndPassword: VendorLoginByEmailAndPasswordRequest = request.body
      this.loginAuthentication.loginByEmailAndPassword(requestToLoginByEmailAndPassword)
        .then((result: Result<Session | null>) => {
          let data: VendorLoginByEmailAndPasswordResponse | null = null
          if (result.data !== null) {
            data = new VendorLoginByEmailAndPasswordResponse(
              result.data.accessToken,
              result.data.refreshToken
            )
          }
          const responseBody: ResponseBody<VendorLoginByEmailAndPasswordResponse | null> = new ResponseBody<VendorLoginByEmailAndPasswordResponse | null>(
            result.message,
            data
          )
          const sessionString = JSON.stringify(result.data)
          response
            .cookie(
              'session',
              sessionString,
              {
                httpOnly: true,
                expires: result.data?.expiredAt
              }
            )
            .status(result.status)
            .json(responseBody)
        })
        .catch((error: Error) => {
          response.status(500).json(
            new Result<null>(
              500,
                    `Login by method ${method} failed: ${error.message}`,
                    null
            )
          )
        })
    } else {
      response.status(400).json(
        new Result<null>(
          400,
              `Login by method ${method as string} failed, unknown method.`,
              null
        )
      )
    }
  }

  registerByEmailAndPassword = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const registerByEmailAndPasswordRequest: VendorRegisterByEmailAndPasswordRequest = request.body
      this.registerAuthentication.registerByEmailAndPassword(registerByEmailAndPasswordRequest)
        .then((result: Result<Vendor | null>) => {
          let data: VendorRegisterByEmailAndPasswordResponse | null
          if (result.status === 200 && result.data !== null) {
            data = new VendorRegisterByEmailAndPasswordResponse(
              result.data.id,
              result.data.fullName,
              result.data.gender,
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
          response.status(500).json(
            new Result<null>(
              500,
                    `Register by method ${method} failed: ${error.message}`,
                    null
            )
          )
        })
    } else {
      response.status(400).json(
        new Result<null>(
          400,
              `Register by method ${method as string} failed, unknown method.`,
              null
        )
      )
    }
  }
}
