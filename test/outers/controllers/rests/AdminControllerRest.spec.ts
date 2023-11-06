import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import AdminMock from '../../../mocks/AdminMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import AdminManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/admin_managements/AdminManagementCreateRequest'
import { type Admin, type Prisma } from '@prisma/client'
import AdminManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/admin_managements/AdminManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('AdminControllerRest', () => {
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

  describe('GET /api/v1/admins?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.adminMock.data.length

      const response = await agent
        .get(`/api/v1/admins?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_admins')
      response.body.data.should.has.property('admins')
      response.body.data.admins.should.be.a('array')
      response.body.data.admins.length.should.be.equal(pageSize)
      response.body.data.admins.forEach((admin: any) => {
        admin.should.has.property('id')
        admin.should.has.property('full_name')
        admin.should.has.property('email')
        admin.should.has.property('gender')
        admin.should.has.property('created_at')
        admin.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/admins?page_number={}&page_size={}&where={}', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = oneSeeder.adminMock.data[0]
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.adminMock.data.length
      const whereInput: any = {
        id: requestAdmin.id
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))

      const response = await agent
        .get(`/api/v1/admins?page_number=${pageNumber}&page_size=${pageSize}&where=${where}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_admins')
      response.body.data.should.has.property('admins')
      response.body.data.admins.should.be.a('array')
      response.body.data.admins.length.should.be.equal(1)
      response.body.data.admins.forEach((admin: any) => {
        admin.should.has.property('id').equal(requestAdmin.id)
        admin.should.has.property('full_name').equal(requestAdmin.fullName)
        admin.should.has.property('email').equal(requestAdmin.email)
        admin.should.has.property('gender').equal(requestAdmin.gender)
        admin.should.has.property('created_at').equal(requestAdmin.createdAt.toISOString())
        admin.should.has.property('updated_at').equal(requestAdmin.updatedAt.toISOString())
      })
    })
  })

  describe('GET /api/v1/admins/:id', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = oneSeeder.adminMock.data[0]

      const response = await agent
        .get(`/api/v1/admins/${requestAdmin.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestAdmin.id)
      response.body.data.should.has.property('full_name').equal(requestAdmin.fullName)
      response.body.data.should.has.property('email').equal(requestAdmin.email)
      response.body.data.should.has.property('gender').equal(requestAdmin.gender)
      response.body.data.should.has.property('updated_at').equal(requestAdmin.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestAdmin.updatedAt.toISOString())
    })
  })

  describe('POST /api/v1/admins', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: AdminManagementCreateRequest = new AdminManagementCreateRequest(
        oneSeeder.adminMock.data[0].fullName,
        oneSeeder.adminMock.data[0].gender,
        oneSeeder.adminMock.data[0].email,
        oneSeeder.adminMock.data[0].password
      )

      const response = await agent
        .post('/api/v1/admins')
        .set('Authorization', authorization.convertToString())
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
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.admin.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/admins/:id', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = oneSeeder.adminMock.data[0]
      const requestBody: AdminManagementPatchRequest = new AdminManagementPatchRequest(
        `patched${requestAdmin.fullName}`,
        'FEMALE',
        `patched${requestAdmin.email}`,
        `patched${requestAdmin.password}`,
        requestAdmin.password
      )

      const response = await agent
        .patch(`/api/v1/admins/${requestAdmin.id}`)
        .set('Authorization', authorization.convertToString())
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
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/admins/:id', () => {
    it('should return 200 OK', async () => {
      const requestAdmin: Admin = oneSeeder.adminMock.data[0]

      const response = await agent
        .delete(`/api/v1/admins/${requestAdmin.id}`)
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
      const result: Admin | null = await oneDatastore.client.admin.findFirst({
        where: {
          id: requestAdmin.id
        }
      })
      assert.isNull(result)
    })
  })
})
