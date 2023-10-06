import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import TransactionHistoryMock from '../../../mocks/TransactionHistoryMock'
import UserMock from '../../../mocks/UserMock'
import JajanItemMock from '../../../mocks/JajanItemMock'
import {
  type Admin,
  type Category,
  type JajanItem,
  type Prisma,
  type TransactionHistory,
  type User,
  type Vendor
} from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import TransactionHistoryManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/transaction_history_management/TransactionHistoryManagementCreateRequest'
import TransactionHistoryManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/transaction_history_management/TransactionHistoryManagementPatchRequest'
import VendorMock from '../../../mocks/VendorMock'
import CategoryMock from '../../../mocks/CategoryMock'

chai.use(chaiHttp)
chai.should()

describe('TransactionHistoryControllerRest', () => {
  const authAdminMock: AdminMock = new AdminMock()
  const userMock: UserMock = new UserMock()
  const vendorMock: VendorMock = new VendorMock()
  const categoryMock: CategoryMock = new CategoryMock()
  const jajanItemMock: JajanItemMock = new JajanItemMock(vendorMock, categoryMock)
  const transactionHistoryMock: TransactionHistoryMock = new TransactionHistoryMock(userMock, jajanItemMock)
  const oneDatastore = new OneDatastore()
  let agent: ChaiHttp.Agent
  let authorization: Authorization

  before(async () => {
    await waitUntil(() => server !== undefined)
    await oneDatastore.connect()

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
    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    await oneDatastore.client.user.createMany({
      data: userMock.data
    })

    await oneDatastore.client.vendor.createMany({
      data: vendorMock.data
    })

    await oneDatastore.client.category.createMany({
      data: categoryMock.data
    })

    await oneDatastore.client.jajanItem.createMany({
      data: jajanItemMock.data
    })

    await oneDatastore.client.transactionHistory.createMany({
      data: transactionHistoryMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    await oneDatastore.client.transactionHistory.deleteMany({
      where: {
        id: {
          in: transactionHistoryMock.data.map((transactionHistory: TransactionHistory) => transactionHistory.id)
        }
      }
    })

    await oneDatastore.client.jajanItem.deleteMany({
      where: {
        id: {
          in: jajanItemMock.data.map((jajanItem: JajanItem) => jajanItem.id)
        }
      }
    })

    await oneDatastore.client.category.deleteMany({
      where: {
        id: {
          in: categoryMock.data.map((category: Category) => category.id)
        }
      }
    })

    await oneDatastore.client.vendor.deleteMany(
      {
        where: {
          id: {
            in: vendorMock.data.map((vendor: Vendor) => vendor.id)
          }
        }
      }
    )

    await oneDatastore.client.user.deleteMany(
      {
        where: {
          id: {
            in: userMock.data.map((user: User) => user.id)
          }
        }
      }
    )

    await oneDatastore.disconnect()
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
      const pageSize: number = transactionHistoryMock.data.length
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
      response.body.data.transaction_histories.forEach((transactionHistory: TransactionHistory) => {
        transactionHistory.should.has.property('id')
        transactionHistory.should.has.property('user_id')
        transactionHistory.should.has.property('jajan_item_id')
        transactionHistory.should.has.property('amount')
        transactionHistory.should.has.property('payment_method')
        transactionHistory.should.has.property('last_latitude')
        transactionHistory.should.has.property('last_longitude')
        transactionHistory.should.has.property('updated_at')
        transactionHistory.should.has.property('created_at')
      })
    })
  })

  describe('GET /api/v1/transaction-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTransactionHistory: TransactionHistory = transactionHistoryMock.data[0]
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
      response.body.data.should.has.property('jajan_item_id').equal(requestTransactionHistory.jajanItemId)
      response.body.data.should.has.property('amount').equal(requestTransactionHistory.amount)
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
        transactionHistoryMock.data[0].userId,
        transactionHistoryMock.data[0].jajanItemId,
        transactionHistoryMock.data[0].amount,
        transactionHistoryMock.data[0].paymentMethod,
        transactionHistoryMock.data[0].lastLatitude,
        transactionHistoryMock.data[0].lastLongitude
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
      response.body.data.should.has.property('jajan_item_id').equal(requestBody.jajanItemId)
      response.body.data.should.has.property('amount').equal(requestBody.amount)
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
      const requestTransactionHistory: TransactionHistory = transactionHistoryMock.data[0]
      const requestBody: TransactionHistoryManagementPatchRequest = new TransactionHistoryManagementPatchRequest(
        transactionHistoryMock.data[1].userId,
        transactionHistoryMock.data[1].jajanItemId,
        transactionHistoryMock.data[1].amount,
        transactionHistoryMock.data[1].paymentMethod,
        transactionHistoryMock.data[1].lastLatitude,
        transactionHistoryMock.data[1].lastLongitude
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
      response.body.data.should.has.property('jajan_item_id').equal(requestBody.jajanItemId)
      response.body.data.should.has.property('amount').equal(requestBody.amount)
      response.body.data.should.has.property('payment_method').equal(requestBody.paymentMethod)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/transaction-histories/:id', () => {
    it('should return 200 OK', async () => {
      const requestTransactionHistory: TransactionHistory = transactionHistoryMock.data[0]

      const response = await agent
        .delete(`/api/v1/transaction-histories/${requestTransactionHistory.id}`)
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
      const result: TransactionHistory | null = await oneDatastore.client.transactionHistory.findFirst({
        where: {
          id: requestTransactionHistory.id
        }
      })
      assert.isNull(result)
    })
  })
})
