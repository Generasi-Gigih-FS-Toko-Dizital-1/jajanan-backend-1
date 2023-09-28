import chai from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import UserMock from '../../../mocks/UserMock'

chai.use(chaiHttp)
chai.should()

describe('AuthenticationControllerRest', () => {
  const userMock: UserMock = new UserMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
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
