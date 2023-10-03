import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import AdminLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminLoginByEmailAndPasswordResponse'
import type AdminLoginAuthentication from '../../../inners/use_cases/authentications/admins/AdminLoginAuthentication'

import type AdminLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import type Session from '../../../inners/models/value_objects/Session'

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
    this.router.post('/login', this.login)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByEmailAndPassword: AdminLoginByEmailAndPasswordRequest = request.body
      this.loginAuthentication.loginByEmailAndPassword(requestToLoginByEmailAndPassword)
        .then((result: Result<Session | null>) => {
          let data: AdminLoginByEmailAndPasswordResponse | null = null
          if (result.data !== null) {
            data = new AdminLoginByEmailAndPasswordResponse(
              result.data.accessToken,
              result.data.refreshToken
            )
          }
          const responseBody: ResponseBody<AdminLoginByEmailAndPasswordResponse | null> = new ResponseBody<AdminLoginByEmailAndPasswordResponse | null>(
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
}
