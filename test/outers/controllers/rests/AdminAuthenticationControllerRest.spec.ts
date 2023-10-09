import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import AdminRefreshAccessTokenRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminRefreshAccessTokenRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('AdminAuthenticationControllerRest', () => {
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

  describe('POST /api/v1/authentications/admins/login?method=email_and_password', () => {
    it('should return 200 OK', async () => {
      const requestAdmin = oneSeeder.adminMock.data[0]
      const requestBodyLogin: AdminLoginByEmailAndPasswordRequest = new AdminLoginByEmailAndPasswordRequest(
        requestAdmin.email,
        requestAdmin.password
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('session')
      response.body.data.session.should.be.an('object')
      response.body.data.session.should.has.property('account_id').equal(requestAdmin.id)
      response.body.data.session.should.has.property('account_type').equal('ADMIN')
      response.body.data.session.should.has.property('access_token')
      response.body.data.session.should.has.property('refresh_token')
      response.body.data.session.should.has.property('expired_at')
    })

    it('should return 404 NOT FOUND: Unknown email', async () => {
      const requestAdmin = oneSeeder.adminMock.data[0]
      const requestBodyLogin: AdminLoginByEmailAndPasswordRequest = new AdminLoginByEmailAndPasswordRequest(
        'unknown_email',
        requestAdmin.password
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })

    it('should return 404 NOT FOUND: Unknown email or password', async () => {
      const requestAdmin = oneSeeder.adminMock.data[0]
      const requestBodyLogin: AdminLoginByEmailAndPasswordRequest = new AdminLoginByEmailAndPasswordRequest(
        requestAdmin.email,
        'unknown_password'
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })
  })

  describe('POST /api/v1/authentications/admins/refreshes/access-token', () => {
    it('should return 200 OK', async () => {
      const requestAdmin = oneSeeder.adminMock.data[0]
      const requestBodyLogin: AdminLoginByEmailAndPasswordRequest = new AdminLoginByEmailAndPasswordRequest(
        requestAdmin.email,
        requestAdmin.password
      )
      const responseLogin = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send(requestBodyLogin)

      responseLogin.should.has.status(200)
      responseLogin.body.should.be.an('object')
      responseLogin.body.should.has.property('message')
      responseLogin.body.should.has.property('data')
      responseLogin.body.data.should.has.property('session')
      responseLogin.body.data.session.should.be.an('object')
      responseLogin.body.data.session.should.has.property('account_id').equal(requestAdmin.id)
      responseLogin.body.data.session.should.has.property('account_type').equal('ADMIN')
      responseLogin.body.data.session.should.has.property('access_token')
      responseLogin.body.data.session.should.has.property('refresh_token')
      responseLogin.body.data.session.should.has.property('expired_at')

      const requestBodyRefreshAccessToken: AdminRefreshAccessTokenRequest = new AdminRefreshAccessTokenRequest(
        responseLogin.body.data.session
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/refreshes/access-token')
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

  describe('POST /api/v1/authentications/admins/logout', () => {
    it('should return 200 OK', async () => {
      const requestAdmin = oneSeeder.adminMock.data[0]
      const requestBodyLogin: AdminLoginByEmailAndPasswordRequest = new AdminLoginByEmailAndPasswordRequest(
        requestAdmin.email,
        requestAdmin.password
      )
      const responseLogin = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send(requestBodyLogin)

      responseLogin.should.has.status(200)
      responseLogin.body.should.be.an('object')
      responseLogin.body.should.has.property('message')
      responseLogin.body.should.has.property('data')
      responseLogin.body.data.should.has.property('session')
      responseLogin.body.data.session.should.be.an('object')
      responseLogin.body.data.session.should.has.property('account_id').equal(requestAdmin.id)
      responseLogin.body.data.session.should.has.property('account_type').equal('ADMIN')
      responseLogin.body.data.session.should.has.property('access_token')
      responseLogin.body.data.session.should.has.property('refresh_token')
      responseLogin.body.data.session.should.has.property('expired_at')

      const requestBodyRefreshAccessToken: AdminRefreshAccessTokenRequest = new AdminRefreshAccessTokenRequest(
        responseLogin.body.data.session
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/logout')
        .send(requestBodyRefreshAccessToken)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })
})
