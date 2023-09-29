import chai from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'

chai.use(chaiHttp)
chai.should()

describe('AuthenticationControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
  })

  afterEach(async () => {
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/authentications/logins?method=username_and_password', () => {
    it('should return 200 OK', async () => {

    })

    it('should return 404 NOT FOUND: Unknown username', async () => {

    })

    it('should return 404 NOT FOUND: Unknown username or password', async () => {

    })
  })

  describe('POST /api/v1/authentications/registers?method=username_and_password', () => {
    it('should return 201 CREATED', async () => {

    })

    it('should return 409 CONFLICT: Username already exists', async () => {

    })
  })
})
