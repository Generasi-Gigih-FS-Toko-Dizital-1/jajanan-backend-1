export default class CategoryManagementCreateRequest {
  categoryName: string
  iconUrl: string

  constructor (categoryName: string, iconUrl: string) {
    this.categoryName = categoryName
    this.iconUrl = iconUrl
  }
}
