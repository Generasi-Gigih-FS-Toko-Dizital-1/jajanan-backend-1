import { type Request, type Response, type Router } from 'express'
import type TopUpWebhook from '../../../inners/use_cases/top_ups/TopUpWebhook'
import validateXenditCallbackToken from '../../middlewares/ValidateXenditCallbackToken'
import { type PayoutHistory, type TopUpHistory } from '@prisma/client'
import type Result from '../../../inners/models/value_objects/Result'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type PayoutWebhook from '../../../inners/use_cases/payouts/PayoutWebhook'

export default class WebhookControllerRest {
  router: Router
  topUpWebhookUseCase: TopUpWebhook
  payoutWebhookUseCase: PayoutWebhook

  constructor (router: Router, topUpWebhookUseCase: TopUpWebhook, payoutWebhookUseCase: PayoutWebhook) {
    this.router = router
    this.topUpWebhookUseCase = topUpWebhookUseCase
    this.payoutWebhookUseCase = payoutWebhookUseCase
  }

  registerRoutes = (): void => {
    this.router.use(validateXenditCallbackToken)
    this.router.post('/top-ups', this.handleTopUpCallback)
    this.router.post('/payouts', this.handlePayoutCallback)
  }

  handleTopUpCallback = (req: Request, res: Response): void => {
    console.log(req.body)
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

  handlePayoutCallback = (req: Request, res: Response): void => {
    console.log(req.body)
    const { status } = req.body
    if (status !== 'COMPLETED') {
      res.status(200).send('notification processed')
      return
    }

    this.payoutWebhookUseCase
      .execute(req.body)
      .then((result: Result<PayoutHistory | null>) => {
        let data: PayoutHistory | null
        if (result.status === 200 && result.data !== null) {
          data = result.data
        } else {
          data = null
        }
        const responseBody: ResponseBody<PayoutHistory | null> = new ResponseBody<PayoutHistory | null>(
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
