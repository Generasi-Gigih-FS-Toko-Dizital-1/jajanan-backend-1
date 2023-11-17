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
    const { entity, where } = request.query

    const whereInput: any =
        where === undefined
          ? {}
          : JSON.parse(decodeURIComponent(where as string))

    let reader: Promise<number> | undefined

    if (entity === 'admin') {
      reader = this.adminStatistic.count(whereInput)
    } else if (entity === 'user') {
      reader = this.userStatistic.count(whereInput)
    } else if (entity === 'vendor') {
      reader = this.vendorStatistic.count(whereInput)
    } else if (entity === 'payout_history') {
      reader = this.payoutHistoryStatistic.count(whereInput)
    } else if (entity === 'top_up_history') {
      reader = this.topUpHistoryStatistic.count(whereInput)
    } else if (entity === 'transaction_history') {
      reader = this.transactionHistoryStatistic.count(whereInput)
    }

    if (reader === undefined) {
      const responseBody: ResponseBody<null> = new ResponseBody<null>(
        'Query parameter entity is invalid.',
        null
      )
      response.status(400).send(responseBody)
      return
    }

    reader.then((result: number) => {
      const responseBody: ResponseBody<StatisticCountResponse> = new ResponseBody<StatisticCountResponse>(
            `Read count statistic ${entity as string} succeed.`,
            new StatisticCountResponse(result)
      )
      response.status(200).send(responseBody)
    }).catch((error: Error) => {
      response.status(500).send(error.message)
    })
  }
}
