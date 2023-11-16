import chai from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import AdminMock from '../../../mocks/AdminMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import { type Admin } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('StatisticControllerRest', () => {
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

  describe('GET /api/v1/statistics/counts?entity=admin', () => {
    it('should return 200 OK', async () => {
      const whereInput: any = {
        deletedAt: null
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/statistics/counts?entity=admin&where=${where}`)
        .set('Authorization', authorization.convertToString())

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('count').greaterThan(0)
    })
  })

  describe('GET /api/v1/statistics/counts?entity=user', () => {
    it('should return 200 OK', async () => {
      const whereInput: any = {
        deletedAt: null
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/statistics/counts?entity=user&where=${where}`)
        .set('Authorization', authorization.convertToString())

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('count').greaterThan(0)
    })
  })

  describe('GET /api/v1/statistics/counts?entity=vendor', () => {
    it('should return 200 OK', async () => {
      const whereInput: any = {
        deletedAt: null
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/statistics/counts?entity=vendor&where=${where}`)
        .set('Authorization', authorization.convertToString())

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('count').greaterThan(0)
    })
  })

  describe('GET /api/v1/statistics/counts?entity=top_up_history', () => {
    it('should return 200 OK', async () => {
      const whereInput: any = {
        deletedAt: null
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/statistics/counts?entity=top_up_history&where=${where}`)
        .set('Authorization', authorization.convertToString())

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('count').greaterThan(0)
    })
  })

  describe('GET /api/v1/statistics/counts?entity=transaction_history', () => {
    it('should return 200 OK', async () => {
      const whereInput: any = {
        deletedAt: null
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/statistics/counts?entity=transaction_history&where=${where}`)
        .set('Authorization', authorization.convertToString())

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('count').greaterThan(0)
    })
  })

  describe('GET /api/v1/statistics/counts?entity=payout_history', () => {
    it('should return 200 OK', async () => {
      const whereInput: any = {
        deletedAt: null
      }
      const where = encodeURIComponent(JSON.stringify(whereInput))
      const response = await agent
        .get(`/api/v1/statistics/counts?entity=transaction_history&where=${where}`)
        .set('Authorization', authorization.convertToString())

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('count').greaterThan(0)
    })
  })
})
