import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import AdminMock from '../../../mocks/AdminMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import AdminManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/admin_managements/AdminManagementCreateRequest'
import { type Admin } from '@prisma/client'
import AdminManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/admin_managements/AdminManagementPatchRequest'

chai.use(chaiHttp)
chai.should()

describe('AdminControllerRest', () => {
  const adminMock: AdminMock = new AdminMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.admin.createMany({
      data: adminMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.admin.deleteMany(
      {
        where: {
          id: {
            in: adminMock.data.map((admin: Admin) => admin.id)
          }
        }
      }
    )
    await oneDatastore.disconnect()
  })

  describe('GET /api/v1/admins?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = adminMock.data.length
      const response = await chai
        .request(server)
        .get(`/api/v1/admins?page_number=${pageNumber}&page_size=${pageSize}`)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_admins')
      response.body.data.should.has.property('admins')
      response.body.data.admins.should.be.a('array')
      response.body.data.admins.length.should.be.equal(pageSize)
      response.body.data.admins.forEach((admin: Admin) => {
        admin.should.has.property('id')
        admin.should.has.property('full_name')
        admin.should.has.property('email')
        admin.should.has.property('gender')
        admin.should.has.property('created_at')
        admin.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/admins?search=encoded', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('GET /api/v1/admins/:id', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = adminMock.data[0]
      const response = await chai
        .request(server)
        .get(`/api/v1/admins/${requestAdmin.id}`)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestAdmin.id)
      response.body.data.should.has.property('full_name').equal(requestAdmin.fullName)
      response.body.data.should.has.property('email').equal(requestAdmin.email)
      response.body.data.should.has.property('gender').equal(requestAdmin.gender)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('POST /api/v1/admins', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: AdminManagementCreateRequest = new AdminManagementCreateRequest(
        adminMock.data[0].fullName,
        adminMock.data[0].gender,
        adminMock.data[0].email,
        adminMock.data[0].password
      )

      const response = await chai
        .request(server)
        .post('/api/v1/admins')
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('PATCH /api/v1/admins/:id', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = adminMock.data[0]
      const requestBody: AdminManagementPatchRequest = new AdminManagementPatchRequest(
        `patched${requestAdmin.fullName}`,
        'FEMALE',
        `patched${requestAdmin.email}`,
        `patched${requestAdmin.password}`
      )

      const response = await chai
        .request(server)
        .patch(`/api/v1/admins/${requestAdmin.id}`)
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('DELETE /api/v1/admins/:id', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = adminMock.data[0]

      const response = await chai
        .request(server)
        .delete(`/api/v1/admins/${requestAdmin.id}`)

      response.should.has.status(200)
      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const result: Admin | null = await oneDatastore.client.admin.findFirst({
        where: {
          id: requestAdmin.id
        }
      })
      assert.isNull(result)
    })
  })
})
