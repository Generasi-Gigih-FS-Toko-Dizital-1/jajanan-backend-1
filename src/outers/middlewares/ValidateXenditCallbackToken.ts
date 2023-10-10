import { type NextFunction, type Request, type Response } from 'express'
import ResponseBody from '../../inners/models/value_objects/responses/ResponseBody'

const validateXenditCallbackToken = (): any => {
  const validate = (request: Request, response: Response, next: NextFunction): void => {
    const incomingCallbackTokenHeader = request.header('x-callback-token')
    if (incomingCallbackTokenHeader !== process.env.XENDIT_CALLBACK_TOKEN) {
      response.status(403).send(
        new ResponseBody<null>(
          'Validate token failed',
          null
        )
      )
      return
    }

    next()
  }

  return validate
}

export default validateXenditCallbackToken
