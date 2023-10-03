import chai from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import AdminMock from '../../../mocks/AdminMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import { type Admin } from '@prisma/client'
import type Session from '../../../../src/inners/models/value_objects/Session'
import cookie from 'cookie'

chai.use(chaiHttp)
chai.should()

describe('AdminAuthenticationControllerRest', () => {
  const adminMock: AdminMock = new AdminMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.admin.createMany({
      data: adminMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.admin.deleteMany(
      {
        where: {
          id: {
            in: adminMock.data.map((admin: Admin) => admin.id)
          }
        }
      }
    )
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/authentications/admins/login?method=email_and_password', () => {
    it('should return 200 OK', async () => {
      const requestAdmin = adminMock.data[0]
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send({
          email: requestAdmin.email,
          password: requestAdmin.password
        })

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.has.property('access_token')
      response.body.data.should.has.property('refresh_token')

      const cookies = cookie.parse(response.headers['set-cookie'][0])
      const session: Session = JSON.parse(cookies.session)
      session.should.be.an('object')
      session.should.has.property('accessToken').equal(response.body.data.access_token)
      session.should.has.property('refreshToken').equal(response.body.data.refresh_token)
      session.should.has.property('accountId').equal(requestAdmin.id)
      session.should.has.property('accountType').equal('ADMIN')
      session.should.has.property('expiredAt')
    })

    it('should return 404 NOT FOUND: Unknown email', async () => {
      const requestAdmin = adminMock.data[0]
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send({
          email: 'unknown_email',
          password: requestAdmin.password
        })

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })

    it('should return 404 NOT FOUND: Unknown email or password', async () => {
      const requestAdmin = adminMock.data[0]
      const response = await chai
        .request(server)
        .post('/api/v1/authentications/admins/login?method=email_and_password')
        .send({
          email: requestAdmin.email,
          password: 'unknown_password'
        })

      response.should.has.status(404)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data').equal(null)
    })
  })
})
