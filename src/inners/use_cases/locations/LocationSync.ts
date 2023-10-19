import type UserManagement from '../managements/UserManagement'
import type VendorManagement from '../managements/VendorManagement'
import type ObjectUtility from '../../../outers/utilities/ObjectUtility'
import type CategoryManagement from '../managements/CategoryManagement'
import UserLocationSyncResponse from '../../models/value_objects/responses/locations/UserLocationSyncResponse'
import Result from '../../models/value_objects/Result'
import type UserLocationSyncRequest from '../../models/value_objects/requests/locations/UserLocationSyncRequest'
import type VendorLocationSyncRequest from '../../models/value_objects/requests/locations/VendorLocationSyncRequest'
import VendorLocationSyncResponse from '../../models/value_objects/responses/locations/VendorLocationSyncResponse'
import type FirebaseGateway from '../../../outers/gateways/FirebaseGateway'

export default class LocationSync {
  userManagement: UserManagement
  vendorManagement: VendorManagement
  categoryManagement: CategoryManagement
  firebaseGateway: FirebaseGateway
  objectUtility: ObjectUtility

  constructor (userManagement: UserManagement, vendorManagement: VendorManagement, categoryManagement: CategoryManagement, firebaseGateway: FirebaseGateway, objectUtility: ObjectUtility) {
    this.userManagement = userManagement
    this.vendorManagement = vendorManagement
    this.categoryManagement = categoryManagement
    this.firebaseGateway = firebaseGateway
    this.objectUtility = objectUtility
  }

  syncUserLocation = async (request: UserLocationSyncRequest, include: any): Promise<Result<UserLocationSyncResponse | null>> => {
    const requestToPatch: any = {
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude
    }
    const updatedUser = await this.userManagement.patchOneRawById(request.userId, requestToPatch)
    if (updatedUser.status !== 200 || updatedUser.data === null) {
      return new Result<null>(
        500,
        'User location patch failed.',
        null
      )
    }

    const foundVendors: Result<any> = await this.vendorManagement.readManyByDistanceAndSubscribedUserIds(request.maxDistance, [request.userId], include)
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
    const updatedVendor = await this.vendorManagement.patchOneRawById(request.vendorId, requestToPatch)
    if (updatedVendor.status !== 200 || updatedVendor.data === null) {
      return new Result<null>(
        500,
        'Vendor location patch failed.',
        null
      )
    }

    const foundVendors: Result<any> = await this.userManagement.readManyByDistanceAndSubscribedVendorIds(request.maxDistance, [request.vendorId], include)
    if (foundVendors.status !== 200 || foundVendors.data === null) {
      return new Result<null>(
        500,
        'Vendor read many by distance and subscribed vendor ids failed.',
        null
      )
    }

    const response: VendorLocationSyncResponse = new VendorLocationSyncResponse(
      foundVendors.data
    )

    return new Result<VendorLocationSyncResponse>(
      200,
      'Vendor location sync succeed.',
      response
    )
  }
}
