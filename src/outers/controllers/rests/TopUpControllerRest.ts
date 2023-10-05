import { type Response, type Request, type Router } from 'express'
import type TopUp from '../../../inners/use_cases/top_up/TopUp'

export default class TopUpControllerRest {
  router: Router
  topUp: TopUp
  constructor (router: Router, topUp: TopUp) {
    this.router = router
    this.topUp = topUp
  }

  registerRoutes = (): void => {
    this.router.post('', this.generateTopUp)
  }

  generateTopUp = async (req: Request, res: Response): void => {
    await this.topUp
      .generateTopUpUrl(req.body)
      .then((result) => {
        res.status(result.status).send(result.data)
      })
      .catch((error) => {
        res.status(500).send(error.message)
      })
  }
}
