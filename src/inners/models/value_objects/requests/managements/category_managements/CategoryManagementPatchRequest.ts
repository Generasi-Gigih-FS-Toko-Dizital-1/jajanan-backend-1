export default class CategoryManagementPatchRequest {
  name: string
  iconUrl: string

  constructor (name: string, iconUrl: string) {
    this.name = name
    this.iconUrl = iconUrl
  }
}
