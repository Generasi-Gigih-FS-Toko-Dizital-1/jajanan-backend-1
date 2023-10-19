import chai from 'chai'
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
import UserLocationSyncRequest
  from '../../../../src/inners/models/value_objects/requests/locations/UserLocationSyncRequest'
import VendorLocationSyncRequest
  from '../../../../src/inners/models/value_objects/requests/locations/VendorLocationSyncRequest'

chai.use(chaiHttp)
chai.should()

describe('LocationControllerRest', () => {
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

  describe('POST /api/v1/locations/sync-user', () => {
    it('should return 200 OK', async () => {
      const requestUser = oneSeeder.userMock.data[0]
      const requestBody: UserLocationSyncRequest = new UserLocationSyncRequest(
        requestUser.id,
        1,
        1,
        25
      )
      const includeInput: any = {
        notificationHistories: true,
        jajanItems: true,
        jajanItemSnapshots: true,
        payoutHistories: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent.post(`/api/v1/locations/sync-user?include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.have.status(200)
      response.body.should.be.an('object')
      response.body.should.have.property('message')
      response.body.should.have.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.have.property('nearby_vendors').an('array')
    })
  })

  describe('POST /api/v1/locations/sync-vendor', () => {
    it('should return 200 OK', async () => {
      const requestVendor = oneSeeder.vendorMock.data[0]
      const requestBody: VendorLocationSyncRequest = new VendorLocationSyncRequest(
        requestVendor.id,
        1,
        1,
        25
      )
      const includeInput: any = {
        notificationHistories: true,
        topUpHistories: true,
        transactionHistories: true,
        userSubscriptions: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent.post(`/api/v1/locations/sync-vendor?include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.have.status(200)
      response.body.should.be.an('object')
      response.body.should.have.property('message')
      response.body.should.have.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.have.property('nearby_users').an('array')
    })
  })
})
