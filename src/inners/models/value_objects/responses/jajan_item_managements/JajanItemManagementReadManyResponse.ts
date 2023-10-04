import type JajanItemManagementReadOneResponse from './JajanItemManagementReadOneResponse'

export default class JajanItemManagementReadManyResponse {
  totalJajanItems: number
  jajanItems: JajanItemManagementReadOneResponse[]

  constructor (
    totalJajanItems: number,
    jajanItems: JajanItemManagementReadOneResponse[]
  ) {
    this.totalJajanItems = totalJajanItems
    this.jajanItems = jajanItems
  }
}
