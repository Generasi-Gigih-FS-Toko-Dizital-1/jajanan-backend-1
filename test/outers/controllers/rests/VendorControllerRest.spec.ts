import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import VendorMock from '../../../mocks/VendorMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import VendorManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/vendor_managements/VendorManagementCreateRequest'
import { type Admin, type Vendor } from '@prisma/client'
import VendorManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/vendor_managements/VendorManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'

chai.use(chaiHttp)
chai.should()

describe('VendorControllerRest', () => {
  const authAdminMock: AdminMock = new AdminMock()
  const vendorMock: VendorMock = new VendorMock()
  const oneDatastore: OneDatastore = new OneDatastore()
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
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.vendor.createMany({
      data: vendorMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.vendor.deleteMany(
      {
        where: {
          id: {
            in: vendorMock.data.map((vendor: Vendor) => vendor.id)
          }
        }
      }
    )
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

  describe('GET /api/v1/vendors?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = vendorMock.data.length
      const response = await agent
        .get(`/api/v1/vendors?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_vendors')
      response.body.data.should.has.property('vendors')
      response.body.data.vendors.should.be.a('array')
      response.body.data.vendors.length.should.be.equal(pageSize)
      response.body.data.vendors.forEach((vendor: Vendor) => {
        vendor.should.has.property('id')
        vendor.should.has.property('username')
        vendor.should.has.property('full_name')
        vendor.should.has.property('address')
        vendor.should.has.property('email')
        vendor.should.has.property('gender')
        vendor.should.has.property('balance')
        vendor.should.has.property('experience')
        vendor.should.has.property('jajan_image_url')
        vendor.should.has.property('jajan_name')
        vendor.should.has.property('jajan_description')
        vendor.should.has.property('status')
        vendor.should.has.property('last_latitude')
        vendor.should.has.property('last_longitude')
        vendor.should.has.property('created_at')
        vendor.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/vendors?search=encoded', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('GET /api/v1/vendors/:id', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = vendorMock.data[0]
      const response = await agent
        .get(`/api/v1/vendors/${requestVendor.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestVendor.id)
      response.body.data.should.has.property('username').equal(requestVendor.username)
      response.body.data.should.has.property('full_name').equal(requestVendor.fullName)
      response.body.data.should.has.property('email').equal(requestVendor.email)
      response.body.data.should.has.property('gender').equal(requestVendor.gender)
      response.body.data.should.has.property('address').equal(requestVendor.address)
      response.body.data.should.has.property('balance').equal(requestVendor.balance)
      response.body.data.should.has.property('experience').equal(requestVendor.experience)
      response.body.data.should.has.property('jajan_image_url').equal(requestVendor.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestVendor.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestVendor.jajanDescription)
      response.body.data.should.has.property('status').equal(requestVendor.status)
      response.body.data.should.has.property('last_latitude').equal(requestVendor.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestVendor.lastLongitude)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('POST /api/v1/vendors', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: VendorManagementCreateRequest = new VendorManagementCreateRequest(
        vendorMock.data[0].fullName,
        vendorMock.data[0].gender,
        vendorMock.data[0].address,
        vendorMock.data[0].username,
        vendorMock.data[0].email,
        vendorMock.data[0].password,
        vendorMock.data[0].jajanImageUrl,
        vendorMock.data[0].jajanName,
        vendorMock.data[0].jajanDescription,
        vendorMock.data[0].status,
        vendorMock.data[0].lastLatitude,
        vendorMock.data[0].lastLongitude
      )

      const response = await agent
        .post('/api/v1/vendors')
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
      response.body.data.should.has.property('jajan_image_url').equal(requestBody.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestBody.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestBody.jajanDescription)
      response.body.data.should.has.property('status').equal(requestBody.status)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('PATCH /api/v1/vendors/:id', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = vendorMock.data[0]
      const requestBody: VendorManagementPatchRequest = new VendorManagementPatchRequest(
        `patched${requestVendor.fullName}`,
        'FEMALE',
        `patched${requestVendor.username}`,
        `patched${requestVendor.email}`,
        `patched${requestVendor.password}`,
        `${requestVendor.jajanImageUrl}patched`,
        `patched${requestVendor.jajanName}`,
        `patched${requestVendor.jajanDescription}`,
        'ON',
        requestVendor.lastLatitude + 1,
        requestVendor.lastLongitude + 1
      )

      const response = await agent
        .patch(`/api/v1/vendors/${requestVendor.id}`)
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
      response.body.data.should.has.property('address').equal(requestVendor.address)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('jajan_image_url').equal(requestBody.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestBody.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestBody.jajanDescription)
      response.body.data.should.has.property('status').equal(requestBody.status)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('DELETE /api/v1/vendors/:id', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = vendorMock.data[0]

      const response = await agent
        .delete(`/api/v1/vendors/${requestVendor.id}`)
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
      const result: Vendor | null = await oneDatastore.client.vendor.findFirst({
        where: {
          id: requestVendor.id
        }
      })
      assert.isNull(result)
    })
  })
})
