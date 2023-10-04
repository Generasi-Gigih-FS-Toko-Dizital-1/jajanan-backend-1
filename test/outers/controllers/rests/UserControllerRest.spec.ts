import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import UserManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/user_managements/UserManagementCreateRequest'
import { type User } from '@prisma/client'
import UserManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/user_managements/UserManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'

chai.use(chaiHttp)
chai.should()

describe('UserControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const authUserMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()
  let agent: ChaiHttp.Agent
  let authorization: Authorization

  before(async () => {
    await waitUntil(() => server !== undefined)
    await oneDatastore.connect()

    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.createMany({
      data: authUserMock.data
    })

    agent = chai.request.agent(server)
    const requestUser = authUserMock.data[0]
    const response = await agent
      .post('/api/v1/authentications/users/login?method=email_and_password')
      .send({
        email: requestUser.email,
        password: requestUser.password
      })

    response.should.has.status(200)
    response.body.should.be.an('object')
    response.body.should.has.property('message')
    response.body.should.has.property('data')
    response.body.data.should.has.property('session')
    response.body.data.session.should.be.an('object')
    response.body.data.session.should.has.property('account_id').equal(requestUser.id)
    response.body.data.session.should.has.property('account_type').equal('USER')
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
    await oneDatastore.client.user.createMany({
      data: userMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.deleteMany(
      {
        where: {
          id: {
            in: userMock.data.map((user: User) => user.id)
          }
        }
      }
    )
  })

  after(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.deleteMany(
      {
        where: {
          id: {
            in: authUserMock.data.map((user: User) => user.id)
          }
        }
      }
    )
    await oneDatastore.disconnect()
  })

  describe('GET /api/v1/users?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = userMock.data.length
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
      response.body.data.users.forEach((user: User) => {
        user.should.has.property('id')
        user.should.has.property('username')
        user.should.has.property('full_name')
        user.should.has.property('email')
        user.should.has.property('gender')
        user.should.has.property('balance')
        user.should.has.property('experience')
        user.should.has.property('last_latitude')
        user.should.has.property('last_longitude')
        user.should.has.property('created_at')
        user.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/users?search=encoded', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = userMock.data[0]
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
      response.body.data.should.has.property('balance').equal(requestUser.balance)
      response.body.data.should.has.property('experience').equal(requestUser.experience)
      response.body.data.should.has.property('last_latitude').equal(requestUser.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestUser.lastLongitude)
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('POST /api/v1/users', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserManagementCreateRequest = new UserManagementCreateRequest(
        userMock.data[0].fullName,
        userMock.data[0].gender,
        userMock.data[0].username,
        userMock.data[0].email,
        userMock.data[0].password,
        userMock.data[0].lastLatitude,
        userMock.data[0].lastLongitude
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
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')
    })
  })

  describe('PATCH /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = userMock.data[0]
      const requestBody: UserManagementPatchRequest = new UserManagementPatchRequest(
        `patched${requestUser.fullName}`,
        'FEMALE',
        `patched${requestUser.username}`,
        `patched${requestUser.email}`,
        `patched${requestUser.password}`,
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
      const requestUser: User = userMock.data[0]

      const response = await agent
        .delete(`/api/v1/users/${requestUser.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const result: User | null = await oneDatastore.client.user.findFirst({
        where: {
          id: requestUser.id
        }
      })
      assert.isNull(result)
    })
  })
})
