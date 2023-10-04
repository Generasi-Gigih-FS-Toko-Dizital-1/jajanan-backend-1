import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import JajanItemMock from '../../../mocks/JajanItemMock'
import VendorMock from '../../../mocks/VendorMock'
import CategoryMock from '../../../mocks/CategoryMock'
import { type Vendor, type Category, type JajanItem } from '@prisma/client'
import JajanItemManagementCreateRequest from '../../../../src/inners/models/value_objects/requests/jajan_item_management/JajanItemManagementCreateRequest'
import JajanItemManagementPatchRequest from '../../../../src/inners/models/value_objects/requests/jajan_item_management/JajanItemManagementPatchRequest'

chai.use(chaiHttp)
chai.should()

describe('JajanItemControllerRest', () => {
  const vendorMock: VendorMock = new VendorMock()
  const categoryMock: CategoryMock = new CategoryMock()
  const jajanItemMock: JajanItemMock = new JajanItemMock(vendorMock, categoryMock)
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

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

  describe('GET /api/v1/jajan-items?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = jajanItemMock.data.length
      const response = await chai
        .request(server)
        .get(`/api/v1/jajan-items?page_number=${pageNumber}&page_size=${pageSize}`)

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

      const response = await chai
        .request(server)
        .post('/api/v1/jajan-items')
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

      const response = await chai
        .request(server)
        .patch(`/api/v1/jajan-items/${requestJajanItem.id}`)
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

      const response = await chai
        .request(server)
        .delete(`/api/v1/jajan-items/${requestJajanItem.id}`)

      response.should.has.status(200)
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
