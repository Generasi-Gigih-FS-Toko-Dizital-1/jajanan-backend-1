import chai from 'chai'
import { beforeEach, describe, it } from 'mocha'
import waitUntil from 'async-wait-until'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import chaiHttp from 'chai-http'
import { type Admin, type User } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import TopUpCreateRequest from '../../../../src/inners/models/value_objects/requests/top_ups/TopUpCreateRequest'
import AdminMock from '../../../mocks/AdminMock'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'

chai.use(chaiHttp)
chai.should()

describe('TopUpControllerRest', () => {
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

  describe('POST /api/v1/top-ups', () => {
    it('should return 201', async () => {
      const requestUser: User = oneSeeder.userMock.data[0]
      const requestBody = new TopUpCreateRequest(
        requestUser.id,
        20000
      )
      const response = await agent.post('/api/v1/top-ups')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)
      response.should.have.status(201)
      response.body.should.be.an('object')
      response.body.should.have.property('message')
      response.body.should.have.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.have.property('redirect_url')
    })
  })
})
