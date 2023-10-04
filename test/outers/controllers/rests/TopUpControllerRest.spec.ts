import chai, { assert } from 'chai'
import { beforeEach, describe, it } from 'mocha'
import waitUntil from 'async-wait-until'
import UserMock from '../../../mocks/UserMock'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import chaiHttp from 'chai-http'

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
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.user.deleteMany()
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/topup', () => {
    it('should return 200', async () => {
      const res = await chai.request(server).post('/api/v1/topup').send({
        userId: userMock.data[0].id,
        amount: 100
      })
      assert.equal(res.status, 200)
      res.body.should.have.property('redirectUrl')
    })

    it('should return 400', async () => {
      const res = await chai.request(server).post('/api/v1/topup').send({
        userId: userMock.data[0].id,
        amount: -100
      })
      assert.equal(res.status, 400)
    })

    it('should return 404', async () => {
      const res = await chai.request(server).post('/api/v1/topup').send({
        userId: 'invalid-id',
        amount: 100
      })
      assert.equal(res.status, 404)
    })
  })
})
