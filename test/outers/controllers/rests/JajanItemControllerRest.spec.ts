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
  type Prisma,
  type TransactionHistory,
  type Vendor
} from '@prisma/client'
import JajanItemManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/jajan_item_management/JajanItemManagementCreateRequest'
import JajanItemManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/jajan_item_management/JajanItemManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import humps from 'humps'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('JajanItemControllerRest', () => {
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

  describe('GET /api/v1/jajan-items?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.jajanItemMock.data.length
      const response = await agent
        .get(`/api/v1/jajan-items?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_jajan_items')
      response.body.data.should.has.property('jajan_items')
      response.body.data.jajan_items.should.be.an('array')
      response.body.data.jajan_items.length.should.equal(pageSize)
      response.body.data.jajan_items.forEach((jajanItem: any) => {
        jajanItem.should.has.property('id')
        jajanItem.should.has.property('vendor_id')
        jajanItem.should.has.property('category_id')
        jajanItem.should.has.property('name')
        jajanItem.should.has.property('price')
        jajanItem.should.has.property('image_url')
        jajanItem.should.has.property('updated_at')
        jajanItem.should.has.property('created_at')
      })
    })
  })

  describe('GET /api/v1/jajan-items?page_number={}&page_size={}&&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestJajanItem: JajanItem = oneSeeder.jajanItemMock.data[0]
      const requestVendor: Vendor = oneSeeder.jajanItemMock.vendorMock.data.filter((vendor: Vendor) => vendor.id === requestJajanItem.vendorId)[0]
      const requestCategory: Category = oneSeeder.jajanItemMock.categoryMock.data.filter((category: Category) => category.id === requestJajanItem.categoryId)[0]
      const requestTransactionHistories: TransactionHistory[] = oneSeeder.transactionHistoryMock.data.filter((transactionHistory: TransactionHistory) => transactionHistory.jajanItemId === requestJajanItem.id)
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.jajanItemMock.data.length
      const whereInput: any = {
        id: requestJajanItem.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        vendor: true,
        category: true,
        transactionHistories: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent
        .get(`/api/v1/jajan-items?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_jajan_items')
      response.body.data.should.has.property('jajan_items')
      response.body.data.jajan_items.should.be.an('array')
      response.body.data.jajan_items.length.should.equal(1)
      response.body.data.jajan_items.forEach((jajanItem: any) => {
        jajanItem.should.has.property('id').equal(requestJajanItem.id)
        jajanItem.should.has.property('vendor_id').equal(requestJajanItem.vendorId)
        jajanItem.should.has.property('category_id').equal(requestJajanItem.categoryId)
        jajanItem.should.has.property('name').equal(requestJajanItem.name)
        jajanItem.should.has.property('price').equal(requestJajanItem.price)
        jajanItem.should.has.property('image_url').equal(requestJajanItem.imageUrl)
        jajanItem.should.has.property('updated_at').equal(requestJajanItem.updatedAt.toISOString())
        jajanItem.should.has.property('created_at').equal(requestJajanItem.createdAt.toISOString())
        jajanItem.should.has.property('vendor').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestVendor))))
        jajanItem.should.has.property('category').deep.equal(humps.decamelizeKeys(JSON.parse(JSON.stringify(requestCategory))))
        jajanItem.should.has.property('transaction_histories').deep.members(
          requestTransactionHistories.map((transactionHistory: TransactionHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(transactionHistory))))
        )
      })
    })
  })

  describe('GET /api/v1/jajan-items/:id', () => {
    it('should return 200 OK', async () => {
      const requestJajanItem: JajanItem = oneSeeder.jajanItemMock.data[0]
      const response = await agent
        .get(`/api/v1/jajan-items/${requestJajanItem.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestJajanItem.id)
      response.body.data.should.has.property('vendor_id').equal(requestJajanItem.vendorId)
      response.body.data.should.has.property('category_id').equal(requestJajanItem.categoryId)
      response.body.data.should.has.property('name').equal(requestJajanItem.name)
      response.body.data.should.has.property('price').equal(requestJajanItem.price)
      response.body.data.should.has.property('image_url').equal(requestJajanItem.imageUrl)
      response.body.data.should.has.property('updated_at').equal(requestJajanItem.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestJajanItem.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/jajan-items', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: JajanItemManagementCreateRequest = new JajanItemManagementCreateRequest(
        oneSeeder.jajanItemMock.data[0].vendorId,
        oneSeeder.jajanItemMock.data[0].categoryId,
        'name2',
        2.0,
        'https://placehold.co/400x400?text=imageUrl2'
      )

      const response = await agent
        .post('/api/v1/jajan-items')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('vendor_id').equal(requestBody.vendorId)
      response.body.data.should.has.property('category_id').equal(requestBody.categoryId)
      response.body.data.should.has.property('name').equal(requestBody.name)
      response.body.data.should.has.property('price').equal(requestBody.price)
      response.body.data.should.has.property('image_url').equal(requestBody.imageUrl)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.jajanItem.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/jajan-items/:id', () => {
    it('should return 200 OK', async () => {
      const requestJajanItem: JajanItem = oneSeeder.jajanItemMock.data[0]
      const requestBody: JajanItemManagementPatchRequest = new JajanItemManagementPatchRequest(
        oneSeeder.vendorMock.data[1].id,
        oneSeeder.categoryMock.data[1].id,
        `patched${requestJajanItem.name}`,
        requestJajanItem.price + 1,
        'https://placehold.co/400x400?text=patched'
      )

      const response = await agent
        .patch(`/api/v1/jajan-items/${requestJajanItem.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('vendor_id').equal(requestBody.vendorId)
      response.body.data.should.has.property('category_id').equal(requestBody.categoryId)
      response.body.data.should.has.property('name').equal(requestBody.name)
      response.body.data.should.has.property('price').equal(requestBody.price)
      response.body.data.should.has.property('image_url').equal(requestBody.imageUrl)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/jajan-items/:id', () => {
    it('should return 200 OK', async () => {
      const requestJajanItem: JajanItem = oneSeeder.jajanItemMock.data[0]
      const requestTransactionHistories: TransactionHistory[] = oneSeeder.transactionHistoryMock.data.filter((transactionHistory: TransactionHistory) => transactionHistory.jajanItemId === requestJajanItem.id)
      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      await oneDatastore.client.transactionHistory.deleteMany({
        where: {
          id: {
            in: requestTransactionHistories.map((transactionHistory: TransactionHistory) => transactionHistory.id)
          }
        }
      })

      const response = await agent
        .delete(`/api/v1/jajan-items/${requestJajanItem.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: JajanItem | null = await oneDatastore.client.jajanItem.findFirst({
        where: {
          id: requestJajanItem.id
        }
      })
      assert.isNull(result)
    })
  })
})
