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
import type AdminLogoutAuthentication from '../../../inners/use_cases/authentications/admins/AdminLogoutAuthentication'
import type AdminLogoutRequest
  from '../../../inners/models/value_objects/requests/authentications/admins/AdminLogoutRequest'
import AdminRefreshAccessTokenResponse
  from '../../../inners/models/value_objects/responses/authentications/admins/AdminRefreshAccessTokenResponse'

export default class AdminAuthenticationControllerRest {
  router: Router
  adminLoginAuthentication: AdminLoginAuthentication
  adminRefreshAuthentication: AdminRefreshAuthentication
  adminLogoutAuthentication: AdminLogoutAuthentication

  constructor (
    router: Router,
    loginAuthentication: AdminLoginAuthentication,
    adminRefreshAuthentication: AdminRefreshAuthentication,
    adminLogoutAuthentication: AdminLogoutAuthentication
  ) {
    this.router = router
    this.adminLoginAuthentication = loginAuthentication
    this.adminRefreshAuthentication = adminRefreshAuthentication
    this.adminLogoutAuthentication = adminLogoutAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/login', this.login)
    this.router.post('/refreshes/access-token', this.refreshAccessToken)
    this.router.post('/logout', this.logout)
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
        let data: AdminRefreshAccessTokenResponse | null = null
        if (result.data !== null) {
          data = new AdminRefreshAccessTokenResponse(
            result.data
          )
        }
        const responseBody: ResponseBody<AdminRefreshAccessTokenResponse | null> = new ResponseBody<AdminRefreshAccessTokenResponse | null>(
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
                        `Admin refresh access token failed: ${error.message}`,
                        null
          )
        )
      })
  }

  logout = (request: Request, response: Response): void => {
    const requestToRefreshAccessToken: AdminLogoutRequest = request.body
    this.adminLogoutAuthentication.logout(requestToRefreshAccessToken)
      .then((result: Result<Session | null>) => {
        const responseBody: ResponseBody<null> = new ResponseBody<null>(
          result.message,
          null
        )
        response
          .status(result.status)
          .send(responseBody)
      })
      .catch((error: Error) => {
        response.status(500).send(
          new Result<null>(
            500,
                        `Admin logout failed: ${error.message}`,
                        null
          )
        )
      })
  }
}
