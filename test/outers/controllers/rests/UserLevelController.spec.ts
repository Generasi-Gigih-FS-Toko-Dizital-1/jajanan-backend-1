import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import { type Admin, type Prisma, type UserLevel } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import UserLevelManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/user_level_managements/UserLevelManagementPatchRequest'
import UserLevelManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/user_level_managements/UserLevelManagementCreateRequest'

chai.use(chaiHttp)
chai.should()

describe('UserLevelControllerRest', () => {
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

  describe('GET /api/v1/user-levels?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.userLevelMock.data.length
      const response = await agent
        .get(`/api/v1/user-levels?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_user_levels')
      response.body.data.should.has.property('user_levels')
      response.body.data.user_levels.should.be.an('array')
      response.body.data.user_levels.length.should.equal(pageSize)
      response.body.data.user_levels.forEach((userLevel: any) => {
        userLevel.should.has.property('id')
        userLevel.should.has.property('name')
        userLevel.should.has.property('minimum_experience')
        userLevel.should.has.property('icon_url')
        userLevel.should.has.property('updated_at')
        userLevel.should.has.property('created_at')
      })
    })
  })

  describe('GET /api/v1/user-levels?page_number={}&page_size={}&&where={}', () => {
    it('should return 200 OK', async () => {
      const requestUserLevel: UserLevel = oneSeeder.userLevelMock.data[0]
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.userLevelMock.data.length
      const whereInput: any = {
        id: requestUserLevel.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/user-levels?page_number=${pageNumber}&page_size=${pageSize}&where=${where}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('total_user_levels')
      response.body.data.should.has.property('user_levels')
      response.body.data.user_levels.should.be.an('array')
      response.body.data.user_levels.length.should.equal(1)
      response.body.data.user_levels.forEach((userLevel: any) => {
        userLevel.should.has.property('id').equal(requestUserLevel.id)
        userLevel.should.has.property('name').equal(requestUserLevel.name)
        userLevel.should.has.property('minimum_experience').equal(requestUserLevel.minimumExperience)
        userLevel.should.has.property('icon_url').equal(requestUserLevel.iconUrl)
        userLevel.should.has.property('updated_at').equal(requestUserLevel.updatedAt.toISOString())
        userLevel.should.has.property('created_at').equal(requestUserLevel.createdAt.toISOString())
      })
    })
  })

  describe('GET /api/v1/user-levels/:id', () => {
    it('should return 200 OK', async () => {
      const requestUserLevel: UserLevel = oneSeeder.userLevelMock.data[0]
      const response = await agent
        .get(`/api/v1/user-levels/${requestUserLevel.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestUserLevel.id)
      response.body.data.should.has.property('name').equal(requestUserLevel.name)
      response.body.data.should.has.property('minimum_experience').equal(requestUserLevel.minimumExperience)
      response.body.data.should.has.property('icon_url').equal(requestUserLevel.iconUrl)
      response.body.data.should.has.property('updated_at').equal(requestUserLevel.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestUserLevel.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/user-levels', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserLevelManagementCreateRequest = new UserLevelManagementCreateRequest(
        oneSeeder.userLevelMock.data[0].name,
        oneSeeder.userLevelMock.data[0].minimumExperience,
        oneSeeder.userLevelMock.data[0].iconUrl
      )

      const response = await agent
        .post('/api/v1/user-levels')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('name').equal(requestBody.name)
      response.body.data.should.has.property('minimum_experience').equal(requestBody.minimumExperience)
      response.body.data.should.has.property('icon_url').equal(requestBody.iconUrl)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.userLevel.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/user-levels/:id', () => {
    it('should return 200 OK', async () => {
      const requestUserLevel: UserLevel = oneSeeder.userLevelMock.data[0]
      const requestBody: UserLevelManagementPatchRequest = new UserLevelManagementPatchRequest(
        oneSeeder.userLevelMock.data[1].name,
        oneSeeder.userLevelMock.data[1].minimumExperience,
        'https://placehold.co/400x400?text=patched'
      )

      const response = await agent
        .patch(`/api/v1/user-levels/${requestUserLevel.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('name').equal(requestBody.name)
      response.body.data.should.has.property('minimum_experience').equal(requestBody.minimumExperience)
      response.body.data.should.has.property('icon_url').equal(requestBody.iconUrl)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('GET /api/v1/user-levels/experience/levels?experience={}', () => {
    it('should return 200 OK', async () => {
      const requestUserLevel: UserLevel = oneSeeder.vendorLevelMock.data[0]
      const requestVendorExp: number = requestUserLevel.minimumExperience
      const response = await agent
        .get(`/api/v1/user-levels/experience/levels?experience=${requestVendorExp}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('name').equal(requestUserLevel.name)
      response.body.data.should.has.property('minimum_experience').equal(requestUserLevel.minimumExperience)
      response.body.data.should.has.property('icon_url').equal(requestUserLevel.iconUrl)
    })
  })

  describe('DELETE /api/v1/user-levels/:id', () => {
    it('should return 200 OK', async () => {
      const requestUserLevel: UserLevel = oneSeeder.userLevelMock.data[0]
      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }

      const response = await agent
        .delete(`/api/v1/user-levels/${requestUserLevel.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: UserLevel | null = await oneDatastore.client.userLevel.findFirst({
        where: {
          id: requestUserLevel.id
        }
      })
      assert.isNull(result)
    })
  })
})
