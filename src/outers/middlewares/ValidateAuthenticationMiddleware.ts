import { type NextFunction, type Request, type Response } from 'express'
import type Session from '../../inners/models/value_objects/Session'
import type Result from '../../inners/models/value_objects/Result'
import ResponseBody from '../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../inners/use_cases/authentications/AuthenticationValidation'

const validateAuthenticationMiddleware = (authenticationValidation: AuthenticationValidation): any[] => {
  const validateSession = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const session: Session = JSON.parse(request.cookies.session)
    if (session === undefined) {
      response.status(401).send(
        new ResponseBody<null>(
          'Validate authentication failed, session is undefined.',
          null
        )
      )
    }
    const validatedSession: Result<Session | null> = await authenticationValidation.validateSession(session)
    console.log(7)
    if (validatedSession.status !== 200 || validatedSession.data === null) {
      response.status(401).send(
        new ResponseBody<null>(
          validatedSession.message,
          null
        )
      )
    }
    const jwtRefreshTokenExpirationTime: string | undefined = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
    if (jwtRefreshTokenExpirationTime === undefined) {
      response.status(500).send(
        new ResponseBody<null>(
          'Validate authentication failed, JWT refresh token expiration time is undefined.',
          null
        )
      )
    }
    console.log(8)

    response
      .cookie(
        'session',
        JSON.stringify(validatedSession.data),
        {
          httpOnly: true,
          expires: validatedSession.data?.expiredAt
        }
      )
    console.log(9)

    next()
  }

  return [
    validateSession
  ]
}
export default validateAuthenticationMiddleware
