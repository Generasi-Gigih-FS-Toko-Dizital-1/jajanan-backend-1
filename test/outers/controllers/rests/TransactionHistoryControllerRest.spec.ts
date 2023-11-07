import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import { type Admin, type Prisma, type TransactionHistory, type TransactionItemHistory, type User } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import TransactionHistoryManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/transaction_history_managements/TransactionHistoryManagementCreateRequest'
import TransactionHistoryManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/transaction_history_managements/TransactionHistoryManagementPatchRequest'
import humps from 'humps'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

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

  describe('GET /api/v1/transaction-histories?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.transactionHistoryMock.data.length
      const response = await agent
        .get(`/api/v1/transaction-histories?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_transaction_histories')
      response.body.data.should.has.property('transaction_histories')
      response.body.data.transaction_histories.should.be.an('array')
      response.body.data.transaction_histories.length.should.equal(pageSize)
      response.body.data.transaction_histories.forEach((transactionHistory: any) => {
        transactionHistory.should.has.property('id')
        transactionHistory.should.has.property('user_id')
        transactionHistory.should.has.property('payment_method')
        transactionHistory.should.has.property('last_latitude')
        transactionHistory.should.has.property('last_longitude')
        transactionHistory.should.has.property('updated_at')
        transactionHistory.should.has.property('created_at')
      })
    })
  })

  describe('GET /api/v1/transaction-histories?page_number={}&page_size={}&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestTransactionHistory: TransactionHistory = oneSeeder.transactionHistoryMock.data[0]
      const requestTransactionItemHistories: TransactionItemHistory[] = oneSeeder.transactionItemHistoryMock.data.filter((transactionItemHistory: TransactionItemHistory) => transactionItemHistory.transactionId === requestTransactionHistory.id)
      const requestUser: User = oneSeeder.userMock.data[0]
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.transactionHistoryMock.data.length
      const whereInput: any = {
        id: requestTransactionHistory.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        user: true,
        transactionItems: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent
        .get(`/api/v1/transaction-histories?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_transaction_histories')
      response.body.data.should.has.property('transaction_histories')
      response.body.data.transaction_histories.should.be.an('array')
      response.body.data.transaction_histories.length.should.equal(1)
      response.body.data.transaction_histories.forEach((transactionHistory: any) => {
        transactionHistory.should.has.property('id').equal(requestTransactionHistory.id)
        transactionHistory.should.has.property('user_id').equal(requestTransactionHistory.userId)
        transactionHistory.should.has.property('payment_method').equal(requestTransactionHistory.paymentMethod)
        transactionHistory.should.has.property('last_latitude').equal(requestTransactionHistory.lastLatitude)
        transactionHistory.should.has.property('last_longitude').equal(requestTransactionHistory.lastLongitude)
        transactionHistory.should.has.property('updated_at').equal(requestTransactionHistory.updatedAt.toISOString())
        transactionHistory.should.has.property('created_at').equal(requestTransactionHistory.createdAt.toISOString())
        transactionHistory.should.has.property('user').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestUser))))
        transactionHistory.should.has.property('transaction_items').deep.members(
          requestTransactionItemHistories.map((transactionItemHistory: TransactionItemHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(transactionItemHistory))))
        )
      })
    })
  })

  describe('GET /api/v1/transaction-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTransactionHistory: TransactionHistory = oneSeeder.transactionHistoryMock.data[0]
      const response = await agent
        .get(`/api/v1/transaction-histories/${requestTransactionHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestTransactionHistory.id)
      response.body.data.should.has.property('user_id').equal(requestTransactionHistory.userId)
      response.body.data.should.has.property('payment_method').equal(requestTransactionHistory.paymentMethod)
      response.body.data.should.has.property('last_latitude').equal(requestTransactionHistory.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestTransactionHistory.lastLongitude)
      response.body.data.should.has.property('updated_at').equal(requestTransactionHistory.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestTransactionHistory.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/transaction-histories', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: TransactionHistoryManagementCreateRequest = new TransactionHistoryManagementCreateRequest(
        oneSeeder.transactionHistoryMock.data[0].userId,
        oneSeeder.transactionHistoryMock.data[0].paymentMethod,
        oneSeeder.transactionHistoryMock.data[0].lastLatitude,
        oneSeeder.transactionHistoryMock.data[0].lastLongitude
      )

      const response = await agent
        .post('/api/v1/transaction-histories')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('user_id').equal(requestBody.userId)
      response.body.data.should.has.property('payment_method').equal(requestBody.paymentMethod)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.transactionHistory.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/transaction-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTransactionHistory: TransactionHistory = oneSeeder.transactionHistoryMock.data[0]
      const requestBody: TransactionHistoryManagementPatchRequest = new TransactionHistoryManagementPatchRequest(
        oneSeeder.transactionHistoryMock.data[1].userId,
        oneSeeder.transactionHistoryMock.data[1].paymentMethod,
        oneSeeder.transactionHistoryMock.data[1].lastLatitude,
        oneSeeder.transactionHistoryMock.data[1].lastLongitude
      )

      const response = await agent
        .patch(`/api/v1/transaction-histories/${requestTransactionHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('user_id').equal(requestBody.userId)
      response.body.data.should.has.property('payment_method').equal(requestBody.paymentMethod)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/transaction-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTransactionHistory: TransactionHistory = oneSeeder.transactionHistoryMock.data[0]
      const requestTransactionItemHistory: TransactionItemHistory[] = oneSeeder.transactionItemHistoryMock.data.filter((transactionItemHistory: TransactionItemHistory) => transactionItemHistory.transactionId === requestTransactionHistory.id)

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      await oneDatastore.client.transactionItemHistory.deleteMany({
        where: {
          id: {
            in: requestTransactionItemHistory.map((transactionItemHistory: TransactionItemHistory) => transactionItemHistory.id)
          }
        }
      })

      const response = await agent
        .delete(`/api/v1/transaction-histories/${requestTransactionHistory.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: TransactionHistory | null = await oneDatastore.client.transactionHistory.findFirst({
        where: {
          id: requestTransactionHistory.id
        }
      })
      assert.isNull(result)
    })
  })
})
