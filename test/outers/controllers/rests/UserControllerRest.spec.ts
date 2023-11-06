import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import UserManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/user_managements/UserManagementCreateRequest'
import {
  type Admin,
  type NotificationHistory,
  type Prisma,
  type TopUpHistory,
  type TransactionHistory,
  type TransactionItemHistory,
  type User,
  type UserSubscription
} from '@prisma/client'
import UserManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/user_managements/UserManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import AdminMock from '../../../mocks/AdminMock'
import humps from 'humps'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('UserControllerRest', () => {
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

  describe('GET /api/v1/users?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.userMock.data.length
      const response = await agent
        .get(`/api/v1/users?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_users')
      response.body.data.should.has.property('users')
      response.body.data.users.should.be.a('array')
      response.body.data.users.length.should.be.equal(pageSize)
      response.body.data.users.forEach((user: any) => {
        user.should.has.property('id')
        user.should.has.property('username')
        user.should.has.property('full_name')
        user.should.has.property('email')
        user.should.has.property('gender')
        user.should.has.property('address')
        user.should.has.property('balance')
        user.should.has.property('experience')
        user.should.has.property('last_latitude')
        user.should.has.property('last_longitude')
        user.should.has.property('created_at')
        user.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/users?page_number={}&page_size={}&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = oneSeeder.userMock.data[0]
      const requestNotificationHistories: NotificationHistory[] = oneSeeder.notificationHistoryMock.data.filter((notificationHistory: NotificationHistory) => notificationHistory.userId === requestUser.id)
      const requestTopUpHistories: TopUpHistory[] = oneSeeder.topUpHistoryMock.data.filter((topUpHistory: TopUpHistory) => topUpHistory.userId === requestUser.id)
      const requestTransactionHistories: TransactionHistory[] = oneSeeder.transactionHistoryMock.data.filter((transactionHistory: TransactionHistory) => transactionHistory.userId === requestUser.id)
      const requestUserSubscriptions: UserSubscription[] = oneSeeder.userSubscriptionMock.data.filter((userSubscription: UserSubscription) => userSubscription.userId === requestUser.id)

      const pageNumber: number = 1
      const pageSize: number = oneSeeder.userMock.data.length
      const whereInput: any = {
        id: requestUser.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        notificationHistories: true,
        topUpHistories: true,
        transactionHistories: true,
        userSubscriptions: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent
        .get(`/api/v1/users?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_users')
      response.body.data.should.has.property('users')
      response.body.data.users.should.be.a('array')
      response.body.data.users.length.should.be.equal(1)
      response.body.data.users.forEach((user: any) => {
        user.should.has.property('id').equal(requestUser.id)
        user.should.has.property('username').equal(requestUser.username)
        user.should.has.property('full_name').equal(requestUser.fullName)
        user.should.has.property('email').equal(requestUser.email)
        user.should.has.property('gender').equal(requestUser.gender)
        user.should.has.property('address').equal(requestUser.address)
        user.should.has.property('balance').equal(requestUser.balance)
        user.should.has.property('experience').equal(requestUser.experience)
        user.should.has.property('last_latitude').equal(requestUser.lastLatitude)
        user.should.has.property('last_longitude').equal(requestUser.lastLongitude)
        user.should.has.property('created_at').equal(requestUser.createdAt.toISOString())
        user.should.has.property('updated_at').equal(requestUser.updatedAt.toISOString())
        user.should.has.property('notification_histories').deep.members(
          requestNotificationHistories.map((notificationHistory: NotificationHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(notificationHistory))))
        )
        user.should.has.property('top_up_histories').deep.members(
          requestTopUpHistories.map((topUpHistory: TopUpHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(topUpHistory))))
        )
        user.should.has.property('transaction_histories').deep.members(
          requestTransactionHistories.map((transactionHistory: TransactionHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(transactionHistory))))
        )
        user.should.has.property('user_subscriptions').deep.members(
          requestUserSubscriptions.map((userSubscription: UserSubscription) => humps.decamelizeKeys(JSON.parse(JSON.stringify(userSubscription))))
        )
      })
    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = oneSeeder.userMock.data[0]
      const response = await agent
        .get(`/api/v1/users/${requestUser.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestUser.id)
      response.body.data.should.has.property('username').equal(requestUser.username)
      response.body.data.should.has.property('full_name').equal(requestUser.fullName)
      response.body.data.should.has.property('email').equal(requestUser.email)
      response.body.data.should.has.property('gender').equal(requestUser.gender)
      response.body.data.should.has.property('address').equal(requestUser.address)
      response.body.data.should.has.property('balance').equal(requestUser.balance)
      response.body.data.should.has.property('experience').equal(requestUser.experience)
      response.body.data.should.has.property('last_latitude').equal(requestUser.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestUser.lastLongitude)
      response.body.data.should.has.property('updated_at').equal(requestUser.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestUser.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/users', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserManagementCreateRequest = new UserManagementCreateRequest(
        oneSeeder.userMock.data[0].fullName,
        oneSeeder.userMock.data[0].gender,
        oneSeeder.userMock.data[0].address,
        oneSeeder.userMock.data[0].username,
        oneSeeder.userMock.data[0].email,
        oneSeeder.userMock.data[0].password,
        oneSeeder.userMock.data[0].lastLatitude,
        oneSeeder.userMock.data[0].lastLongitude
      )

      const response = await agent
        .post('/api/v1/users')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('username').equal(requestBody.username)
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('address').equal(requestBody.address)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.user.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = oneSeeder.userMock.data[0]
      const requestBody: UserManagementPatchRequest = new UserManagementPatchRequest(
        `patched${requestUser.fullName}`,
        'FEMALE',
        `patched${requestUser.username}`,
        `patched${requestUser.email}`,
        `patched${requestUser.password}`,
        requestUser.password,
        requestUser.lastLatitude + 1,
        requestUser.lastLongitude + 1
      )

      const response = await agent
        .patch(`/api/v1/users/${requestUser.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('username').equal(requestBody.username)
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('address').equal(requestUser.address)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('DELETE /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = oneSeeder.userMock.data[0]
      const requestNotificationHistories: NotificationHistory[] = oneSeeder.notificationHistoryMock.data.filter((notificationHistory: NotificationHistory) => notificationHistory.userId === requestUser.id)
      const requestTopUpHistories: TopUpHistory[] = oneSeeder.topUpHistoryMock.data.filter((topUpHistory: TopUpHistory) => topUpHistory.userId === requestUser.id)
      const requestUserSubscriptions: UserSubscription[] = oneSeeder.userSubscriptionMock.data.filter((userSubscription: UserSubscription) => userSubscription.userId === requestUser.id)
      const requestTransactionHistories: TransactionHistory[] = oneSeeder.transactionHistoryMock.data.filter((transactionHistory: TransactionHistory) => transactionHistory.userId === requestUser.id)
      const requestTransactionItemHistories: TransactionItemHistory[] = oneSeeder.transactionItemHistoryMock.data.filter((transactionItemHistory: TransactionItemHistory) => requestTransactionHistories.map((transactionHistory: TransactionHistory) => transactionHistory.id).includes(transactionItemHistory.transactionId))

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      await oneDatastore.client.notificationHistory.deleteMany({
        where: {
          id: {
            in: requestNotificationHistories.map((notificationHistory: NotificationHistory) => notificationHistory.id)
          }
        }
      })
      await oneDatastore.client.topUpHistory.deleteMany({
        where: {
          id: {
            in: requestTopUpHistories.map((topUpHistory: TopUpHistory) => topUpHistory.id)
          }
        }
      })
      await oneDatastore.client.transactionItemHistory.deleteMany({
        where: {
          id: {
            in: requestTransactionItemHistories.map((transactionItemHistory: TransactionItemHistory) => transactionItemHistory.id)
          }
        }
      })
      await oneDatastore.client.transactionHistory.deleteMany({
        where: {
          id: {
            in: requestTransactionHistories.map((transactionHistory: TransactionHistory) => transactionHistory.id)
          }
        }
      })
      await oneDatastore.client.userSubscription.deleteMany({
        where: {
          id: {
            in: requestUserSubscriptions.map((userSubscription: UserSubscription) => userSubscription.id)
          }
        }
      })

      const response = await agent
        .delete(`/api/v1/users/${requestUser.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: User | null = await oneDatastore.client.user.findFirst({
        where: {
          id: requestUser.id
        }
      })
      assert.isNull(result)
    })
  })
})
