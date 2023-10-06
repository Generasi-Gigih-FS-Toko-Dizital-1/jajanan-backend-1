import type VendorManagement from '../../managements/VendorManagement'

import Result from '../../../models/value_objects/Result'
import { type User, type Vendor } from '@prisma/client'
import type VendorRegisterByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/vendors/VendorRegisterByEmailAndPasswordRequest'
import { randomUUID } from 'crypto'

export default class VendorRegisterAuthentication {
  vendorManagement: VendorManagement

  constructor (vendorManagement: VendorManagement) {
    this.vendorManagement = vendorManagement
  }

  registerByEmailAndPassword = async (request: VendorRegisterByEmailAndPasswordRequest): Promise<Result<Vendor | null>> => {
    const foundVendorByEmail: Result<Vendor | null> = await this.vendorManagement.readOneByEmail(request.email)
    if (foundVendorByEmail.status === 200 && foundVendorByEmail.data !== null) {
      return new Result<null>(
        409,
        'Vendor register by email and password failed, email already exists.',
        null
      )
    }

    const foundVendorByUsername: Result<Vendor | null> = await this.vendorManagement.readOneByUsername(request.username)
    if (foundVendorByUsername.status === 200 && foundVendorByUsername.data !== null) {
      return new Result<null>(
        409,
        'Vendor register by email and password failed, username already exists.',
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

    const createdVendor: Result<Vendor | null> = await this.vendorManagement.createOneRaw(vendorToCreate)
    if (createdVendor.status !== 201 || createdVendor.data === null) {
      return new Result<null>(
        createdVendor.status,
            `Vendor register by email and password failed, ${createdVendor.message}`,
            null
      )
    }

    return new Result<Vendor>(
      201,
      'Vendor register by email and password succeed.',
      createdVendor.data
    )
  }
}
