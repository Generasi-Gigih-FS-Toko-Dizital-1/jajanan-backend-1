import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import AdminLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminLoginByEmailAndPasswordResponse'
import type AdminLoginAuthentication from '../../../inners/use_cases/authentications/admins/AdminLoginAuthentication'

import type AdminLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'

export default class AdminAuthenticationControllerRest {
  router: Router
  loginAuthentication: AdminLoginAuthentication

  constructor (
    router: Router,
    loginAuthentication: AdminLoginAuthentication
  ) {
    this.router = router
    this.loginAuthentication = loginAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/logins', this.login)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByEmailAndPassword: AdminLoginByEmailAndPasswordRequest = request.body
      this.loginAuthentication.loginByEmailAndPassword(requestToLoginByEmailAndPassword)
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
}
