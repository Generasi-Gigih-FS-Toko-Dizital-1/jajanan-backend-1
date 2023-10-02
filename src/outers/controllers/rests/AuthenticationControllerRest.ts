import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import type RegisterAuthentication from '../../../inners/use_cases/authentications/RegisterAuthentication'
import type LoginAuthentication from '../../../inners/use_cases/authentications/LoginAuthentication'
import type RegisterByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/RegisterByEmailAndPasswordRequest'
import { type User } from '@prisma/client'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import LoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/LoginByEmailAndPasswordResponse'
import type LoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/LoginByEmailAndPasswordRequest'
import RegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/RegisterByEmailAndPasswordResponse'

export default class AuthenticationControllerRest {
  router: Router
  loginAuthentication: LoginAuthentication
  registerAuthentication: RegisterAuthentication

  constructor (
    router: Router,
    loginAuthentication: LoginAuthentication,
    registerAuthentication: RegisterAuthentication
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
      const requestToLoginByUsernameAndPassword: LoginByEmailAndPasswordRequest = request.body
      this.loginAuthentication.loginByEmailAndPassword(requestToLoginByUsernameAndPassword)
        .then((result: Result<string | null>) => {
          const data: LoginByEmailAndPasswordResponse = new LoginByEmailAndPasswordResponse(
            result.data
          )
          const responseBody: ResponseBody<LoginByEmailAndPasswordResponse> = new ResponseBody<LoginByEmailAndPasswordResponse>(
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
      const registerByEmailAndPasswordRequest: RegisterByEmailAndPasswordRequest = request.body
      this.registerAuthentication.registerByEmailAndPassword(registerByEmailAndPasswordRequest)
        .then((result: Result<User | null>) => {
          let data: RegisterByEmailAndPasswordResponse | null
          if (result.status === 200 && result.data !== null) {
            data = new RegisterByEmailAndPasswordResponse(
              result.data.id,
              result.data.fullName,
              result.data.gender,
              result.data.username,
              result.data.email,
              result.data.balance,
              result.data.experience,
              result.data.lastLatitude,
              result.data.lastLongitude
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
