export default class CategoryManagementPatchResponse {
  id: string
  name: string
  iconUrl: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor (id: string, name: string, iconUrl: string, createdAt: Date, updatedAt: Date, deletedAt: Date | null = null) {
    this.id = id
    this.name = name
    this.iconUrl = iconUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
