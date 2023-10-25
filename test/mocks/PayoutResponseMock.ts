export default class PayoutResponseMock {
  data

  constructor () {
    this.data = {
      id: '67f1b30c-0262-4955-8777-95aa0478c2fc',
      external_id: 'demo_2392329329',
      amount: 23000,
      merchant_name: 'First Business',
      status: 'PENDING',
      expiration_timestamp: '2019-12-12T06:13:21.637Z',
      created: '2019-12-09T06:13:20.363Z',
      payout_url: 'https://payout.xendit.co/web/67f1b30c-0262-4955-8777-95aa0478c2fc'
    }
  }
}
