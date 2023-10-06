import chai, { assert } from 'chai'
import { beforeEach, describe, it } from 'mocha'
import waitUntil from 'async-wait-until'
import UserMock from '../../../mocks/UserMock'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import chaiHttp from 'chai-http'
import nock from 'nock'
import { type User } from '@prisma/client'

chai.use(chaiHttp)
chai.should()

describe('TopUpControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.createMany({
      data: userMock.data
    })

    nock('https://app.sandbox.midtrans.com/snap/v1/transactions')
      .post('')
      .reply(201, {
        token: 'd379aa71-99eb-4dd1-b9bb-eefe813746e9',
        redirect_url: 'https://app.sandbox.midtrans.com/snap/v3/redirection/071e0c3d-dade-4148-a1b5-296ee8735b79'
      })
  })

  afterEach(async () => {
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
    it('should return 200', async () => {
      // Will add authentication letter
      const res = await chai.request(server).post('/api/v1/topup').send({
        userId: userMock.data[0].id,
        amount: 20000
      })
      assert.equal(res.status, 201)
      res.body.data.should.have.property('redirect_url')
    })
  })
})
