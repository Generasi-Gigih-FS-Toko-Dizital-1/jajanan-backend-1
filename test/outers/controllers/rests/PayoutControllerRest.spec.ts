import chai from 'chai'
import { beforeEach, describe, it } from 'mocha'
import waitUntil from 'async-wait-until'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import chaiHttp from 'chai-http'
import { type Vendor } from '@prisma/client'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import VendorMock from '../../../mocks/VendorMock'
import PayoutResponseMock from '../../../mocks/PayoutResponseMock'
import VendorLoginByEmailAndPasswordRequest from '../../../../src/inners/models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import type PayoutCreateRequest from '../../../../src/inners/models/value_objects/requests/payouts/PayoutCreateRequest'
import axios from 'axios'
import MockAdafter from 'axios-mock-adapter'

chai.use(chaiHttp)
chai.should()
const mock = new MockAdafter(axios)

describe('PayoutControllerRest', () => {
  const vendorMock: VendorMock = new VendorMock()
  const oneDatastore = new OneDatastore()
  let agent: ChaiHttp.Agent
  let authorization: Authorization
  const payoutResponseMock = new PayoutResponseMock()

  before(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }

    await oneDatastore.client.vendor.createMany({
      data: vendorMock.data
    })

    mock.onPost('https://api.xendit.co/payouts').reply(201, payoutResponseMock.data)
  })

  beforeEach(async () => {
    agent = chai.request.agent(server)
    const requestAuthVendor: Vendor = vendorMock.data[0]
    const requestBodyLogin: VendorLoginByEmailAndPasswordRequest = new VendorLoginByEmailAndPasswordRequest(
      requestAuthVendor.email,
      requestAuthVendor.password
    )
    const response = await agent
      .post('/api/v1/authentications/vendors/login?method=email_and_password')
      .send(requestBodyLogin)

    authorization = new Authorization(
      response.body.data.session.access_token,
      'Bearer'
    )
  })

  after(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.vendorPayout.deleteMany({
      where: {
        vendorId: {
          in: vendorMock.data.map((vendor: Vendor) => vendor.id)
        }
      }
    })
    await oneDatastore.client.vendor.deleteMany({
      where: {
        id: {
          in: vendorMock.data.map((vendor: Vendor) => vendor.id)
        }
      }
    })
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/payouts', () => {
    it('should return 201', async () => {
      const requestBody: PayoutCreateRequest = {
        amount: 10000,
        vendorId: vendorMock.data[0].id
      }
      const response = await agent
        .post('/api/v1/payouts')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      console.log(response.body)

      response.should.have.status(201)
      response.body.should.be.a('object')
      response.body.should.have.property('data')
      response.body.should.have.property('message')
      response.body.data.should.be.an('object')
      response.body.data.should.have.property('redirect_url')
    })
  })
})
