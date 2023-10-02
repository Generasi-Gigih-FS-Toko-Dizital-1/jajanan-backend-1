import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import UserRegisterByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/users/UserRegisterByEmailAndPasswordRequest'
import { type User } from '@prisma/client'

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

  describe('POST /api/v1/authentications/users/logins?method=email_and_password', () => {
    it('should return 200 OK', async () => {

    })

    it('should return 404 NOT FOUND: Unknown email', async () => {

    })

    it('should return 404 NOT FOUND: Unknown email or password', async () => {

    })
  })

  describe('POST /api/v1/authentications/users/registers?method=email_and_password', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserRegisterByEmailAndPasswordRequest = new UserRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        'email2@mail.com',
        'password2',
        'address2',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/registers?method=email_and_password')
        .send(requestBody)

      response.should.have.status(201)
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

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }
      await oneDatastore.client.user.deleteMany({
        where: {
          email: requestBody.email,
          username: requestBody.username
        }
      })
    })

    it('should return 409 CONFLICT: Email already exists', async () => {
      const requestBody: UserRegisterByEmailAndPasswordRequest = new UserRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        userMock.data[0].email,
        'password2',
        'address2',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/registers?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })

    it('should return 409 CONFLICT: Username already exists', async () => {
      const requestBody: UserRegisterByEmailAndPasswordRequest = new UserRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        userMock.data[0].username,
        'email2',
        'password2',
        'address2',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/registers?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })
})
