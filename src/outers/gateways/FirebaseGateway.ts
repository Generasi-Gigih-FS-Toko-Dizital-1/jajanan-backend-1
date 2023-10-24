import * as firebaseAdmin from 'firebase-admin'
import { randomUUID } from 'crypto'

export default class FirebaseGateway {
  app: firebaseAdmin.app.App

  constructor () {
    this.app = firebaseAdmin.initializeApp(
      {
        credential: firebaseAdmin.credential.applicationDefault()
      },
      randomUUID()
    )
  }

  sendNotificationByFirebaseTokens = async (firebaseTokens: string[], data: any): Promise<firebaseAdmin.messaging.BatchResponse> => {
    const message: firebaseAdmin.messaging.MulticastMessage = {
      data,
      tokens: firebaseTokens
    }
    return await this.app.messaging().sendEachForMulticast(message)
  }

  isFirebaseTokensValid = async (firebaseTokens: string[]): Promise<boolean[]> => {
    const result: firebaseAdmin.messaging.BatchResponse = await this.app.messaging().sendEachForMulticast({
      tokens: firebaseTokens
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
