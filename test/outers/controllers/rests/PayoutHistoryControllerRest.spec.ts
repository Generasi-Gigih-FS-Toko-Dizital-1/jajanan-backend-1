import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { server } from '../../../../src/App'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import AdminMock from '../../../mocks/AdminMock'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import waitUntil from 'async-wait-until'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import { type Admin, type PayoutHistory, type Prisma, type Vendor } from '@prisma/client'
import humps from 'humps'
import PayoutHistoryManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/payout_history_managements/PayoutHistoryManagementCreateRequest'
import PayoutHistoryManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/payout_history_managements/PayoutHistoryManagementPatchRequest'

chai.use(chaiHttp)
chai.should()

describe('PayoutHistoryControllerRest', () => {
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
      'password0'
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

  describe('GET /api/v1/payout-histories?page_number={}&page_size={}&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestPayoutHistory: PayoutHistory = oneSeeder.payoutHistoryMock.data[0]
      const requestVendor: Vendor = oneSeeder.vendorMock.data[0]
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.payoutHistoryMock.data.length
      const whereInput: any = {
        id: requestPayoutHistory.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        vendor: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))

      const response = await agent
        .get(`/api/v1/payout-histories?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_payout_history')
      response.body.data.should.has.property('payout_histories')
      response.body.data.payout_histories.should.be.an('array')
      response.body.data.payout_histories.length.should.be.equal(1)
      response.body.data.payout_histories[0].should.be.an('object')
      response.body.data.payout_histories[0].should.has.property('id').equal(requestPayoutHistory.id)
      response.body.data.payout_histories[0].should.has.property('vendor_id').equal(requestPayoutHistory.vendorId)
      response.body.data.payout_histories[0].should.has.property('xendit_payout_id').equal(requestPayoutHistory.xenditPayoutId)
      response.body.data.payout_histories[0].should.has.property('amount').equal(requestPayoutHistory.amount)
      response.body.data.payout_histories[0].should.has.property('created_at').equal(requestPayoutHistory.createdAt.toISOString())
      response.body.data.payout_histories[0].should.has.property('updated_at').equal(requestPayoutHistory.updatedAt.toISOString())
      response.body.data.payout_histories[0].should.has.property('deleted_at')
      response.body.data.payout_histories[0].should.has.property('vendor').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestVendor))))
    })
  })

  describe('GET /api/v1/payout-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestPayoutHistory: PayoutHistory = oneSeeder.payoutHistoryMock.data[0]

      const response = await agent
        .get(`/api/v1/payout-histories/${requestPayoutHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('id').equal(requestPayoutHistory.id)
      response.body.data.should.has.property('vendor_id').equal(requestPayoutHistory.vendorId)
      response.body.data.should.has.property('xendit_payout_id').equal(requestPayoutHistory.xenditPayoutId)
      response.body.data.should.has.property('amount').equal(requestPayoutHistory.amount)
      response.body.data.should.has.property('created_at').equal(requestPayoutHistory.createdAt.toISOString())
      response.body.data.should.has.property('updated_at').equal(requestPayoutHistory.updatedAt.toISOString())
      response.body.data.should.has.property('deleted_at').equal(null)
    })
  })

  describe('POST /api/v1/payout-histories', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: PayoutHistoryManagementCreateRequest = new PayoutHistoryManagementCreateRequest(
        oneSeeder.vendorMock.data[0].id,
        oneSeeder.payoutHistoryMock.data[0].amount,
        oneSeeder.payoutHistoryMock.data[0].media,
        oneSeeder.payoutHistoryMock.data[0].xenditPayoutId
      )

      const response = await agent
        .post('/api/v1/payout-histories')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('vendor_id').equal(requestBody.vendorId)
      response.body.data.should.has.property('amount').equal(requestBody.amount)
      response.body.data.should.has.property('xendit_payout_id').equal(requestBody.xenditPayoutId)
      response.body.data.should.has.property('media').equal(requestBody.media)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('deleted_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.payoutHistory.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/payout-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestPayoutHistory: PayoutHistory = oneSeeder.payoutHistoryMock.data[0]
      const requestBody: PayoutHistoryManagementPatchRequest = new PayoutHistoryManagementPatchRequest(
        oneSeeder.vendorMock.data[0].id,
        oneSeeder.payoutHistoryMock.data[1].amount,
        oneSeeder.payoutHistoryMock.data[1].media,
        oneSeeder.payoutHistoryMock.data[1].xenditPayoutId
      )

      const response = await agent
        .patch(`/api/v1/payout-histories/${requestPayoutHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestPayoutHistory.id)
      response.body.data.should.has.property('vendor_id').equal(requestBody.vendorId)
      response.body.data.should.has.property('xendit_payout_id').equal(requestBody.xenditPayoutId)
      response.body.data.should.has.property('amount').equal(requestBody.amount)
      response.body.data.should.has.property('media').equal(requestBody.media)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('deleted_at')
    })
  })

  describe('DELETE /api/v1/payout-histories/:id?method=hard', () => {
    it('should return 200 OK', async () => {
      const requestPayoutHistory: PayoutHistory = oneSeeder.payoutHistoryMock.data[0]

      const response = await agent
        .delete(`/api/v1/payout-histories/${requestPayoutHistory.id}?method=hard`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const result: PayoutHistory | null = await oneDatastore.client.payoutHistory.findFirst({
        where: {
          id: requestPayoutHistory.id
        }
      })
      assert.isNull(result)
    })
  })

  describe('DELETE /api/v1/payout-histories/:id?method=soft', () => {
    it('should return 200 OK', async () => {
      const requestPayoutHistory: PayoutHistory = oneSeeder.payoutHistoryMock.data[0]

      const response = await agent
        .delete(`/api/v1/payout-histories/${requestPayoutHistory.id}?method=soft`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const result: PayoutHistory | null = await oneDatastore.client.payoutHistory.findFirst({
        where: {
          id: requestPayoutHistory.id
        }
      })
      assert.isNotNull(result)
      assert.isNotNull(result?.deletedAt)
    })
  })
})
