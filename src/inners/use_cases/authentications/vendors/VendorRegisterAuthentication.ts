import type VendorManagement from '../../managements/VendorManagement'

import Result from '../../../models/value_objects/Result'
import { type Vendor } from '@prisma/client'
import type VendorRegisterByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { randomUUID } from 'crypto'

export default class VendorRegisterAuthentication {
  vendorManagement: VendorManagement

  constructor (vendorManagement: VendorManagement) {
    this.vendorManagement = vendorManagement
  }

  registerByEmailAndPassword = async (request: VendorRegisterByEmailAndPasswordRequest): Promise<Result<Vendor | null>> => {
    let isVendorEmailFound: boolean
    try {
      await this.vendorManagement.readOneByEmail(request.email)
      isVendorEmailFound = true
    } catch (error) {
      isVendorEmailFound = false
    }

    if (isVendorEmailFound) {
      return new Result<null>(
        409,
        'Register by email and password failed, email already exists.',
        null
      )
    }

    let isVendorUsernameFound: boolean
    try {
      await this.vendorManagement.readOneByUsername(request.username)
      isVendorUsernameFound = true
    } catch (error) {
      isVendorUsernameFound = false
    }

    if (isVendorUsernameFound) {
      return new Result<null>(
        409,
        'Register by email and password failed, username already exists.',
        null
      )
    }

    const vendorToCreate: Vendor = {
      id: randomUUID(),
      fullName: request.fullName,
      gender: request.gender,
      address: request.address,
      email: request.email,
      password: request.password,
      username: request.username,
      jajanImageUrl: request.jajanImageUrl,
      jajanName: request.jajanName,
      jajanDescription: request.jajanDescription,
      status: 'OFF',
      balance: 0,
      experience: 0,
      lastLatitude: request.lastLatitude,
      lastLongitude: request.lastLongitude,
      updatedAt: new Date(),
      createdAt: new Date(),
      deletedAt: null
    }

    const createdVendor: Result<Vendor> = await this.vendorManagement.createOneRaw(vendorToCreate)

    return new Result<Vendor>(
      201,
      'Vendor register by email and password succeed.',
      createdVendor.data
    )
  }
}
