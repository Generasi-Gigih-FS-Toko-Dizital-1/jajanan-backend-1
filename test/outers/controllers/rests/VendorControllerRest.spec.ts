import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { beforeEach, describe, it } from 'mocha'
import OneDatastore from '../../../../src/outers/datastores/OneDatastore'
import { server } from '../../../../src/App'
import waitUntil from 'async-wait-until'
import VendorManagementCreateRequest
  from '../../../../src/inners/models/value_objects/requests/managements/vendor_managements/VendorManagementCreateRequest'
import {
  type Admin,
  type JajanItem,
  type JajanItemSnapshot,
  type NotificationHistory,
  type PayoutHistory,
  type Prisma,
  type TransactionItemHistory,
  type Vendor
} from '@prisma/client'
import VendorManagementPatchRequest
  from '../../../../src/inners/models/value_objects/requests/managements/vendor_managements/VendorManagementPatchRequest'
import Authorization from '../../../../src/inners/models/value_objects/Authorization'
import AdminMock from '../../../mocks/AdminMock'
import AdminLoginByEmailAndPasswordRequest
  from '../../../../src/inners/models/value_objects/requests/authentications/admins/AdminLoginByEmailAndPasswordRequest'
import OneSeeder from '../../../../src/outers/seeders/OneSeeder'
import humps from 'humps'

chai.use(chaiHttp)
chai.should()

