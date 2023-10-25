import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import VendorRegisterByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { type Prisma } from '@prisma/client'
import VendorLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import VendorRefreshAccessTokenRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/vendors/VendorRefreshAccessTokenRequest'
import { randomUUID } from 'crypto'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('VendorAuthenticationControllerRest', () => {
  const oneDatastore: OneDatastore = new OneDatastore()
  let oneSeeder: OneSeeder

  before(async () => {
    await waitUntil(() => server !== undefined)
    await oneDatastore.connect()
    oneSeeder = new OneSeeder(oneDatastore)
  })

  beforeEach(async () => {
    await oneSeeder.up()
  })

  afterEach(async () => {
    await oneSeeder.down()
  })

  after(async () => {
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/authentications/vendors/login?method=email_and_password', () => {
    it('should return 200 OK', async () => {
      const requestVendor = oneSeeder.vendorMock.data[0]
      const requestBodyLogin: VendorLoginByEmailAndPasswordRequest = new VendorLoginByEmailAndPasswordRequest(
        requestVendor.email,
        requestVendor.password
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('session')
      response.body.data.session.should.be.an('object')
      response.body.data.session.should.has.property('account_id').equal(requestVendor.id)
      response.body.data.session.should.has.property('account_type').equal('VENDOR')
      response.body.data.session.should.has.property('access_token')
      response.body.data.session.should.has.property('refresh_token')
      response.body.data.session.should.has.property('expired_at')
    })

    it('should return 404 NOT FOUND: Unknown email', async () => {
      const requestVendor = oneSeeder.vendorMock.data[0]
      const requestBodyLogin: VendorLoginByEmailAndPasswordRequest = new VendorLoginByEmailAndPasswordRequest(
        'unknown_email',
        requestVendor.password
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })

    it('should return 404 NOT FOUND: Unknown email or password', async () => {
      const requestVendor = oneSeeder.vendorMock.data[0]
      const requestBodyLogin: VendorLoginByEmailAndPasswordRequest = new VendorLoginByEmailAndPasswordRequest(
        requestVendor.email,
        'unknown_password'
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })
  })

  describe('POST /api/v1/authentications/vendors/register?method=email_and_password', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: VendorRegisterByEmailAndPasswordRequest = new VendorRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        randomUUID(),
        `${randomUUID()}@mail.com`,
        'password2',
        'address2',
        'https://placehold.co/400x400?text=jajanImageUrl2',
        'jajanName2',
        'jajanDescription2',
        'OFF',
        2,
        2
      )

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }
      await oneDatastore.client.vendor.deleteMany({
        where: {
          email: requestBody.email,
          username: requestBody.username
        }
      })

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/register?method=email_and_password')
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
      response.body.data.should.has.property('address').equal(requestBody.address)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('jajan_image_url').equal(requestBody.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestBody.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestBody.jajanDescription)
      response.body.data.should.has.property('status').equal(requestBody.status)
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.vendor.deleteMany({
        where: {
          username: requestBody.username,
          email: requestBody.email
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })

    it('should return 409 CONFLICT: Email already exists', async () => {
      const requestBody: VendorRegisterByEmailAndPasswordRequest = new VendorRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        oneSeeder.vendorMock.data[0].email,
        'password2',
        'address2',
        'https://placehold.co/400x400?text=jajanImageUrl2',
        'jajanName2',
        'jajanDescription2',
        'OFF',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/register?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })

    it('should return 409 CONFLICT: Username already exists', async () => {
      const requestBody: VendorRegisterByEmailAndPasswordRequest = new VendorRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        oneSeeder.vendorMock.data[0].username,
        'email2',
        'password2',
        'address2',
        'https://placehold.co/400x400?text=jajanImageUrl2',
        'jajanName2',
        'jajanDescription2',
        'OFF',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/register?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })

  describe('POST /api/v1/authentications/vendors/refreshes/access-token', () => {
    it('should return 200 OK', async () => {
      const requestVendor = oneSeeder.vendorMock.data[0]
      const requestBodyLogin: VendorLoginByEmailAndPasswordRequest = new VendorLoginByEmailAndPasswordRequest(
        requestVendor.email,
        requestVendor.password
      )
      const responseLogin = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/login?method=email_and_password')
        .send(requestBodyLogin)

      responseLogin.should.has.status(200)
      responseLogin.body.should.be.an('object')
      responseLogin.body.should.has.property('message')
      responseLogin.body.should.has.property('data')
      responseLogin.body.data.should.has.property('session')
      responseLogin.body.data.session.should.be.an('object')
      responseLogin.body.data.session.should.has.property('account_id').equal(requestVendor.id)
      responseLogin.body.data.session.should.has.property('account_type').equal('VENDOR')
      responseLogin.body.data.session.should.has.property('access_token')
      responseLogin.body.data.session.should.has.property('refresh_token')
      responseLogin.body.data.session.should.has.property('expired_at')

      const requestBodyRefreshAccessToken: VendorRefreshAccessTokenRequest = new VendorRefreshAccessTokenRequest(
        responseLogin.body.data.session
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/refreshes/access-token')
        .send(requestBodyRefreshAccessToken)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('session')
      response.body.data.session.should.be.an('object')
      response.body.data.session.should.has.property('account_id').equal(responseLogin.body.data.session.account_id)
      response.body.data.session.should.has.property('account_type').equal(responseLogin.body.data.session.account_type)
      response.body.data.session.should.has.property('access_token')
      response.body.data.session.should.has.property('refresh_token').equal(responseLogin.body.data.session.refresh_token)
      response.body.data.session.should.has.property('expired_at')
    })
  })

  describe('POST /api/v1/authentications/vendors/logout', () => {
    it('should return 200 OK', async () => {
      const requestVendor = oneSeeder.vendorMock.data[0]
      const requestBodyLogin: VendorLoginByEmailAndPasswordRequest = new VendorLoginByEmailAndPasswordRequest(
        requestVendor.email,
        requestVendor.password
      )
      const responseLogin = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/login?method=email_and_password')
        .send(requestBodyLogin)

      responseLogin.should.has.status(200)
      responseLogin.body.should.be.an('object')
      responseLogin.body.should.has.property('message')
      responseLogin.body.should.has.property('data')
      responseLogin.body.data.should.has.property('session')
      responseLogin.body.data.session.should.be.an('object')
      responseLogin.body.data.session.should.has.property('account_id').equal(requestVendor.id)
      responseLogin.body.data.session.should.has.property('account_type').equal('VENDOR')
      responseLogin.body.data.session.should.has.property('access_token')
      responseLogin.body.data.session.should.has.property('refresh_token')
      responseLogin.body.data.session.should.has.property('expired_at')

      const requestBodyRefreshAccessToken: VendorRefreshAccessTokenRequest = new VendorRefreshAccessTokenRequest(
        responseLogin.body.data.session
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/logout')
        .send(requestBodyRefreshAccessToken)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })
})
