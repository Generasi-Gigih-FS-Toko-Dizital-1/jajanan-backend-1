import chaiHttp from 'chai-http'
import chai from 'chai'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import waitUntil from 'async-wait-until'
import { server } from '../../../../src/App'
import { randomUUID } from 'crypto'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import { beforeEach } from 'mocha'
import { type User, type Vendor } from '@prisma/client'

chai.use(chaiHttp)
chai.should()

describe('WebhookControllerRest', () => {
  const oneDatastore: OneDatastore = new OneDatastore()
  let oneSeeder: OneSeeder
  let agent: ChaiHttp.Agent
  const callbackToken = process.env.XENDIT_CALLBACK_TOKEN

  before(async () => {
    await waitUntil(() => server !== undefined)
    await oneDatastore.connect()
    oneSeeder = new OneSeeder(oneDatastore)

    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    agent = chai.request.agent(server)
  })

  beforeEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneSeeder.up()
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneSeeder.down()
  })

  after(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/webhooks/top-ups', () => {
    it('should return 200 OK', async () => {
      const requestBody: any = {
        id: randomUUID(),
        external_id: oneSeeder.userMock.data[0].id,
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

      const response = await agent
        .post('/api/v1/webhooks/top-ups')
        .set('x-callback-token', String(callbackToken))
        .send(requestBody)

      response.should.have.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('user_id')
      response.body.data.should.has.property('amount')
      response.body.data.should.has.property('media')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }

      const user: User | null = await oneDatastore.client.user.findUnique({
        where: {
          id: response.body.data.user_id
        }
      })

      user?.balance.should.equal(Number(requestBody.amount) + oneSeeder.userMock.data[0].balance)

      await oneDatastore.client.topUpHistory.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
    })
  })

  describe('POST /api/v1/webhooks/payouts', () => {
    it('should return 200 OK', async () => {
      const requestBody: any = {
        id: randomUUID(),
        amount: 35000,
        status: 'COMPLETED',
        created: '2023-10-19T02:32:35.649Z',
        updated: '2023-10-19T02:32:39.014Z',
        user_id: '623d6fab71d1135c3eb173e5',
        bank_code: 'OVO',
        is_instant: true,
        external_id: oneSeeder.vendorMock.data[0].id,
        account_holder_name: 'FI** DI*****',
        disbursement_description: 'testuid'
      }

      const response = await agent
        .post('/api/v1/webhooks/payouts')
        .set('x-callback-token', String(callbackToken))
        .send(requestBody)

      response.should.have.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('vendor_id')
      response.body.data.should.has.property('xendit_payout_id')
      response.body.data.should.has.property('amount')
      response.body.data.should.has.property('media')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }

      const vendor: Vendor | null = await oneDatastore.client.vendor.findUnique({
        where: {
          id: response.body.data.vendor_id
        }
      })

      vendor?.balance.should.equal(oneSeeder.vendorMock.data[0].balance - Number(requestBody.amount))

      await oneDatastore.client.payoutHistory.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
    })
  })
})
