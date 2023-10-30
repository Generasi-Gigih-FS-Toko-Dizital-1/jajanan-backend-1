import type Pagination from './Pagination'

export default class RepositoryArgument {
  where?: any
  orderBy?: any
  include?: any
  pagination?: Pagination
  data?: any

  constructor (where?: any, include?: any, pagination?: Pagination, data?: any, orderBy?: any) {
    this.where = where
    this.orderBy = orderBy
    this.include = include
    this.pagination = pagination
    this.data = data
  }

  convertToPrismaArgs = (): any => {
    const args: any = {}

    if (this.where !== undefined) {
      args.where = this.where
    }

    if (this.orderBy !== undefined) {
      args.orderBy = this.orderBy
    }

    if (this.include !== undefined) {
      args.include = this.include
    }

    if (this.data !== undefined) {
      args.data = this.data
    }

    if (this.pagination !== undefined) {
      args.take = this.pagination.pageSize
      args.skip = (this.pagination.pageNumber - 1) * this.pagination.pageSize
    }

    return args
  }
}
