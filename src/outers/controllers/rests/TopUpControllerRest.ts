import { type Response, type Request, type Router } from 'express'
import type TopUp from '../../../inners/use_cases/top_up/TopUp'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'

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
      .then((result) => {
        res.status(result.status).json({
          message: result.message,
          data: {
            redirectUrl: result.data
          }
        })
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
