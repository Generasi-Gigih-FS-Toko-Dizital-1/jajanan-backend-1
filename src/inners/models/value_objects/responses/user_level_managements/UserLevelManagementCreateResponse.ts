export default class UserLevelManagementCreateResponse {
  id: string
  name: string
  minimumExperience: number
  iconUrl: string
  createdAt: Date
  updatedAt: Date

  constructor (
    id: string,
    name: string,
    minimumExperience: number,
    iconUrl: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id
    this.name = name
    this.minimumExperience = minimumExperience
    this.iconUrl = iconUrl
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
