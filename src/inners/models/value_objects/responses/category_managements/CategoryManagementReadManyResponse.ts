import type CategoryManagementReadOneRequest from './CategoryManagementReadOneResponse'

export default class CategoryManagementReadManyResponse {
  totalCategories: number
  categories: CategoryManagementReadOneRequest[]

  constructor (
    totalCategories: number,
    categories: CategoryManagementReadOneRequest[]
  ) {
    this.totalCategories = totalCategories
    this.categories = categories
  }
}
