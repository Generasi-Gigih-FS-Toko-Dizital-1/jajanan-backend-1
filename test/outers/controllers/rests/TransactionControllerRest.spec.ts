import chai from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import { type Admin, type JajanItem, type User } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import TransactionItemCheckoutRequest
  from '../../../../src/inners/models/value_objects/requests/transactions/TransactionItemCheckoutRequest'
import TransactionCheckoutRequest
  from '../../../../src/inners/models/value_objects/requests/transactions/TransactionCheckoutRequest'

chai.use(chaiHttp)
chai.should()

describe('TransactionHistoryControllerRest', () => {
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

  describe('POST /api/v1/transactions/checkout', () => {
    it('should return 201 CREATED', async () => {
      const requestTransactionItem: TransactionItemCheckoutRequest[] = oneSeeder.jajanItemMock.data.map((jajanItem: JajanItem) => {
        return new TransactionItemCheckoutRequest(
          jajanItem.id,
          1
        )
      })

      const requestUser: User = oneSeeder.userMock.data[0]

      const requestBody: TransactionCheckoutRequest = new TransactionCheckoutRequest(
        requestUser.id,
        requestTransactionItem,
        'BALANCE',
        0,
        0
      )

      const response = await agent
        .post('/api/v1/transactions/checkout')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('transaction_id')
      response.body.data.should.has.property('user_id')
      response.body.data.should.has.property('transaction_items').an('array').lengthOf(2)
      response.body.data.should.has.property('payment_method')
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
      response.body.data.transaction_items.forEach((transactionItem: any) => {
        transactionItem.should.has.property('jajan_item_snapshot_id')
        transactionItem.should.has.property('quantity')
      })

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }
      await oneDatastore.client.transactionHistory.deleteMany({
        where: {
          id: response.body.data.transaction_id
        }
      })
      await oneDatastore.client.jajanItemSnapshot.deleteMany({
        where: {
          id: {
            in: response.body.data.transaction_items.map((transactionItem: any) => transactionItem.jajan_item_snapshot_id)
          }
        }
      })
    })
  })
})
