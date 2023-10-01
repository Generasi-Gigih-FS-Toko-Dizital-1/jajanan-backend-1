export default class Pagination {
  pageNumber: number
  itemPerPage: number

  constructor (pageNumber: number, itemPerPage: number) {
    this.pageNumber = pageNumber
    this.itemPerPage = itemPerPage
  }
}
