import { type Response, type Request, type Router } from 'express'
import type TopUpWebhook from '../../../inners/use_cases/top_up/TopUpWebhook'
import validateXenditCallbackToken from '../../middlewares/ValidateXenditCallbackToken'

export default class WebhookControllerRest {
  router: Router
  topUpWebhookUseCase: TopUpWebhook

  constructor (router: Router, topUpWebhookUseCase: TopUpWebhook) {
    this.router = router
    this.topUpWebhookUseCase = topUpWebhookUseCase
  }

  registerRoutes = (): void => {
    this.router.use(validateXenditCallbackToken)
    this.router.post('/topup', this.handleTopUpCallback)
  }

  handleTopUpCallback = (req: Request, res: Response): void => {
    const { status } = req.body
    console.log(req.body)
    if (status !== 'PAID') {
      res.status(200).send('notification processed')
      return
    }
    this.topUpWebhookUseCase
      .execute(req.body)
      .then((result) => {
        if (result.data == null) {
          res.status(result.status).json({
            message: result.message
          })

          return
        }
        res.status(result.status).json({
          message: result.message,
          data: result.data
        })
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
