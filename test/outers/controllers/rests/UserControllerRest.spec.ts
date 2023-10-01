import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'
import { server } from '../../../../src/App'
import humps from 'humps'
import waitUntil from 'async-wait-until'
import UserManagementCreateRequest from '../../../../src/inners/models/value_objects/requests/user_managements/UserManagementCreateRequest'
import { type User } from '@prisma/client'

chai.use(chaiHttp)
chai.should()

describe('UserControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
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
    await oneDatastore.client.user.deleteMany()
    await oneDatastore.disconnect()
  })

  describe('GET /api/v1/users', () => {
    it('should return 200 OK', async () => {
      const response = await chai.request(server).get(`/api/v1/users?page=1&per_page=${userMock.data.length}`)
      response.should.have.status(200)
      response.body.should.be.a('object')
      response.body.should.have.property('total_users')
      response.body.should.have.property('users')
      response.body.users.should.be.a('array')
      response.body.users.should.deep.include.members(
        userMock.data.map((userMock: any) => {
          return humps.decamelizeKeys(JSON.parse(JSON.stringify(userMock)))
        })
      )
    })
  })

  describe('GET /api/v1/users?search=encoded', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = userMock.data[0]
      const response = await chai.request(server).get(`/api/v1/users/${requestUser.id}`)
      response.should.have.status(200)
      response.body.should.be.a('object')
      response.body.should.have.property('id').equal(requestUser.id)
      response.body.should.have.property('username').equal(requestUser.username)
      response.body.should.have.property('full_name').equal(requestUser.fullName)
      response.body.should.have.property('email').equal(requestUser.email)
      response.body.should.have.property('gender').equal(requestUser.gender)
      response.body.should.have.property('balance').equal(requestUser.balance)
      response.body.should.have.property('experience').equal(requestUser.experience)
      response.body.should.have.property('last_latitude').equal(requestUser.lastLatitude)
      response.body.should.have.property('last_longitude').equal(requestUser.lastLongitude)
    })
  })

  describe('POST /api/v1/users', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserManagementCreateRequest = new UserManagementCreateRequest(
        userMock.data[0].username,
        userMock.data[0].fullName,
        userMock.data[0].email,
        userMock.data[0].password,
        userMock.data[0].gender
      )
      const response = await chai.request(server).post('/api/v1/users').type('application/json').send(requestBody)
      response.should.be.a('object')
      response.body.should.have.property('id')
      response.body.should.have.property('username').equal(requestBody.username)
      response.body.should.have.property('full_name').equal(requestBody.fullName)
      response.body.should.have.property('email').equal(requestBody.email)
      response.body.should.have.property('gender').equal(requestBody.gender)
      response.should.have.status(201)
    })
  })

  describe('PATCH /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = userMock.data[0]
      const requestBody: any = {
        fullName: 'new fullname',
        username: 'new username',
        password: 'newPassword',
        email: 'newemail@gmail.com',
        gender: 'FEMALE'
      }
      const response = await chai.request(server).patch(`/api/v1/users/${requestUser.id}`).send(requestBody)
      response.should.have.status(200)
      response.should.be.a('object')
      response.body.should.have.property('id')
      response.body.should.have.property('username').equal(requestBody.username)
      response.body.should.have.property('full_name').equal(requestBody.fullName)
      response.body.should.have.property('email').equal(requestBody.email)
      response.body.should.have.property('gender').equal(requestBody.gender)
    })
  })

  describe('DELETE /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {
      const requestUser: User = userMock.data[0]
      const response = await chai.request(server).delete(`/api/v1/users/${requestUser.id}`)
      response.should.have.status(200)
      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const result: User | null = await oneDatastore.client.user.findFirst({
        where: {
          id: requestUser.id
        }
      })
      assert.equal(result, null)
    })
  })
})
