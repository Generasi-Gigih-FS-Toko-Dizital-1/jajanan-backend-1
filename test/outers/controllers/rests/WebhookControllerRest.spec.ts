import chaiHttp from 'chai-http'
import UserMock from '../../../mocks/UserMock'
import chai from 'chai'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import waitUntil from 'async-wait-until'
import { server } from '../../../../src/App'
import { type Admin, type User } from '@prisma/client'
import { randomUUID } from 'crypto'
import AdminMock from '../../../mocks/AdminMock'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import { beforeEach } from 'mocha'

chai.use(chaiHttp)
chai.should()

describe('WebhookControllerRest', () => {
  const oneDatastore: OneDatastore = new OneDatastore()
  const authAdminMock: AdminMock = new AdminMock()
  let oneSeeder: OneSeeder
  let agent: ChaiHttp.Agent
  let authorization: Authorization

  before(async () => {
    await waitUntil(() => server !== undefined)
    await oneDatastore.connect()
    oneSeeder = new OneSeeder(oneDatastore)

    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.admin.createMany({
      data: authAdminMock.data
    })

    agent = chai.request.agent(server)
    const requestAuthAdmin: Admin = authAdminMock.data[0]
    const requestBodyLogin: AdminLoginByEmailAndPasswordRequest = new AdminLoginByEmailAndPasswordRequest(
      requestAuthAdmin.email,
      requestAuthAdmin.password
    )
    const response = await agent
      .post('/api/v1/authentications/admins/login?method=email_and_password')
      .send(requestBodyLogin)

    response.should.has.status(200)
    response.body.should.be.an('object')
    response.body.should.has.property('message')
    response.body.should.has.property('data')
    response.body.data.should.has.property('session')
    response.body.data.session.should.be.an('object')
    response.body.data.session.should.has.property('account_id').equal(requestAuthAdmin.id)
    response.body.data.session.should.has.property('account_type').equal('ADMIN')
    response.body.data.session.should.has.property('access_token')
    response.body.data.session.should.has.property('refresh_token')
    response.body.data.session.should.has.property('expired_at')

    authorization = new Authorization(
      response.body.data.session.access_token,
      'Bearer'
    )
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
    await oneDatastore.client.admin.deleteMany(
      {
        where: {
          id: {
            in: authAdminMock.data.map((admin: Admin) => admin.id)
          }
        }
      }
    )
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

      const callbackToken = process.env.XENDIT_CALLBACK_TOKEN
      const response = await agent
        .post('/api/v1/webhooks/top-ups')
        .set('x-callback-token', String(callbackToken))
        .set('Authorization', authorization.convertToString())
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
      await oneDatastore.client.topUpHistory.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
    })
  })
})
