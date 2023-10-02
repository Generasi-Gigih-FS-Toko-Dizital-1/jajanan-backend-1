import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import type VendorLoginAuthentication from '../../../inners/use_cases/authentications/vendors/VendorLoginAuthentication'
import type VendorRegisterByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { type Admin } from '@prisma/client'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import AdminLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminLoginByEmailAndPasswordResponse'
import type VendorLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import type RegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminRegisterByEmailAndPasswordResponse'
import AdminRegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminRegisterByEmailAndPasswordResponse'
import type AdminLoginAuthentication from '../../../inners/use_cases/authentications/admins/AdminLoginAuthentication'
import type AdminRegisterAuthentication from '../../../inners/use_cases/authentications/admins/AdminRegisterAuthentication'

export default class AdminAuthenticationControllerRest {
  router: Router
  loginAuthentication: AdminLoginAuthentication
  registerAuthentication: AdminRegisterAuthentication

  constructor (
    router: Router,
    loginAuthentication: AdminLoginAuthentication,
    registerAuthentication: AdminRegisterAuthentication
  ) {
    this.router = router
    this.loginAuthentication = loginAuthentication
    this.registerAuthentication = registerAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/logins', this.login)
    this.router.post('/registers', this.registerByEmailAndPassword)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByAdminnameAndPassword: VendorLoginByEmailAndPasswordRequest = request.body
      this.loginAuthentication.loginByEmailAndPassword(requestToLoginByAdminnameAndPassword)
        .then((result: Result<string | null>) => {
          const data: AdminLoginByEmailAndPasswordResponse = new AdminLoginByEmailAndPasswordResponse(
            result.data
          )
          const responseBody: ResponseBody<AdminLoginByEmailAndPasswordResponse> = new ResponseBody<AdminLoginByEmailAndPasswordResponse>(
            result.message,
            data
          )
          response.status(result.status).json(responseBody)
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
        .then((result: Result<Admin | null>) => {
          let data: AdminRegisterByEmailAndPasswordResponse | null
          if (result.status === 200 && result.data !== null) {
            data = new AdminRegisterByEmailAndPasswordResponse(
              result.data.id,
              result.data.fullName,
              result.data.gender,
              result.data.email,
              result.data.password,
              result.data.createdAt,
              result.data.updatedAt
            )
          } else {
            data = result.data
          }
          const responseBody: ResponseBody<RegisterByEmailAndPasswordResponse | null> = new ResponseBody<RegisterByEmailAndPasswordResponse | null>(
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
