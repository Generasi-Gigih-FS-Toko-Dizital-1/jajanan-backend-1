import type TopUpCreateRequest from '../../inners/models/value_objects/requests/top_up/TopUpCreateRequest'

export default class TopUpRepository {
  snap
  constructor (snap: any) {
    this.snap = snap
  }

  generateTopUpUrl = async (topUpData: TopUpCreateRequest): Promise<string> => {
    const generatedTopUpUrl = this.snap.createTransactionRedirectUrl(topUpData)
      .then((redirectUrl: string) => {
        return redirectUrl
      })

    return generatedTopUpUrl
  }
}
