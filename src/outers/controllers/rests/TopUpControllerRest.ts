import { type Response, type Request, type Router } from 'express'
import type TopUp from '../../../inners/use_cases/top_ups/TopUp'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import TopUpCreateRequest from '../../../inners/models/value_objects/requests/top_ups/TopUpCreateRequest'
import TopUpCreateResponse from '../../../inners/models/value_objects/responses/top_ups/TopUpCreateResponse'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type Result from '../../../inners/models/value_objects/Result'

export default class TopUpControllerRest {
  router: Router
  topUp: TopUp
  authenticationValidation: AuthenticationValidation
  constructor (router: Router, topUp: TopUp, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.topUp = topUp
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('', this.generateTopUp)
  }

  generateTopUp = (req: Request, res: Response): void => {
    this.topUp
      .generateTopUpUrl(req.body)
      .then((result: Result<string | null>) => {
        let data: TopUpCreateResponse | null = null
        if (result.status === 201 && result.data !== null) {
          data = new TopUpCreateResponse(result.data)
        } else {
          data = null
        }
        const responseBody: ResponseBody<TopUpCreateResponse | null> = new ResponseBody<TopUpCreateResponse | null>(
          result.message,
          data
        )
        res.status(result.status).json(responseBody)
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
