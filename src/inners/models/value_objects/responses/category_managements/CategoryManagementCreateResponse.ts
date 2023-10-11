export default class CategoryManagementCreateResponse {
  id: string
  categoryName: string
  iconUrl: string
  createdAt: Date
  updatedAt: Date

  constructor (id: string, categoryName: string, iconUrl: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.categoryName = categoryName
    this.iconUrl = iconUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
