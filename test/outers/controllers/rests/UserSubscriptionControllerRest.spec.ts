import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import {
  type Admin,
  type UserSubscription,
  type Prisma,
  type Category,
  type User
} from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import humps from 'humps'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import UserSubscriptionManagementCreateRequest from '../../../../src/inners/models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementCreateRequest'
import UserSubscriptionManagementPatchRequest from '../../../../src/inners/models/value_objects/requests/managements/user_subscription_managements/UserSubscriptionManagementPatchRequest'

chai.use(chaiHttp)
chai.should()

describe('UserSubscriptionControllerRest', () => {
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

  describe('GET /api/v1/user-subscriptions?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.userSubscriptionMock.data.length
      const response = await agent
        .get(`/api/v1/user-subscriptions?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_user_subscriptions')
      response.body.data.should.has.property('user_subscriptions')
      response.body.data.user_subscriptions.should.be.an('array')
      response.body.data.user_subscriptions.length.should.equal(pageSize)
      response.body.data.user_subscriptions.forEach((userSubscription: any) => {
        userSubscription.should.has.property('id')
        userSubscription.should.has.property('user_id')
        userSubscription.should.has.property('category_id')
        userSubscription.should.has.property('updated_at')
        userSubscription.should.has.property('created_at')
      })
    })
  })

  describe('GET /api/v1/user-subscriptions?page_number={}&page_size={}&&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestUserSubscription: UserSubscription = oneSeeder.userSubscriptionMock.data[0]
      const requestUser: User = oneSeeder.userSubscriptionMock.userMock.data.filter((user: User) => user.id === requestUserSubscription.userId)[0]
      const requestCategory: Category = oneSeeder.userSubscriptionMock.categoryMock.data.filter((category: Category) => category.id === requestUserSubscription.categoryId)[0]
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.userSubscriptionMock.data.length
      const whereInput: any = {
        id: requestUserSubscription.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        user: true,
        category: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent
        .get(`/api/v1/user-subscriptions?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_user_subscriptions')
      response.body.data.should.has.property('user_subscriptions')
      response.body.data.user_subscriptions.should.be.an('array')
      response.body.data.user_subscriptions.length.should.equal(1)
      response.body.data.user_subscriptions.forEach((userSubscription: any) => {
        userSubscription.should.has.property('id').equal(requestUserSubscription.id)
        userSubscription.should.has.property('user_id').equal(requestUserSubscription.userId)
        userSubscription.should.has.property('category_id').equal(requestUserSubscription.categoryId)
        userSubscription.should.has.property('updated_at').equal(requestUserSubscription.updatedAt.toISOString())
        userSubscription.should.has.property('created_at').equal(requestUserSubscription.createdAt.toISOString())
        userSubscription.should.has.property('user').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestUser))))
        userSubscription.should.has.property('category').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestCategory))))
      })
    })
  })

  describe('GET /api/v1/user-subscriptions/:id', () => {
    it('should return 200 OK', async () => {
      const requestUserSubscription: UserSubscription = oneSeeder.userSubscriptionMock.data[0]
      const response = await agent
        .get(`/api/v1/user-subscriptions/${requestUserSubscription.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestUserSubscription.id)
      response.body.data.should.has.property('user_id').equal(requestUserSubscription.userId)
      response.body.data.should.has.property('category_id').equal(requestUserSubscription.categoryId)
      response.body.data.should.has.property('updated_at').equal(requestUserSubscription.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestUserSubscription.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/user-subscriptions', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserSubscriptionManagementCreateRequest = new UserSubscriptionManagementCreateRequest(
        oneSeeder.userSubscriptionMock.data[0].userId,
        oneSeeder.userSubscriptionMock.data[0].categoryId
      )

      const response = await agent
        .post('/api/v1/user-subscriptions')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('user_id').equal(requestBody.userId)
      response.body.data.should.has.property('category_id').equal(requestBody.categoryId)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.userSubscription.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/user-subscriptions/:id', () => {
    it('should return 200 OK', async () => {
      const requestUserSubscription: UserSubscription = oneSeeder.userSubscriptionMock.data[0]
      const requestBody: UserSubscriptionManagementPatchRequest = new UserSubscriptionManagementPatchRequest(
        oneSeeder.userMock.data[1].id,
        oneSeeder.categoryMock.data[1].id
      )

      const response = await agent
        .patch(`/api/v1/user-subscriptions/${requestUserSubscription.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('user_id').equal(requestBody.userId)
      response.body.data.should.has.property('category_id').equal(requestBody.categoryId)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/user-subscriptions/:id', () => {
    it('should return 200 OK', async () => {
      const requestUserSubscription: UserSubscription = oneSeeder.userSubscriptionMock.data[0]
      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }

      const response = await agent
        .delete(`/api/v1/user-subscriptions/${requestUserSubscription.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: UserSubscription | null = await oneDatastore.client.userSubscription.findFirst({
        where: {
          id: requestUserSubscription.id
        }
      })
      assert.isNull(result)
    })
  })
})
