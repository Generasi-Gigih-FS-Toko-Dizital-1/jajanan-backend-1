import chai from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'
import { server } from '../../../../src/App'
import humps from 'humps'
import waitUntil from 'async-wait-until'

chai.use(chaiHttp)
chai.should()

describe('UserControllerRest', () => {
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
    await oneDatastore.client.user.deleteMany({
      where: {
        id: {
          in: userMock.data.map((userMock: any) => userMock.id)
        }
      }
    })
    await oneDatastore.disconnect()
  })

  describe('GET /api/v1/users', () => {
    it('should return 200 OK', async () => {
      const response = await chai.request(server).get('/api/v1/users')
      response.should.have.status(200)
      response.body.should.be.a('object')
      response.body.should.have.property('status').eq(200)
      response.body.should.have.property('message')
      response.body.should.have.property('data')
      response.body.data.should.be.a('array')
      response.body.data.should.deep.include.members(
        userMock.data.map((userMock: any) => {
          return humps.decamelizeKeys(JSON.parse(JSON.stringify(userMock)))
        })
      )
    })
  })

  describe('GET /api/v1/users?search=encoded', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('GET /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('POST /api/v1/users', () => {
    it('should return 201 CREATED', async () => {

    })
  })

  describe('PATCH /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {

    })
  })

  describe('DELETE /api/v1/users/:id', () => {
    it('should return 200 OK', async () => {

    })
  })
})
