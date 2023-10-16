import type PaymentGateway from '../../../outers/gateways/PaymentGateway'
import type VendorManagement from '../managements/VendorManagement'

export default class Payout {
  paymentGateway: PaymentGateway
  vendorManagement: VendorManagement

  constructor (paymentGateway: PaymentGateway, vendorManagement: VendorManagement) {
    this.paymentGateway = paymentGateway
    this.vendorManagement = vendorManagement
  }
}
