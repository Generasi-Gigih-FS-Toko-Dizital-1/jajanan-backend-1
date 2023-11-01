import chai from 'chai'
import chaiHttp from 'chai-http'
import { server } from '../../../../src/App'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import AdminMock from '../../../mocks/AdminMock'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import waitUntil from 'async-wait-until'
import { type Admin, type Prisma, type TopUpHistory, type User } from '@prisma/client'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import humps from 'humps'
import TopUpHistoryManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/top_up_history_managements/TopUpHistoryManagementCreateRequest'
import TopUpHistoryManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/top_up_history_managements/TopUpHistoryManagementPatchRequest'

chai.use(chaiHttp)
chai.should()

describe('TopUpHistoryControllerRest', () => {
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

  describe('GET /api/v1/top-up-histories?page_number={}&page_size={}&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestTopUpHistory: TopUpHistory = oneSeeder.topUpHistoryMock.data[0]
      const requestUser: User = oneSeeder.userMock.data[0]
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.topUpHistoryMock.data.length
      const whereInput: any = {
        id: requestTopUpHistory.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        user: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))

      const response = await agent
        .get(`/api/v1/top-up-histories?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_top_up_history')
      response.body.data.should.has.property('top_up_histories')
      response.body.data.top_up_histories.should.be.an('array')
      response.body.data.top_up_histories.length.should.be.equal(1)
      response.body.data.top_up_histories[0].should.be.an('object')
      response.body.data.top_up_histories[0].should.has.property('id').equal(requestTopUpHistory.id)
      response.body.data.top_up_histories[0].should.has.property('user_id').equal(requestTopUpHistory.userId)
      response.body.data.top_up_histories[0].should.has.property('amount').equal(requestTopUpHistory.amount)
      response.body.data.top_up_histories[0].should.has.property('created_at').equal(requestTopUpHistory.createdAt.toISOString())
      response.body.data.top_up_histories[0].should.has.property('updated_at').equal(requestTopUpHistory.updatedAt.toISOString())
      response.body.data.top_up_histories[0].should.has.property('user').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestUser))))
    })
  })

  describe('GET /api/v1/top-up-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTopUpHistory: TopUpHistory = oneSeeder.topUpHistoryMock.data[0]

      const response = await agent
        .get(`/api/v1/top-up-histories/${requestTopUpHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('id').equal(requestTopUpHistory.id)
      response.body.data.should.has.property('user_id').equal(requestTopUpHistory.userId)
      response.body.data.should.has.property('amount').equal(requestTopUpHistory.amount)
      response.body.data.should.has.property('created_at').equal(requestTopUpHistory.createdAt.toISOString())
      response.body.data.should.has.property('updated_at').equal(requestTopUpHistory.updatedAt.toISOString())
    })
  })

  describe('POST /api/v1/top-up-histories', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: TopUpHistoryManagementCreateRequest = new TopUpHistoryManagementCreateRequest(
        oneSeeder.userMock.data[0].id,
        oneSeeder.topUpHistoryMock.data[0].amount,
        oneSeeder.topUpHistoryMock.data[0].media,
        oneSeeder.topUpHistoryMock.data[0].xenditInvoiceId
      )

      const response = await agent
        .post('/api/v1/top-up-histories')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('user_id').equal(requestBody.userId)
      response.body.data.should.has.property('amount').equal(requestBody.amount)
      response.body.data.should.has.property('media').equal(requestBody.media)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.topUpHistory.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/top-up-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTopUpHistory: TopUpHistory = oneSeeder.topUpHistoryMock.data[0]
      const requestBody: TopUpHistoryManagementPatchRequest = new TopUpHistoryManagementPatchRequest(
        oneSeeder.userMock.data[0].id,
        oneSeeder.topUpHistoryMock.data[1].amount,
        oneSeeder.topUpHistoryMock.data[1].media,
        oneSeeder.topUpHistoryMock.data[0].xenditInvoiceId
      )

      const response = await agent
        .patch(`/api/v1/top-up-histories/${requestTopUpHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestTopUpHistory.id)
      response.body.data.should.has.property('user_id').equal(requestBody.userId)
      response.body.data.should.has.property('amount').equal(requestBody.amount)
      response.body.data.should.has.property('media').equal(requestBody.media)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/top-up-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTopUpHistory: TopUpHistory = oneSeeder.topUpHistoryMock.data[0]

      const response = await agent
        .delete(`/api/v1/top-up-histories/${requestTopUpHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
    })
  })
})
