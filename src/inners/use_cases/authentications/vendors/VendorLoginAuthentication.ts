import type VendorManagement from '../../managements/VendorManagement'
import type { Vendor } from '@prisma/client'
import Result from '../../../models/value_objects/Result'
import type VendorLoginByEmailAndPasswordRequest
  from '../../../models/value_objects/requests/authentications/vendors/VendorLoginByEmailAndPasswordRequest'
import { randomUUID } from 'crypto'

export default class VendorLoginAuthentication {
  vendorManagement: VendorManagement

  constructor (vendorManagement: VendorManagement) {
    this.vendorManagement = vendorManagement
  }

  loginByEmailAndPassword = async (request: VendorLoginByEmailAndPasswordRequest): Promise<Result<string | null>> => {
    const foundVendorByEmailAndPassword: Result<Vendor | null> = await this.vendorManagement.readOneByEmailAndPassword(request.email, request.password)
    if (foundVendorByEmailAndPassword.data === null) {
      return new Result<null>(
        404,
        'Login by username and password failed, unknown email or password.}',
        null
      )
    }

    return new Result<string>(
      200,
      'Login by username and password succeed.',
      randomUUID()
    )
  }
}
