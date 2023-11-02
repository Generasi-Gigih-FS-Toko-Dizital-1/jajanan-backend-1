import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import { type Admin } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'

chai.use(chaiHttp)
chai.should()

describe('FileControllerRest', () => {
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
      requestAuthAdmin.password
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

  describe('POST /api/v1/files', () => {
    it('should return 200 OK', async () => {
      const filePath: string = 'test/assets/400x400.svg'
      const uploadResponse: any = await new Promise((resolve, reject) => {
        agent.post('/api/v1/files')
          .set('Authorization', authorization.convertToString())
          .set('Content-Type', 'multipart/form-data')
          .attach('file', filePath)
          .end((error: any, response: any) => {
            if (error !== undefined && error !== null) {
              reject(new Error(error))
            } else {
              resolve(response)
            }
          })
      })

      uploadResponse.should.have.status(200)
      uploadResponse.body.should.be.an('object')
      uploadResponse.body.should.have.property('message')
      uploadResponse.body.should.have.property('data')
      uploadResponse.body.data.should.be.an('object')
      uploadResponse.body.data.should.have.property('url')

      describe('DELETE /api/v1/files', () => {
        it('should return 200 OK', async () => {
          const url: string = uploadResponse.body.data.url

          const deleteResponse = await agent.delete('/api/v1/files')
            .set('Authorization', authorization.convertToString())
            .query({ url })
            .send()

          deleteResponse.should.have.status(200)
          deleteResponse.body.should.be.an('object')
          deleteResponse.body.should.have.property('message')
          deleteResponse.body.should.have.property('data')
          assert.isNull(deleteResponse.body.data)
        })
      })
    })
  })
})
