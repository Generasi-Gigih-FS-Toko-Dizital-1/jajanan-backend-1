export default class UserLevelManagementCreateRequest {
  name: string
  minimumExperience: number
  iconUrl: string

  constructor (name: string, minimumExperience: number, iconUrl: string) {
    this.name = name
    this.minimumExperience = minimumExperience
    this.iconUrl = iconUrl
  }
}
