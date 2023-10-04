export default class JajanItemManagementCreateRequest {
  vendorId: string
  categoryId: string
  name: string
  price: number
  imageUrl: string

  constructor (
    vendorId: string,
    categoryId: string,
    name: string,
    price: number,
    imageUrl: string
  ) {
    this.vendorId = vendorId
    this.categoryId = categoryId
    this.name = name
    this.price = price
    this.imageUrl = imageUrl
  }
}
