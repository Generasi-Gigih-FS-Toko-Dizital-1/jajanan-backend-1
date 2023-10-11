import { type NextFunction, type Request, type Response } from 'express'
import ResponseBody from '../../inners/models/value_objects/responses/ResponseBody'

const validateXenditCallbackToken = (request: Request, response: Response, next: NextFunction): any => {
  const incomingCallbackTokenHeader = request.header('x-callback-token')
  if (incomingCallbackTokenHeader !== process.env.XENDIT_CALLBACK_TOKEN) {
    response.status(403).send(
      new ResponseBody<null>(
        'xendit callback token is invalid',
        null
      )
    )
    return
  }

  next()
}

export default validateXenditCallbackToken