describe('VendorControllerRest', () => {
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

  describe('GET /api/v1/vendors?page_number={}&page_size={}', () => {
    it('should return 200 OK', async () => {
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.vendorMock.data.length
      const response = await agent
        .get(`/api/v1/vendors?page_number=${pageNumber}&page_size=${pageSize}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_vendors')
      response.body.data.should.has.property('vendors')
      response.body.data.vendors.should.be.a('array')
      response.body.data.vendors.length.should.be.equal(pageSize)
      response.body.data.vendors.forEach((vendor: Vendor) => {
        vendor.should.has.property('id')
        vendor.should.has.property('username')
        vendor.should.has.property('full_name')
        vendor.should.has.property('address')
        vendor.should.has.property('email')
        vendor.should.has.property('gender')
        vendor.should.has.property('balance')
        vendor.should.has.property('experience')
        vendor.should.has.property('jajan_image_url')
        vendor.should.has.property('jajan_name')
        vendor.should.has.property('jajan_description')
        vendor.should.has.property('status')
        vendor.should.has.property('last_latitude')
        vendor.should.has.property('last_longitude')
        vendor.should.has.property('created_at')
        vendor.should.has.property('updated_at')
      })
    })
  })

  describe('GET /api/v1/vendors?page_number={}&page_size={}&where={}&include={}', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = oneSeeder.vendorMock.data[0]
      const requestNotificationHistories: NotificationHistory[] = oneSeeder.notificationHistoryMock.data.filter(notificationHistory => notificationHistory.vendorId === requestVendor.id)
      const requestJajanItems: JajanItem[] = oneSeeder.jajanItemMock.data.filter(jajanItem => jajanItem.vendorId === requestVendor.id)
      const requestJajanItemSnapshots: JajanItemSnapshot[] = oneSeeder.jajanItemSnapshotMock.data.filter(jajanItemSnapshot => jajanItemSnapshot.vendorId === requestVendor.id)
      const requestPayoutHistories: PayoutHistory[] = oneSeeder.payoutHistoryMock.data.filter(payoutHistory => payoutHistory.vendorId === requestVendor.id)
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.vendorMock.data.length
      const whereInput: any = {
        id: requestVendor.id
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        notificationHistories: true,
        jajanItems: true,
        jajanItemSnapshots: true,
        payoutHistories: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const response = await agent
        .get(`/api/v1/vendors?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_vendors')
      response.body.data.should.has.property('vendors')
      response.body.data.vendors.should.be.a('array')
      response.body.data.vendors.length.should.be.equal(1)
      response.body.data.vendors.forEach((vendor: Vendor) => {
        vendor.should.has.property('id').equal(requestVendor.id)
        vendor.should.has.property('username').equal(requestVendor.username)
        vendor.should.has.property('full_name').equal(requestVendor.fullName)
        vendor.should.has.property('address').equal(requestVendor.address)
        vendor.should.has.property('email').equal(requestVendor.email)
        vendor.should.has.property('gender').equal(requestVendor.gender)
        vendor.should.has.property('balance').equal(requestVendor.balance)
        vendor.should.has.property('experience').equal(requestVendor.experience)
        vendor.should.has.property('jajan_image_url').equal(requestVendor.jajanImageUrl)
        vendor.should.has.property('jajan_name').equal(requestVendor.jajanName)
        vendor.should.has.property('jajan_description').equal(requestVendor.jajanDescription)
        vendor.should.has.property('status').equal(requestVendor.status)
        vendor.should.has.property('last_latitude').equal(requestVendor.lastLatitude)
        vendor.should.has.property('last_longitude').equal(requestVendor.lastLongitude)
        vendor.should.has.property('created_at').equal(requestVendor.createdAt.toISOString())
        vendor.should.has.property('updated_at').equal(requestVendor.updatedAt.toISOString())
        vendor.should.has.property('notification_histories').deep.members(
          requestNotificationHistories.map((notificationHistory: NotificationHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(notificationHistory))))
        )
        vendor.should.has.property('jajan_items').deep.members(
          requestJajanItems.map((jajanItem: JajanItem) => humps.decamelizeKeys(JSON.parse(JSON.stringify(jajanItem))))
        )
        vendor.should.has.property('jajan_item_snapshots').deep.members(
          requestJajanItemSnapshots.map((jajanItemSnapshot: JajanItemSnapshot) => humps.decamelizeKeys(JSON.parse(JSON.stringify(jajanItemSnapshot))))
        )
        vendor.should.has.property('payout_histories').deep.members(
          requestPayoutHistories.map((payoutHistory: PayoutHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(payoutHistory))))
        )
      })
    })
  })

  describe('GET /api/v1/vendors?page_number={}&page_size={}&where={}&include={}&distance={}&latitude={}&longitude={}', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = oneSeeder.vendorMock.data[0]
      const requestNotificationHistories: NotificationHistory[] = oneSeeder.notificationHistoryMock.data.filter(notificationHistory => notificationHistory.vendorId === requestVendor.id)
      const requestJajanItems: JajanItem[] = oneSeeder.jajanItemMock.data.filter(jajanItem => jajanItem.vendorId === requestVendor.id)
      const requestJajanItemSnapshots: JajanItemSnapshot[] = oneSeeder.jajanItemSnapshotMock.data.filter(jajanItemSnapshot => jajanItemSnapshot.vendorId === requestVendor.id)
      const requestPayoutHistories: PayoutHistory[] = oneSeeder.payoutHistoryMock.data.filter(payoutHistory => payoutHistory.vendorId === requestVendor.id)
      const pageNumber: number = 1
      const pageSize: number = oneSeeder.vendorMock.data.length
      const whereInput: any = {
        email: requestVendor.email
      }
      const where: string = encodeURIComponent(JSON.stringify(whereInput))
      const includeInput: any = {
        notificationHistories: true,
        jajanItems: true,
        jajanItemSnapshots: true,
        payoutHistories: true
      }
      const include: string = encodeURIComponent(JSON.stringify(includeInput))
      const distance: number = 1000
      const latitude: number = requestVendor.lastLatitude
      const longitude: number = requestVendor.lastLongitude
      const response = await agent
        .get(`/api/v1/vendors/locations?page_number=${pageNumber}&page_size=${pageSize}&where=${where}&include=${include}&distance=${distance}&latitude=${latitude}&longitude=${longitude}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('total_vendors')
      response.body.data.should.has.property('vendors')
      response.body.data.vendors.should.be.a('array')
      response.body.data.vendors.length.should.be.equal(1)
      response.body.data.vendors.forEach((vendor: Vendor) => {
        vendor.should.has.property('id').equal(requestVendor.id)
        vendor.should.has.property('username').equal(requestVendor.username)
        vendor.should.has.property('full_name').equal(requestVendor.fullName)
        vendor.should.has.property('address').equal(requestVendor.address)
        vendor.should.has.property('email').equal(requestVendor.email)
        vendor.should.has.property('gender').equal(requestVendor.gender)
        vendor.should.has.property('balance').equal(requestVendor.balance)
        vendor.should.has.property('experience').equal(requestVendor.experience)
        vendor.should.has.property('jajan_image_url').equal(requestVendor.jajanImageUrl)
        vendor.should.has.property('jajan_name').equal(requestVendor.jajanName)
        vendor.should.has.property('jajan_description').equal(requestVendor.jajanDescription)
        vendor.should.has.property('status').equal(requestVendor.status)
        vendor.should.has.property('last_latitude').equal(requestVendor.lastLatitude)
        vendor.should.has.property('last_longitude').equal(requestVendor.lastLongitude)
        vendor.should.has.property('created_at').equal(requestVendor.createdAt.toISOString())
        vendor.should.has.property('updated_at').equal(requestVendor.updatedAt.toISOString())
        vendor.should.has.property('notification_histories').deep.members(
          requestNotificationHistories.map((notificationHistory: NotificationHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(notificationHistory))))
        )
        vendor.should.has.property('jajan_items').deep.members(
          requestJajanItems.map((jajanItem: JajanItem) => humps.decamelizeKeys(JSON.parse(JSON.stringify(jajanItem))))
        )
        vendor.should.has.property('jajan_item_snapshots').deep.members(
          requestJajanItemSnapshots.map((jajanItemSnapshot: JajanItemSnapshot) => humps.decamelizeKeys(JSON.parse(JSON.stringify(jajanItemSnapshot))))
        )
        vendor.should.has.property('payout_histories').deep.members(
          requestPayoutHistories.map((payoutHistory: PayoutHistory) => humps.decamelizeKeys(JSON.parse(JSON.stringify(payoutHistory))))
        )
      })
    })
  })

  describe('GET /api/v1/vendors/:id', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = oneSeeder.vendorMock.data[0]
      const response = await agent
        .get(`/api/v1/vendors/${requestVendor.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id').equal(requestVendor.id)
      response.body.data.should.has.property('username').equal(requestVendor.username)
      response.body.data.should.has.property('full_name').equal(requestVendor.fullName)
      response.body.data.should.has.property('email').equal(requestVendor.email)
      response.body.data.should.has.property('gender').equal(requestVendor.gender)
      response.body.data.should.has.property('address').equal(requestVendor.address)
      response.body.data.should.has.property('balance').equal(requestVendor.balance)
      response.body.data.should.has.property('experience').equal(requestVendor.experience)
      response.body.data.should.has.property('jajan_image_url').equal(requestVendor.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestVendor.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestVendor.jajanDescription)
      response.body.data.should.has.property('status').equal(requestVendor.status)
      response.body.data.should.has.property('last_latitude').equal(requestVendor.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestVendor.lastLongitude)
      response.body.data.should.has.property('updated_at').equal(requestVendor.updatedAt.toISOString())
      response.body.data.should.has.property('created_at').equal(requestVendor.createdAt.toISOString())
    })
  })

  describe('POST /api/v1/vendors', () => {
    it('should return 201 CREATED', async () => {
      const requestBody: VendorManagementCreateRequest = new VendorManagementCreateRequest(
        oneSeeder.vendorMock.data[0].fullName,
        oneSeeder.vendorMock.data[0].gender,
        oneSeeder.vendorMock.data[0].address,
        oneSeeder.vendorMock.data[0].username,
        oneSeeder.vendorMock.data[0].email,
        oneSeeder.vendorMock.data[0].password,
        oneSeeder.vendorMock.data[0].jajanImageUrl,
        oneSeeder.vendorMock.data[0].jajanName,
        oneSeeder.vendorMock.data[0].jajanDescription,
        oneSeeder.vendorMock.data[0].status,
        oneSeeder.vendorMock.data[0].lastLatitude,
        oneSeeder.vendorMock.data[0].lastLongitude
      )

      const response = await agent
        .post('/api/v1/vendors')
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(201)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('username').equal(requestBody.username)
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('address').equal(requestBody.address)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('jajan_image_url').equal(requestBody.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestBody.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestBody.jajanDescription)
      response.body.data.should.has.property('status').equal(requestBody.status)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      const deleteResult: Prisma.BatchPayload = await oneDatastore.client.vendor.deleteMany({
        where: {
          id: response.body.data.id
        }
      })
      deleteResult.should.has.property('count').greaterThanOrEqual(1)
    })
  })

  describe('PATCH /api/v1/vendors/:id', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = oneSeeder.vendorMock.data[0]
      const requestBody: VendorManagementPatchRequest = new VendorManagementPatchRequest(
        `patched${requestVendor.fullName}`,
        'FEMALE',
        `patched${requestVendor.username}`,
        `patched${requestVendor.email}`,
        `patched${requestVendor.password}`,
        `${requestVendor.jajanImageUrl}patched`,
        `patched${requestVendor.jajanName}`,
        `patched${requestVendor.jajanDescription}`,
        'ON',
        requestVendor.lastLatitude + 1,
        requestVendor.lastLongitude + 1
      )

      const response = await agent
        .patch(`/api/v1/vendors/${requestVendor.id}`)
        .set('Authorization', authorization.convertToString())
        .send(requestBody)

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      response.body.data.should.be.an('object')
      response.body.data.should.has.property('id')
      response.body.data.should.has.property('username').equal(requestBody.username)
      response.body.data.should.has.property('full_name').equal(requestBody.fullName)
      response.body.data.should.has.property('email').equal(requestBody.email)
      response.body.data.should.has.property('gender').equal(requestBody.gender)
      response.body.data.should.has.property('address').equal(requestVendor.address)
      response.body.data.should.has.property('balance')
      response.body.data.should.has.property('experience')
      response.body.data.should.has.property('jajan_image_url').equal(requestBody.jajanImageUrl)
      response.body.data.should.has.property('jajan_name').equal(requestBody.jajanName)
      response.body.data.should.has.property('jajan_description').equal(requestBody.jajanDescription)
      response.body.data.should.has.property('status').equal(requestBody.status)
      response.body.data.should.has.property('last_latitude').equal(requestBody.lastLatitude)
      response.body.data.should.has.property('last_longitude').equal(requestBody.lastLongitude)
      response.body.data.should.has.property('updated_at')
      response.body.data.should.has.property('created_at')
    })
  })

  describe('DELETE /api/v1/vendors/:id', () => {
    it('should return 200 OK', async () => {
      const requestVendor: Vendor = oneSeeder.vendorMock.data[0]
      const requestNotificationHistories: NotificationHistory[] = oneSeeder.notificationHistoryMock.data.filter((notificationHistory: NotificationHistory) => notificationHistory.vendorId === requestVendor.id)
      const requestJajanItems: JajanItem[] = oneSeeder.jajanItemMock.data.filter((jajanItem: JajanItem) => jajanItem.vendorId === requestVendor.id)
      const requestJajanItemSnapshots: JajanItemSnapshot[] = oneSeeder.jajanItemSnapshotMock.data.filter((jajanItemSnapshot: JajanItemSnapshot) => requestJajanItems.map((jajanItem: JajanItem) => jajanItem.id).includes(jajanItemSnapshot.originId))
      const requestTransactionItemHistories: TransactionItemHistory[] = oneSeeder.transactionItemHistoryMock.data.filter((transactionItemHistory: TransactionItemHistory) => requestJajanItemSnapshots.map((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.id).includes(transactionItemHistory.jajanItemSnapshotId))
      const requestPayoutHistories: PayoutHistory[] = oneSeeder.payoutHistoryMock.data.filter((payoutHistory: PayoutHistory) => payoutHistory.vendorId === requestVendor.id)

      if (oneDatastore.client === undefined) {
        throw new Error('oneDatastore client is undefined')
      }
      await oneDatastore.client.payoutHistory.deleteMany({
        where: {
          id: {
            in: requestPayoutHistories.map((payoutHistory: PayoutHistory) => payoutHistory.id)
          }
        }
      })
      await oneDatastore.client.transactionItemHistory.deleteMany({
        where: {
          id: {
            in: requestTransactionItemHistories.map((transactionItemHistory: TransactionItemHistory) => transactionItemHistory.id)
          }
        }
      })
      await oneDatastore.client.jajanItemSnapshot.deleteMany({
        where: {
          id: {
            in: requestJajanItemSnapshots.map((jajanItemSnapshot: JajanItemSnapshot) => jajanItemSnapshot.id)
          }
        }
      })
      await oneDatastore.client.jajanItem.deleteMany({
        where: {
          id: {
            in: requestJajanItems.map((jajanItem: JajanItem) => jajanItem.id)
          }
        }
      })
      await oneDatastore.client.notificationHistory.deleteMany({
        where: {
          id: {
            in: requestNotificationHistories.map((notificationHistory: NotificationHistory) => notificationHistory.id)
          }
        }
      })

      const response = await agent
        .delete(`/api/v1/vendors/${requestVendor.id}`)
        .set('Authorization', authorization.convertToString())
        .send()

      response.should.has.status(200)
      response.body.should.be.an('object')
      response.body.should.has.property('message')
      response.body.should.has.property('data')
      assert.isNull(response.body.data)

      const result: Vendor | null = await oneDatastore.client.vendor.findFirst({
        where: {
          id: requestVendor.id
        }
      })
      assert.isNull(result)
    })
  })
})
