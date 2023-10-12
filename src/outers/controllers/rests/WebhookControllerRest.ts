import { type Response, type Request, type Router } from 'express'
import type TopUpWebhook from '../../../inners/use_cases/top_ups/TopUpWebhook'
import validateXenditCallbackToken from '../../middlewares/ValidateXenditCallbackToken'
import { type TopUpHistory } from '@prisma/client'
import type Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'

export default class WebhookControllerRest {
  router: Router
  topUpWebhookUseCase: TopUpWebhook

  constructor (router: Router, topUpWebhookUseCase: TopUpWebhook) {
    this.router = router
    this.topUpWebhookUseCase = topUpWebhookUseCase
  }

  registerRoutes = (): void => {
    this.router.use(validateXenditCallbackToken)
    this.router.post('/top-ups', this.handleTopUpCallback)
  }

  handleTopUpCallback = (req: Request, res: Response): void => {
    const { status } = req.body
    if (status !== 'PAID') {
      res.status(200).send('notification processed')
      return
    }
    this.topUpWebhookUseCase
      .execute(req.body)
      .then((result: Result<TopUpHistory | null>) => {
        let data: TopUpHistory | null
        if (result.status === 200 && result.data !== null) {
          data = result.data
        } else {
          data = null
        }
        const responseBody: ResponseBody<TopUpHistory | null> = new ResponseBody<TopUpHistory | null>(
          result.message,
          data
        )
        res.status(result.status).send(responseBody)
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
