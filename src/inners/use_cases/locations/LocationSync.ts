import type UserManagement from '../managements/UserManagement'
import type VendorManagement from '../managements/VendorManagement'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import UserLocationSyncResponse from '../../models/value_objects/responses/locations/UserLocationSyncResponse'
import Result from '../../models/value_objects/Result'
import type UserLocationSyncRequest from '../../models/value_objects/requests/locations/UserLocationSyncRequest'
import type VendorLocationSyncRequest from '../../models/value_objects/requests/locations/VendorLocationSyncRequest'
import VendorLocationSyncResponse from '../../models/value_objects/responses/locations/VendorLocationSyncResponse'
import type FirebaseGateway from '../../../outers/gateways/FirebaseGateway'
import { type User, type Vendor } from '@prisma/client'
import type VendorAggregate from '../../models/aggregates/VendorAggregate'
import type UserAggregate from '../../models/aggregates/UserAggregate'
import type SessionManagement from '../managements/SessionManagement'
import type Session from '../../models/value_objects/Session'

export default class LocationSync {
  userManagement: UserManagement
  vendorManagement: VendorManagement
  sessionManagement: SessionManagement
  firebaseGateway: FirebaseGateway
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, vendorManagement: VendorManagement, sessionManagement: SessionManagement, firebaseGateway: FirebaseGateway, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.vendorManagement = vendorManagement
    this.sessionManagement = sessionManagement
    this.firebaseGateway = firebaseGateway
    this.objectUtility = objectUtility
  }

  syncUserLocation = async (request: UserLocationSyncRequest, include: any): Promise<Result<UserLocationSyncResponse | null>> => {
    const requestToPatch: any = {
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude
    }
    const updatedUser: Result<User | null> = await this.userManagement.patchOneRawById(request.userId, requestToPatch)
    if (updatedUser.status !== 200 || updatedUser.data === null) {
      return new Result<null>(
        500,
        'User location patch failed.',
        null
      )
    }

    const foundVendors: Result<Vendor[] | VendorAggregate[]> = await this.vendorManagement.readManyByDistanceAndSubscribedUserIds(request.maxDistance, [request.userId], include)
    if (foundVendors.status !== 200 || foundVendors.data === null) {
      return new Result<null>(
        500,
        'Vendor read many by distance and subscribed user ids failed.',
        null
      )
    }

    const response: UserLocationSyncResponse = new UserLocationSyncResponse(
      foundVendors.data
    )

    return new Result<UserLocationSyncResponse>(
      200,
      'User location sync succeed.',
      response
    )
  }

  syncVendorLocation = async (request: VendorLocationSyncRequest, include: any): Promise<Result<VendorLocationSyncResponse | null>> => {
    const requestToPatch: any = {
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude
    }
    const updatedVendor: Result<Vendor | null> = await this.vendorManagement.patchOneRawById(request.vendorId, requestToPatch)
    if (updatedVendor.status !== 200 || updatedVendor.data === null) {
      return new Result<null>(
        500,
        'Vendor location patch failed.',
        null
      )
    }

    const foundUsers: Result<User[] | UserAggregate[]> = await this.userManagement.readManyByDistanceAndSubscribedVendorIds(request.maxDistance, [request.vendorId], include)
    if (foundUsers.status !== 200 || foundUsers.data === null) {
      return new Result<null>(
        500,
        'User read many by distance and subscribed vendor ids failed.',
        null
      )
    }

    if (request.isNotifyUsers) {
      const foundUserFirebaseTokens: string[] = []
      for (const user of foundUsers.data) {
        const foundUserSession: Result<Session | null> = await this.sessionManagement.readOneById(user.id)
        if (foundUserSession.status !== 200 || foundUserSession.data === null) {
          return new Result<null>(
            500,
            'Session read one by account id failed, some user session is unknown.',
            null
          )
        }
        if (foundUserSession.data.firebaseToken === undefined) {
          return new Result<null>(
            500,
            'Session read one by account id failed, some user firebase token is undefined.',
            null
          )
        }

        foundUserFirebaseTokens.push(foundUserSession.data.firebaseToken)
      }

      if (foundUserFirebaseTokens.length >= 1) {
        const message: any = {
          data: {
            nearbyVendor: JSON.stringify(updatedVendor.data)
          },
          notification: {
            title: 'Nearby Vendor',
            body: `There is a vendor ${updatedVendor.data.jajanName} nearby.`
          }
        }
        await this.firebaseGateway.sendNotificationByFirebaseTokens(foundUserFirebaseTokens, message)
      }
    }

    const response: VendorLocationSyncResponse = new VendorLocationSyncResponse(
      foundUsers.data
    )

    return new Result<VendorLocationSyncResponse>(
      200,
      'Vendor location sync succeed.',
      response
    )
  }
}
