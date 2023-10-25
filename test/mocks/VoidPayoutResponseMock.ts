export default class VoidPayoutResponseMock {
  data

  constructor () {
    this.data = {
      id: '00754a09-ad00-4475-b874-1dd97f83fc24',
      external_id: 'ext-121312',
      amount: 20000,
      merchant_name: 'First Business',
      status: 'VOIDED',
      expiration_timestamp: '2019-12-12T06:45:30.041Z',
      created: '2019-12-09T06:45:28.628Z'
    }
  }
}
