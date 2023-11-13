export default class VendorLevelManagementReadOneResponse {
  id: string
  name: string
  minimumExperience: number
  iconUrl: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null

  constructor (
    id: string,
    name: string,
    minimumExperience: number,
    iconUrl: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null
  ) {
    this.id = id
    this.name = name
    this.minimumExperience = minimumExperience
    this.iconUrl = iconUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
