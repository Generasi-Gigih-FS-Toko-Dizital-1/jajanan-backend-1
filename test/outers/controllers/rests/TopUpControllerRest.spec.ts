import chai from 'chai'
import { beforeEach, describe, it } from 'mocha'
import waitUntil from 'async-wait-until'
import UserMock from '../../../mocks/UserMock'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import chaiHttp from 'chai-http'
import { type User } from '@prisma/client'
import fetchMock from 'fetch-mock'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import TopUpResponseMock from '../../../mocks/TopUpResponseMock'
import UserLoginByEmailAndPasswordRequest from '../../../../src/inners/models/value_objects/requests/authentications/users/UserLoginByEmailAndPasswordRequest'
import TopUpCreateRequest from '../../../../src/inners/models/value_objects/requests/top_up/TopUpCreateRequest'

chai.use(chaiHttp)
chai.should()

describe('TopUpControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()
  const topUpResponseMock = new TopUpResponseMock()
  let agent: ChaiHttp.Agent
  let authorization: Authorization

  before(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.createMany({
      data: userMock.data
    })

    fetchMock.mock('https://api.xendit.co/v2/invoices/', topUpResponseMock.data)
  })

  beforeEach(async () => {
    agent = chai.request.agent(server)
    const requestAuthUser: User = userMock.data[0]
    const requestBodyLogin: UserLoginByEmailAndPasswordRequest = new UserLoginByEmailAndPasswordRequest(
      requestAuthUser.email,
      requestAuthUser.password
    )
    const response = await agent
      .post('/api/v1/authentications/users/login?method=email_and_password')
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
    await oneDatastore.client.user.deleteMany({
      where: {
        id: {
          in: userMock.data.map((user: User) => user.id)
        }
      }
    })
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/topup', () => {
    it('should return 201', async () => {
      const requestBody = new TopUpCreateRequest(
        userMock.data[0].id,
        20000
      )
      const res = await agent.post('/api/v1/topup')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)
      res.should.have.status(201)
      res.body.data.should.be.an('object')
      res.body.data.should.have.property('redirect_url')
    })
  })
})
