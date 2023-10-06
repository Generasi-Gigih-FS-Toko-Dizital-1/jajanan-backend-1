import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import AdminLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminLoginByEmailAndPasswordResponse'
import type AdminLoginAuthentication from '../../../inners/use_cases/authentications/admins/AdminLoginAuthentication'

import type AdminLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import type Session from '../../../inners/models/value_objects/Session'
import type AdminRefreshAuthentication
  from '../../../inners/use_cases/authentications/admins/AdminRefreshAuthentication'
import type AdminRefreshAccessTokenRequest
  from '../../../inners/models/value_objects/requests/authentications/admins/AdminRefreshAccessTokenRequest'

export default class AdminAuthenticationControllerRest {
  router: Router
  adminLoginAuthentication: AdminLoginAuthentication
  adminRefreshAuthentication: AdminRefreshAuthentication

  constructor (
    router: Router,
    loginAuthentication: AdminLoginAuthentication,
    adminRefreshAuthentication: AdminRefreshAuthentication
  ) {
    this.router = router
    this.adminLoginAuthentication = loginAuthentication
    this.adminRefreshAuthentication = adminRefreshAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/login', this.login)
    this.router.post('/refreshes/access-token', this.refreshAccessToken)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByEmailAndPassword: AdminLoginByEmailAndPasswordRequest = request.body
      this.adminLoginAuthentication.loginByEmailAndPassword(requestToLoginByEmailAndPassword)
        .then((result: Result<Session | null>) => {
          let data: AdminLoginByEmailAndPasswordResponse | null = null
          if (result.data !== null) {
            data = new AdminLoginByEmailAndPasswordResponse(
              result.data
            )
          }
          const responseBody: ResponseBody<AdminLoginByEmailAndPasswordResponse | null> = new ResponseBody<AdminLoginByEmailAndPasswordResponse | null>(
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

  refreshAccessToken = (request: Request, response: Response): void => {
    const requestToRefreshAccessToken: AdminRefreshAccessTokenRequest = request.body
    this.adminRefreshAuthentication.refreshAccessToken(requestToRefreshAccessToken)
      .then((result: Result<Session | null>) => {
        let data: AdminLoginByEmailAndPasswordResponse | null = null
        if (result.data !== null) {
          data = new AdminLoginByEmailAndPasswordResponse(
            result.data
          )
        }
        const responseBody: ResponseBody<AdminLoginByEmailAndPasswordResponse | null> = new ResponseBody<AdminLoginByEmailAndPasswordResponse | null>(
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
