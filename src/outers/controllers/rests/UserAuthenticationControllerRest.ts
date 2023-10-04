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

export default class UserAuthenticationControllerRest {
  router: Router
  userLoginAuthentication: UserLoginAuthentication
  userRegisterAuthentication: UserRegisterAuthentication

  constructor (
    router: Router,
    loginAuthentication: UserLoginAuthentication,
    registerAuthentication: UserRegisterAuthentication
  ) {
    this.router = router
    this.userLoginAuthentication = loginAuthentication
    this.userRegisterAuthentication = registerAuthentication
  }

  registerRoutes = (): void => {
    this.router.post('/login', this.login)
    this.router.post('/register', this.register)
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
              result.data.accessToken,
              result.data.refreshToken
            )
          }
          const responseBody: ResponseBody<UserLoginByEmailAndPasswordResponse | null> = new ResponseBody<UserLoginByEmailAndPasswordResponse | null>(
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

  register = (request: Request, response: Response): void => {
    const { method } = request.query
    if (method === 'email_and_password') {
      const registerByEmailAndPasswordRequest: VendorRegisterByEmailAndPasswordRequest = request.body
      this.userRegisterAuthentication.registerByEmailAndPassword(registerByEmailAndPasswordRequest)
        .then((result: Result<User | null>) => {
          let data: UserRegisterByEmailAndPasswordResponse | null
          if (result.status === 200 && result.data !== null) {
            data = new UserRegisterByEmailAndPasswordResponse(
              result.data.id,
              result.data.fullName,
              result.data.gender,
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
