import midtransClient from 'midtrans-client'

export default class Midtrans {
  snap

  constructor () {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })
  }
}
