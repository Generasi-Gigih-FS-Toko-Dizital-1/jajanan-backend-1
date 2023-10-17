import { type Request, type Response, type Router } from 'express'
import type Payout from '../../../inners/use_cases/payouts/Payout'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import type Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'

export default class PayoutControllerRest {
  router: Router
  payout: Payout
  authenticationValidation: AuthenticationValidation

  constructor (router: Router, payout: Payout, authenticationValidation: AuthenticationValidation) {
    this.router = router
    this.payout = payout
    this.authenticationValidation = authenticationValidation
  }

  registerRoutes = (): void => {
    this.router.use(validateAuthenticationMiddleware(this.authenticationValidation))
    this.router.post('', this.generatePayout)
  }

  generatePayout = (req: Request, res: Response): void => {
    this.payout
      .generatePayoutUrl(req.body)
      .then((result: Result<string | null>) => {
        let data: string | null = null
        if (result.status === 201 && result.data !== null) {
          data = result.data
        } else {
          data = null
        }
        const responseBody: ResponseBody<any | null> = new ResponseBody<string | null>(result.message, data)
        res.status(result.status).json(responseBody)
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
