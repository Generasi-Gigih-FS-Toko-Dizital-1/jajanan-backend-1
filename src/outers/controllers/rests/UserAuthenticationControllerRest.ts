import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import type VendorLoginAuthentication from '../../../inners/use_cases/authentications/vendors/VendorLoginAuthentication'
import type VendorRegisterByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { type User } from '@prisma/client'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import UserLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/users/UserLoginByEmailAndPasswordResponse'
import type VendorLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import type RegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/users/UserRegisterByEmailAndPasswordResponse'
import UserRegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/users/UserRegisterByEmailAndPasswordResponse'
import type UserLoginAuthentication from '../../../inners/use_cases/authentications/users/UserLoginAuthentication'
import type UserRegisterAuthentication from '../../../inners/use_cases/authentications/users/UserRegisterAuthentication'

export default class UserAuthenticationControllerRest {
  router: Router
  loginAuthentication: UserLoginAuthentication
  registerAuthentication: UserRegisterAuthentication

  constructor (
    router: Router,
    loginAuthentication: UserLoginAuthentication,
    registerAuthentication: UserRegisterAuthentication
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
      const requestToLoginByUsernameAndPassword: VendorLoginByEmailAndPasswordRequest = request.body
      this.loginAuthentication.loginByEmailAndPassword(requestToLoginByUsernameAndPassword)
        .then((result: Result<string | null>) => {
          const data: UserLoginByEmailAndPasswordResponse = new UserLoginByEmailAndPasswordResponse(
            result.data
          )
          const responseBody: ResponseBody<UserLoginByEmailAndPasswordResponse> = new ResponseBody<UserLoginByEmailAndPasswordResponse>(
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
        .then((result: Result<User | null>) => {
          let data: UserRegisterByEmailAndPasswordResponse | null
          if (result.status === 200 && result.data !== null) {
            data = new UserRegisterByEmailAndPasswordResponse(
              result.data.id,
              result.data.fullName,
              result.data.gender,
              result.data.username,
              result.data.email,
              result.data.password,
              result.data.balance,
              result.data.experience,
              result.data.lastLatitude,
              result.data.lastLongitude,
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
