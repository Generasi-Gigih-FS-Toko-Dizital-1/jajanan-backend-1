import { type Category, type TransactionHistory, type Vendor } from '@prisma/client'

export default class JajanItemManagementReadOneResponse {
  id: string
  vendorId: string
  categoryId: string
  name: string
  price: number
  imageUrl: string
  createdAt: Date
  updatedAt: Date
  vendor?: Vendor
  category?: Category
  transactionHistories?: TransactionHistory[]

  constructor (id: string, vendorId: string, categoryId: string, name: string, price: number, imageUrl: string, createdAt: Date, updatedAt: Date, vendor?: Vendor, category?: Category, transactionHistories?: TransactionHistory[]) {
    this.id = id
    this.vendorId = vendorId
    this.categoryId = categoryId
    this.name = name
    this.price = price
    this.imageUrl = imageUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.vendor = vendor
    this.category = category
    this.transactionHistories = transactionHistories
  }
}
