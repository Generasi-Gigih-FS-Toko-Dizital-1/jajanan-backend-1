export default class JajanItemManagementCreateResponse {
  id: string
  vendorId: string
  categoryId: string
  name: string
  price: number
  imageUrl: string
  createdAt: Date
  updatedAt: Date

  constructor (
    id: string,
    vendorId: string,
    categoryId: string,
    name: string,
    price: number,
    imageUrl: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.vendorId = vendorId
    this.categoryId = categoryId
    this.name = name
    this.price = price
    this.imageUrl = imageUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
