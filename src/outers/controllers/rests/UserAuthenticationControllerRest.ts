import { type Request, type Response, type Router } from 'express'

import Result from '../../../inners/models/value_objects/Result'
import type VendorRegisterByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { type User } from '@prisma/client'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import UserLoginByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/users/UserLoginByEmailAndPasswordResponse'
import UserRegisterByEmailAndPasswordResponse
  from '../../../inners/models/value_objects/responses/authentications/users/UserRegisterByEmailAndPasswordResponse'
import type UserLoginAuthentication from '../../../inners/use_cases/authentications/users/UserLoginAuthentication'
import type UserRegisterAuthentication from '../../../inners/use_cases/authentications/users/UserRegisterAuthentication'
import type UserLoginByEmailAndPasswordRequest
  from '../../../inners/models/value_objects/requests/authentications/users/UserLoginByEmailAndPasswordRequest'

import type Session from '../../../inners/models/value_objects/Session'
import type UserRefreshAccessTokenRequest
  from '../../../inners/models/value_objects/requests/authentications/users/UserRefreshAccessTokenRequest'

import type UserRefreshAuthentication from '../../../inners/use_cases/authentications/users/UserRefreshAuthentication'
import type UserLogoutAuthentication from '../../../inners/use_cases/authentications/users/UserLogoutAuthentication'

import UserRefreshAccessTokenResponse
  from '../../../inners/models/value_objects/responses/authentications/users/UserRefreshAccessTokenResponse'
import type UserLogoutRequest
  from '../../../inners/models/value_objects/requests/authentications/users/UserLogoutRequest'

export default class UserAuthenticationControllerRest {
  router: Router
  userLoginAuthentication: UserLoginAuthentication
  userRegisterAuthentication: UserRegisterAuthentication
  userRefreshAuthentication: UserRefreshAuthentication
  userLogoutAuthentication: UserLogoutAuthentication

  constructor (
    router: Router,
    loginAuthentication: UserLoginAuthentication,
    registerAuthentication: UserRegisterAuthentication,
    userAuthenticationRefresh: UserRefreshAuthentication,
    userLogoutAuthentication: UserLogoutAuthentication
  ) {
    this.router = router
    this.userLoginAuthentication = loginAuthentication
    this.userRegisterAuthentication = registerAuthentication
    this.userRefreshAuthentication = userAuthenticationRefresh
    this.userLogoutAuthentication = userLogoutAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
    this.router.post('/refreshes/access-token', this.refreshAccessToken)
    this.router.post('/logout', this.logout)
  }

  login = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const requestToLoginByEmailAndPassword: UserLoginByEmailAndPasswordRequest = request.body
      this.userLoginAuthentication.loginByEmailAndPassword(requestToLoginByEmailAndPassword)
        .then((result: Result<Session | null>) => {
          let data: UserLoginByEmailAndPasswordResponse | null = null
          if (result.data !== null) {
            data = new UserLoginByEmailAndPasswordResponse(
              result.data
            )
          }
          const responseBody: ResponseBody<UserLoginByEmailAndPasswordResponse | null> = new ResponseBody<UserLoginByEmailAndPasswordResponse | null>(
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
      this.userRegisterAuthentication.registerByEmailAndPassword(registerByEmailAndPasswordRequest)
        .then((result: Result<User | null>) => {
          let data: UserRegisterByEmailAndPasswordResponse | null
          if (result.status === 201 && result.data !== null) {
            data = new UserRegisterByEmailAndPasswordResponse(
              result.data.id,
              result.data.fullName,
              result.data.gender,
              result.data.address,
              result.data.username,
              result.data.email,
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
          const responseBody: ResponseBody<UserRegisterByEmailAndPasswordResponse | null> = new ResponseBody<UserRegisterByEmailAndPasswordResponse | null>(
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
    const requestToRefreshAccessToken: UserRefreshAccessTokenRequest = request.body
    this.userRefreshAuthentication.refreshAccessToken(requestToRefreshAccessToken)
      .then((result: Result<Session | null>) => {
        let data: UserRefreshAccessTokenResponse | null = null
        if (result.data !== null) {
          data = new UserRefreshAccessTokenResponse(
            result.data
          )
        }
        const responseBody: ResponseBody<UserRefreshAccessTokenResponse | null> = new ResponseBody<UserRefreshAccessTokenResponse | null>(
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
                        `User refresh access token failed: ${error.message}`,
                        null
          )
        )
      })
  }

  logout = (request: Request, response: Response): void => {
    const requestToRefreshAccessToken: UserLogoutRequest = request.body
    this.userLogoutAuthentication.logout(requestToRefreshAccessToken)
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
                        `User logout failed: ${error.message}`,
                        null
          )
        )
      })
  }
}
