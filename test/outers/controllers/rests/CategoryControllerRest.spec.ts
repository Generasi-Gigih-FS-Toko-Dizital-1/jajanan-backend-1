import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import {
  type Admin,
  type Category,
  type JajanItem,
  type JajanItemSnapshot,
  type Prisma,
  type TransactionItemHistory,
  type UserSubscription
} from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import humps from 'humps'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import CategoryManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/category_managements/CategoryManagementCreateRequest'
import CategoryManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/category_managements/CategoryManagementPatchRequest'

chai.use(chaiHttp)
chai.should()

describe('CategoryControllerRest', () => {
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

  describe('GET /api/v1/categories?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.categoryMock.data.length
      const response = await agent
        .get(`/api/v1/categories?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_categories')
      response.body.data.should.has.property('categories')
      response.body.data.categories.should.be.an('array')
      response.body.data.categories.forEach((category: Category) => {
        category.should.has.property('id')
        category.should.has.property('name')
        category.should.has.property('icon_url')
        category.should.has.property('created_at')
        category.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/categories?page_number={}&page_size={}&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestCategory: Category = oneSeeder.categoryMock.data[0]
      const requestJajanItems: JajanItem[] = oneSeeder.jajanItemMock.data.filter((jajanItem: JajanItem) => jajanItem.categoryId === requestCategory.id)
      const requestJajanItemSnapshots: JajanItemSnapshot[] = oneSeeder.jajanItemSnapshotMock.data.filter((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.categoryId === requestCategory.id)
      const requestUserSubscriptions: UserSubscription[] = oneSeeder.userSubscriptionMock.data.filter((userSubscription: UserSubscription) => userSubscription.categoryId === requestCategory.id)
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.jajanItemMock.data.length
      const whereInput: any = {
        id: requestCategory.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        jajanItems: true,
        jajanItemSnapshots: true,
        userSubscriptions: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent
        .get(`/api/v1/categories?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_categories')
      response.body.data.should.has.property('categories')
      response.body.data.categories.should.be.an('array')
      response.body.data.categories.length.should.equal(1)
      response.body.data.categories.forEach((category: any) => {
        category.should.has.property('id').equal(requestCategory.id)
        category.should.has.property('name').equal(requestCategory.name)
        category.should.has.property('icon_url').equal(requestCategory.iconUrl)
        category.should.has.property('jajan_items').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestJajanItems))))
        category.should.has.property('jajan_item_snapshots').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestJajanItemSnapshots))))
        category.should.has.property('user_subscriptions').deep.members(
          requestUserSubscriptions.map((userSubscription: UserSubscription) => humps.decamelizeKeys(JSON.parse(JSON.stringify(userSubscription))))
        )
      })
    })
  })

  describe('GET /api/v1/categories/:id', () => {
    it('should return 200 OK', async () => {
      const requestCategory: Category = oneSeeder.categoryMock.data[0]
      const response = await agent
        .get(`/api/v1/categories/${requestCategory.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestCategory.id)
      response.body.data.should.has.property('name').equal(requestCategory.name)
      response.body.data.should.has.property('icon_url').equal(requestCategory.iconUrl)
      response.body.data.should.has.property('updated_at').equal(requestCategory.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestCategory.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/categories', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: CategoryManagementCreateRequest = new CategoryManagementCreateRequest(
        oneSeeder.categoryMock.data[0].name,
        oneSeeder.categoryMock.data[0].iconUrl
      )

      const response = await agent
        .post('/api/v1/categories')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('name').equal(requestBody.name)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.category.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/categories/:id', () => {
    it('should return 200 OK', async () => {
      const requestCategory: Category = oneSeeder.categoryMock.data[0]
      const requestBody: CategoryManagementPatchRequest = new CategoryManagementPatchRequest(
        oneSeeder.categoryMock.data[1].name,
        'https://placehold.co/400x400?text=patchediconUrl0'
      )

      const response = await agent
        .patch(`/api/v1/categories/${requestCategory.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('name').equal(requestBody.name)
      response.body.data.should.has.property('icon_url').equal(requestBody.iconUrl)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/categories/:id?method=hard', () => {
    it('should return 200 OK', async () => {
      const requestCategory: Category = oneSeeder.categoryMock.data[0]
      const requestJajanItems: JajanItem[] = oneSeeder.jajanItemMock.data.filter((jajanItem: JajanItem) => jajanItem.categoryId === requestCategory.id)
      const requestJajanItemSnapshots: JajanItemSnapshot[] = oneSeeder.jajanItemSnapshotMock.data.filter((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.categoryId === requestCategory.id)
      const requestTransactionItemHistories: TransactionItemHistory[] = oneSeeder.transactionItemHistoryMock.data.filter((transactionItemHistory: TransactionItemHistory) => requestJajanItemSnapshots.map((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.id).includes(transactionItemHistory.jajanItemSnapshotId))
      const requestUserSubscriptions: UserSubscription[] = oneSeeder.userSubscriptionMock.data.filter((userSubscription: UserSubscription) => userSubscription.categoryId === requestCategory.id)

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }

      await oneDatastore.client.userSubscription.deleteMany({
        where: {
          id: {
            in: requestUserSubscriptions.map((userSubscription: UserSubscription) => userSubscription.id)
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
      await oneDatastore.client.jajanItemSnapshot.deleteMany({
        where: {
          id: {
            in: requestJajanItemSnapshots.map((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.id)
          }
        }
      })
      await oneDatastore.client.jajanItem.deleteMany({
        where: {
          id: {
            in: requestJajanItems.map((jajanItem: JajanItem) => jajanItem.id)
          }
        }
      })

      const response = await agent
        .delete(`/api/v1/categories/${requestCategory.id}?method=hard`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: Category | null = await oneDatastore.client.category.findFirst({
        where: {
          id: requestCategory.id
        }
      })
      assert.isNull(result)
    })
  })

  describe('DELETE /api/v1/categories/:id?method=soft', () => {
    it('should return 200 OK', async () => {
      const requestCategory: Category = oneSeeder.categoryMock.data[0]
      const response = await agent
        .delete(`/api/v1/categories/${requestCategory.id}?method=soft`)
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
      const result: Category | null = await oneDatastore.client.category.findFirst({
        where: {
          id: requestCategory.id
        }
      })
      assert.isNotNull(result)
      assert.isNotNull(result?.deletedAt)
    })
  })
})
