import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import VendorMock from '../../../mocks/VendorMock'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import VendorRegisterByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { type Vendor } from '@prisma/client'

chai.use(chaiHttp)
chai.should()

describe('VendorAuthenticationControllerRest', () => {
  const vendorMock: VendorMock = new VendorMock()
  const oneDatastore = new OneDatastore()

  beforeEach(async () => {
    await waitUntil(() => server !== undefined)

    await oneDatastore.connect()
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.vendor.createMany({
      data: vendorMock.data
    })
  })

  afterEach(async () => {
    if (oneDatastore.client === undefined) {
      throw new Error('Client is undefined.')
    }
    await oneDatastore.client.vendor.deleteMany(
      {
        where: {
          id: {
            in: vendorMock.data.map((vendor: Vendor) => vendor.id)
          }
        }
      }
    )
    await oneDatastore.disconnect()
  })

  describe('POST /api/v1/authentications/vendors/login?method=email_and_password', () => {
    it('should return 200 OK', async () => {

    })

    it('should return 404 NOT FOUND: Unknown email', async () => {

    })

    it('should return 404 NOT FOUND: Unknown email or password', async () => {

    })
  })

  describe('POST /api/v1/authentications/vendors/register?method=email_and_password', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: VendorRegisterByEmailAndPasswordRequest = new VendorRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        'email2@mail.com',
        'password2',
        'address2',
        'https://placehold.co/400x400?text=jajanImageUrl2',
        'jajanName2',
        'jajanDescription2',
        'OFF',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/register?method=email_and_password')
        .send(requestBody)

      response.should.have.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('username').equal(requestBody.username)
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('jajan_image_url').equal(requestBody.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestBody.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestBody.jajanDescription)
      response.body.data.should.has.property('status').equal(requestBody.status)
      response.body.data.should.has.property('last_latitude')
      response.body.data.should.has.property('last_longitude')
      response.body.data.should.has.property('created_at')
      response.body.data.should.has.property('updated_at')

      if (oneDatastore.client === undefined) {
        throw new Error('Client is undefined.')
      }
      await oneDatastore.client.vendor.deleteMany({
        where: {
          email: requestBody.email,
          username: requestBody.username
        }
      })
    })

    it('should return 409 CONFLICT: Email already exists', async () => {
      const requestBody: VendorRegisterByEmailAndPasswordRequest = new VendorRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        'username2',
        vendorMock.data[0].email,
        'password2',
        'address2',
        'https://placehold.co/400x400?text=jajanImageUrl2',
        'jajanName2',
        'jajanDescription2',
        'OFF',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/register?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })

    it('should return 409 CONFLICT: Username already exists', async () => {
      const requestBody: VendorRegisterByEmailAndPasswordRequest = new VendorRegisterByEmailAndPasswordRequest(
        'fullName2',
        'MALE',
        vendorMock.data[0].username,
        'email2',
        'password2',
        'address2',
        'https://placehold.co/400x400?text=jajanImageUrl2',
        'jajanName2',
        'jajanDescription2',
        'OFF',
        2,
        2
      )

      const response = await chai
        .request(server)
        .post('/api/v1/authentications/vendors/register?method=email_and_password')
        .send(requestBody)

      response.should.have.status(409)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)
    })
  })
})
