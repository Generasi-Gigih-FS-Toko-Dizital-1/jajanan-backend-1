import { type Request, type Response, type Router } from 'express'
import ResponseBody from '../../../inners/models/value_objects/responses/ResponseBody'
import type AuthenticationValidation from '../../../inners/use_cases/authentications/AuthenticationValidation'
import validateAuthenticationMiddleware from '../../middlewares/ValidateAuthenticationMiddleware'
import type AdminStatistic from '../../../inners/use_cases/statistics/AdminStatistic'
import type UserStatistic from '../../../inners/use_cases/statistics/UserStatistic'
import type VendorStatistic from '../../../inners/use_cases/statistics/VendorStatistic'
import type PayoutHistoryStatistic from '../../../inners/use_cases/statistics/PayoutHistoryStatistic'
import type TopUpHistoryStatistic from '../../../inners/use_cases/statistics/TopUpHistoryStatistic'
import type TransactionHistoryStatistic from '../../../inners/use_cases/statistics/TransactionHistoryStatistic'
import StatisticCountResponse from '../../../inners/models/value_objects/responses/statistics/StatisticCountResponse'

export default class StatisticCountControllerRest {
  router: Router
  authenticationValidation: AuthenticationValidation
  adminStatistic: AdminStatistic
  userStatistic: UserStatistic
  vendorStatistic: VendorStatistic
  payoutHistoryStatistic: PayoutHistoryStatistic
  topUpHistoryStatistic: TopUpHistoryStatistic
  transactionHistoryStatistic: TransactionHistoryStatistic

  constructor (
    router: Router,
    authenticationValidation: AuthenticationValidation,
    adminStatistic: AdminStatistic,
    userStatistic: UserStatistic,
    vendorStatistic: VendorStatistic,
    payoutHistoryStatistic: PayoutHistoryStatistic,
    topUpHistoryStatistic: TopUpHistoryStatistic,
    transactionHistoryStatistic: TransactionHistoryStatistic
  ) {
    this.router = router
    this.authenticationValidation = authenticationValidation
    this.adminStatistic = adminStatistic
    this.userStatistic = userStatistic
    this.vendorStatistic = vendorStatistic
    this.payoutHistoryStatistic = payoutHistoryStatistic
    this.topUpHistoryStatistic = topUpHistoryStatistic
    this.transactionHistoryStatistic = transactionHistoryStatistic
  }

  registerRoutes = (): void => {
    this.router.use(
      validateAuthenticationMiddleware(this.authenticationValidation)
    )
    this.router.get('', this.readCount)
  }

  readCount = (request: Request, response: Response): void => {
    const { entity } = request.query

    let reader: Promise<number> = Promise.reject(new Error('Read count statistic failed, invalid entity.'))
    if (entity === 'admin') {
      reader = this.adminStatistic.count()
    } else if (entity === 'user') {
      reader = this.userStatistic.count()
    } else if (entity === 'vendor') {
      reader = this.vendorStatistic.count()
    } else if (entity === 'payout_history') {
      reader = this.payoutHistoryStatistic.count()
    } else if (entity === 'top_up_history') {
      reader = this.topUpHistoryStatistic.count()
    } else if (entity === 'transaction_history') {
      reader = this.transactionHistoryStatistic.count()
    }

    reader.then(result => {
      response.status(200).send(
        new ResponseBody(
          `Read count statistic ${entity as string} succeed.`,
          new StatisticCountResponse(result)
        )
      )
    }).catch(error => {
      response.status(500).send(error.message)
    })
  }
}
