import { type NextFunction, type Request, type Response } from 'express'
import type Session from '../../inners/models/value_objects/Session'
import type Result from '../../inners/models/value_objects/Result'
import ResponseBody from '../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../inners/use_cases/authentications/AuthenticationValidation'
import Authorization from '../../inners/models/value_objects/Authorization'

const validateAuthenticationMiddleware = (authenticationValidation: AuthenticationValidation): any[] => {
  const validateSession = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    if (request.headers.authorization === undefined) {
      response.status(401).send(
        new ResponseBody<null>(
          'Validate authentication failed, authorization is undefined.',
          null
        )
      )
      return
    }

    const authorization: Authorization = Authorization.convertFromString(request.headers.authorization)
    const validatedSession: Result<Session | null> = await authenticationValidation.validateAuthorization(authorization)
    if (validatedSession.status !== 200 || validatedSession.data === null) {
      response.status(validatedSession.status).send(
        new ResponseBody<null>(
          validatedSession.message,
          null
        )
      )
      return
    }

    next()
  }

  return [
    validateSession
  ]
}
export default validateAuthenticationMiddleware
