import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import type RegisterAuthentication from '../../../inners/use_cases/authentications/RegisterAuthentication'
import type LoginAuthentication from '../../../inners/use_cases/authentications/LoginAuthentication'
import type LoginByUsernameAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/LoginByUsernameAndPasswordRequest'
import type UserRegister
  from '../../../inners/models/value_objects/requests/authentications/RegisterUserRequest'
import { type User } from '@prisma/client'

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
    this.router.post('/registers', this.register)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'username_and_password') {
      const requestToLoginByUsernameAndPassword: LoginByUsernameAndPasswordRequest = request.body
      this.loginAuthentication.loginByUsernameAndPassword(requestToLoginByUsernameAndPassword)
        .then((result: Result<User | null>) => {
          response.status(result.status).json(result)
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

  register = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'username_and_password') {
      const requestToRegisterByUsernameAndPassword: UserRegister = request.body
      this.registerAuthentication.registerByUsernameAndPassword(requestToRegisterByUsernameAndPassword)
        .then((result: Result<User | null>) => {
          response.status(result.status).json(result)
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
