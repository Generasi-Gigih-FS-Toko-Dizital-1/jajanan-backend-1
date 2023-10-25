import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import UserRegisterByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/users/UserRegisterByEmailAndPasswordRequest'
import { type Prisma } from '@prisma/client'
import UserLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/users/UserLoginByEmailAndPasswordRequest'
import UserRefreshAccessTokenRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/users/UserRefreshAccessTokenRequest'
import { randomUUID } from 'crypto'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('UserAuthenticationControllerRest', () => {
  const oneDatastore: OneDatastore = new OneDatastore()
  let oneSeeder: OneSeeder

  // const firebaseConfig: any = {
  //   apiKey: process.env.FIREBASE_API_KEY,
  //   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  //   projectId: process.env.FIREBASE_PROJECT_ID,
  //   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  //   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  //   appId: process.env.FIREBASE_APP_ID,
  //   measurementId: process.env.FIREBASE_MEASUREMENT_ID
  // }
  // const app: firebaseApp.FirebaseApp = firebaseApp.initializeApp(firebaseConfig)
  // const messaging: firebaseMessaging.Messaging = firebaseMessaging.getMessaging(app)
  const firebaseToken: string = randomUUID()

  before(async () => {
    await waitUntil(() => server !== undefined)
    await oneDatastore.connect()
    oneSeeder = new OneSeeder(oneDatastore)
    // firebaseToken = await firebaseMessaging.getToken(messaging)
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

  describe('POST /api/v1/authentications/users/login?method=email_and_password', () => {
    it('should return 200 OK', async () => {
      const requestUser = oneSeeder.userMock.data[0]
      const requestBodyLogin: UserLoginByEmailAndPasswordRequest = new UserLoginByEmailAndPasswordRequest(
        requestUser.email,
        requestUser.password,
        firebaseToken
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/login?method=email_and_password')
        .send(requestBodyLogin)

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
    })

    it('should return 404 NOT FOUND: Unknown email', async () => {
      const requestUser = oneSeeder.userMock.data[0]
      const requestBodyLogin: UserLoginByEmailAndPasswordRequest = new UserLoginByEmailAndPasswordRequest(
        'unknown_email',
        requestUser.password,
        firebaseToken
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })

    it('should return 404 NOT FOUND: Unknown email or password', async () => {
      const requestUser = oneSeeder.userMock.data[0]
      const requestBodyLogin: UserLoginByEmailAndPasswordRequest = new UserLoginByEmailAndPasswordRequest(
        requestUser.email,
        'unknown_password',
        firebaseToken
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/login?method=email_and_password')
        .send(requestBodyLogin)

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })
  })

  describe('POST /api/v1/authentications/users/register?method=email_and_password', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: UserRegisterByEmailAndPasswordRequest = new UserRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        randomUUID(),
        `${randomUUID()}@mail.com`,
        'password2',
        'address2',
        2,
        2
      )

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }

      await oneDatastore.client.user.deleteMany({
        where: {
          email: requestBody.email,
          username: requestBody.username
        }
      })

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/register?method=email_and_password')
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
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.user.deleteMany({
        where: {
          username: requestBody.username,
          email: requestBody.email
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })

    it('should return 409 CONFLICT: Email already exists', async () => {
      const requestBody: UserRegisterByEmailAndPasswordRequest = new UserRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        oneSeeder.userMock.data[0].email,
        'password2',
        'address2',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/register?method=email_and_password')
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
        oneSeeder.userMock.data[0].username,
        'email2',
        'password2',
        'address2',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/register?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })

  describe('POST /api/v1/authentications/users/refreshes/access-token', () => {
    it('should return 200 OK', async () => {
      const requestUser = oneSeeder.userMock.data[0]
      const requestBodyLogin: UserLoginByEmailAndPasswordRequest = new UserLoginByEmailAndPasswordRequest(
        requestUser.email,
        requestUser.password,
        firebaseToken
      )

      const responseLogin = await chai
        .request(server)
        .post('/api/v1/authentications/users/login?method=email_and_password')
        .send(requestBodyLogin)

      responseLogin.should.has.status(200)
      responseLogin.body.should.be.an('object')
      responseLogin.body.should.has.property('message')
      responseLogin.body.should.has.property('data')
      responseLogin.body.data.should.has.property('session')
      responseLogin.body.data.session.should.be.an('object')
      responseLogin.body.data.session.should.has.property('account_id').equal(requestUser.id)
      responseLogin.body.data.session.should.has.property('account_type').equal('USER')
      responseLogin.body.data.session.should.has.property('access_token')
      responseLogin.body.data.session.should.has.property('refresh_token')
      responseLogin.body.data.session.should.has.property('expired_at')
      responseLogin.body.data.session.should.has.property('firebase_token').equal(firebaseToken)

      const requestBodyRefreshAccessToken: UserRefreshAccessTokenRequest = new UserRefreshAccessTokenRequest(
        responseLogin.body.data.session
      )
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/refreshes/access-token')
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
      response.body.data.session.should.has.property('firebase_token').equal(firebaseToken)
    })
  })

  describe('POST /api/v1/authentications/users/logout', () => {
    it('should return 200 OK', async () => {
      const requestUser = oneSeeder.userMock.data[0]
      const requestBodyLogin: UserLoginByEmailAndPasswordRequest = new UserLoginByEmailAndPasswordRequest(
        requestUser.email,
        requestUser.password,
        firebaseToken
      )

      const responseLogin = await chai
        .request(server)
        .post('/api/v1/authentications/users/login?method=email_and_password')
        .send(requestBodyLogin)

      responseLogin.should.has.status(200)
      responseLogin.body.should.be.an('object')
      responseLogin.body.should.has.property('message')
      responseLogin.body.should.has.property('data')
      responseLogin.body.data.should.has.property('session')
      responseLogin.body.data.session.should.be.an('object')
      responseLogin.body.data.session.should.has.property('account_id').equal(requestUser.id)
      responseLogin.body.data.session.should.has.property('account_type').equal('USER')
      responseLogin.body.data.session.should.has.property('access_token')
      responseLogin.body.data.session.should.has.property('refresh_token')
      responseLogin.body.data.session.should.has.property('expired_at')
      responseLogin.body.data.session.should.has.property('firebase_token').equal(firebaseToken)

      const requestBodyRefreshAccessToken: UserRefreshAccessTokenRequest = new UserRefreshAccessTokenRequest(
        responseLogin.body.data.session
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/users/logout')
        .send(requestBodyRefreshAccessToken)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })
})
