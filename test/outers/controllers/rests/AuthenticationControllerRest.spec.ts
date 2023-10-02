import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import RegisterByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/RegisterByEmailAndPasswordRequest'
import { type User } from '@prisma/client'
import _ from 'underscore'

chai.use(chaiHttp)
chai.should()

describe('AuthenticationControllerRest', () => {
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
    await oneDatastore.client.user.deleteMany(
      {
        where: {
          id: {
            in: userMock.data.map((user: User) => user.id)
          }
        }
      }
    )
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/authentications/logins?method=email_and_password', () => {
    it('should return 200 OK', async () => {

    })

    it('should return 404 NOT FOUND: Unknown username', async () => {

    })

    it('should return 404 NOT FOUND: Unknown username or password', async () => {

    })
  })

  describe('POST /api/v1/authentications/registers?method=email_and_password', () => {
    it('should return 201 CREATED', async () => {
      const request: RegisterByEmailAndPasswordRequest = new RegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        'email2@mail.com',
        'password2',
        'address2'
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/registers?method=email_and_password')
        .send(request)

      response.should.have.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('username').equal(request.username)
      response.body.data.should.has.property('full_name').equal(request.fullName)
      response.body.data.should.has.property('email').equal(request.email)
      response.body.data.should.has.property('gender').equal(request.gender)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }
      await oneDatastore.client.user.deleteMany({
        where: {
          email: request.email,
          username: request.username
        }
      })
    })

    it('should return 409 CONFLICT: Email already exists', async () => {
      const request: RegisterByEmailAndPasswordRequest = new RegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        userMock.data[0].email,
        'password2',
        'address2'
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/registers?method=email_and_password')
        .send(request)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })

    it('should return 409 CONFLICT: Username already exists', async () => {
      const request: RegisterByEmailAndPasswordRequest = new RegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        userMock.data[0].username,
        'email2',
        'password2',
        'address2'
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/registers?method=email_and_password')
        .send(request)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })
})
