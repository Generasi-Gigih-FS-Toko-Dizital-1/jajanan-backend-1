import * as firebaseAdmin from 'firebase-admin'

export default class FirebaseGateway {
  app: firebaseAdmin.app.App

  constructor () {
    this.app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.applicationDefault()
    })
  }

  sendNotificationByRegistrationTokens = async (registrationTokens: string[], data: any): Promise<firebaseAdmin.messaging.BatchResponse> => {
    const message: firebaseAdmin.messaging.MulticastMessage = {
      data,
      tokens: registrationTokens
    }
    return await this.app.messaging().sendEachForMulticast(message)
  }

  isRegistrationTokensValid = async (registrationTokens: string[]): Promise<boolean[]> => {
    const result: firebaseAdmin.messaging.BatchResponse = await this.app.messaging().sendEachForMulticast({
      tokens: registrationTokens
    })
    const isRegistrationTokensValid: boolean[] = []
    result.responses.forEach((response) => {
      if (response.success) {
        isRegistrationTokensValid.push(true)
      } else {
        isRegistrationTokensValid.push(false)
      }
    })
    return isRegistrationTokensValid
  }
}
