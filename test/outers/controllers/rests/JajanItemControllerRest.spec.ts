import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import JajanItemMock from '../../../mocks/JajanItemMock'
import VendorMock from '../../../mocks/VendorMock'
import CategoryMock from '../../../mocks/CategoryMock'
import { type Admin, type Category, type JajanItem, type Vendor } from '@prisma/client'
import JajanItemManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/jajan_item_management/JajanItemManagementCreateRequest'
import JajanItemManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/jajan_item_management/JajanItemManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'

chai.use(chaiHttp)
chai.should()

describe('JajanItemControllerRest', () => {
  const authAdminMock: AdminMock = new AdminMock()
  const vendorMock: VendorMock = new VendorMock()
  const categoryMock: CategoryMock = new CategoryMock()
  const jajanItemMock: JajanItemMock = new JajanItemMock(vendorMock, categoryMock)
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

    await oneDatastore.client.vendor.createMany({
      data: vendorMock.data
    })

    await oneDatastore.client.category.createMany({
      data: categoryMock.data
    })

    await oneDatastore.client.jajanItem.createMany({
      data: jajanItemMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    await oneDatastore.client.jajanItem.deleteMany({
      where: {
        categoryId: {
          in: categoryMock.data.map((category: Category) => category.id)
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

  describe('GET /api/v1/jajan-items?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = jajanItemMock.data.length
      const response = await agent
        .get(`/api/v1/jajan-items?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.data.should.has.property('total_jajan_items')
      response.body.data.should.has.property('jajan_items')
      response.body.data.jajan_items.should.be.an('array')
      response.body.data.jajan_items.forEach((jajanItem: JajanItem) => {
        jajanItem.should.has.property('id')
        jajanItem.should.has.property('vendor_id')
        jajanItem.should.has.property('category_id')
        jajanItem.should.has.property('name')
        jajanItem.should.has.property('price')
        jajanItem.should.has.property('image_url')
        jajanItem.should.has.property('created_at')
        jajanItem.should.has.property('updated_at')
      })
    })
  })

  describe('POST /api/v1/jajan-items', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: JajanItemManagementCreateRequest = new JajanItemManagementCreateRequest(
        jajanItemMock.data[0].vendorId,
        jajanItemMock.data[0].categoryId,
        jajanItemMock.data[0].name,
        jajanItemMock.data[0].price,
        jajanItemMock.data[0].imageUrl
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
    })
  })

  describe('PATCH /api/v1/jajan-items/:id', () => {
    it('should return 200 OK', async () => {
      const requestJajanItem: JajanItem = jajanItemMock.data[0]
      const requestBody: JajanItemManagementPatchRequest = new JajanItemManagementPatchRequest(
        vendorMock.data[1].id,
        categoryMock.data[1].id,
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
    })
  })

  describe('DELETE /api/v1/jajan-items/:id', () => {
    it('should return 200 OK', async () => {
      const requestJajanItem: JajanItem = jajanItemMock.data[0]

      const response = await agent
        .delete(`/api/v1/jajan-items/${requestJajanItem.id}`)
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
      const result: JajanItem | null = await oneDatastore.client.jajanItem.findFirst({
        where: {
          id: requestJajanItem.id
        }
      })
      assert.isNull(result)
    })
  })
})
