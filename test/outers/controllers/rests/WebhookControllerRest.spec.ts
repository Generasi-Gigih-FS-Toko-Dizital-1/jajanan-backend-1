import chaiHttp from 'chai-http'
import UserMock from '../../../mocks/UserMock'
import chai from 'chai'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import waitUntil from 'async-wait-until'
import { server } from '../../../../src/App'
import { type User } from '@prisma/client'
import { randomUUID } from 'crypto'

chai.use(chaiHttp)
chai.should()

describe('WebhookControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()
  let agent: ChaiHttp.Agent

  before(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.createMany({
      data: userMock.data
    })
  })

  after(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.topUpHistory.deleteMany({
      where: {
        userId: {
          in: userMock.data.map((user: User) => user.id)
        }
      }
    })
    await oneDatastore.client.user.deleteMany({
      where: {
        id: {
          in: userMock.data.map((user: User) => user.id)
        }
      }
    })
    await oneDatastore.disconnect()
  })

  beforeEach(async () => {
    agent = chai.request.agent(server)
  })

  describe('POST /api/v1/webhook/topup', () => {
    const paymentData = {
      id: randomUUID(),
      external_id: userMock.data[0].id,
      user_id: '5781d19b2e2385880609791c',
      is_high: true,
      payment_method: 'BANK_TRANSFER',
      status: 'PAID',
      merchant_name: 'Xendit',
      amount: 50000,
      paid_amount: 50000,
      bank_code: 'PERMATA',
      paid_at: '2016-10-12T08:15:03.404Z',
      payer_email: 'wildan@xendit.co',
      description: 'This is a description',
      adjusted_received_amount: 47500,
      fees_paid_amount: 0,
      updated: '2016-10-10T08:15:03.404Z',
      created: '2016-10-10T08:15:03.404Z',
      currency: 'IDR',
      payment_channel: 'PERMATA',
      payment_destination: '888888888888'
    }

    it('should return 200', async () => {
      const callbackToken = process.env.XENDIT_CALLBACK_TOKEN
      const res = await agent
        .post('/api/v1/webhook/topup')
        .set('x-callback-token', String(callbackToken))
        .send(paymentData)
      res.should.have.status(200)
    })
  })
})
