export default class CategoryManagementCreateResponse {
  id: string
  name: string
  iconUrl: string
  createdAt: Date
  updatedAt: Date

  constructor (id: string, name: string, iconUrl: string, createdAt: Date, updatedAt: Date) {
    this.id = id
    this.name = name
    this.iconUrl = iconUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
