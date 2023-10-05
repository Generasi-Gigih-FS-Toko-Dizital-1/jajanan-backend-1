import { type Application, Router } from 'express'
import type OneDatastore from '../datastores/OneDatastore'
import UserRepository from '../repositories/UserRepository'
import UserManagement from '../../inners/use_cases/managements/UserManagement'
import UserControllerRest from '../controllers/rests/UserControllerRest'
import type socketIo from 'socket.io'
import LoginAuthentication from '../../inners/use_cases/authentications/LoginAuthentication'
import RegisterAuthentication from '../../inners/use_cases/authentications/RegisterAuthentication'
import AuthenticationControllerRest from '../controllers/rests/AuthenticationControllerRest'
import ObjectUtility from '../utilities/ObjectUtility'
import TopUpRepository from '../repositories/TopUpRepository'
import Midtrans from '../payment_gateway/midtrans'
import { randomUUID } from 'crypto'
import TopUp from '../../inners/use_cases/top_up/TopUp'
import TopUpControllerRest from '../controllers/rests/TopUpControllerRest'

export default class RootRoute {
  app: Application
  io: socketIo.Server
  datastoreOne: OneDatastore

  constructor (app: Application, io: socketIo.Server, datastoreOne: OneDatastore) {
    this.app = app
    this.io = io
    this.datastoreOne = datastoreOne
  }

  registerRoutes = async (): Promise<void> => {
    const routerVersionOne = Router()

    const objectUtility: ObjectUtility = new ObjectUtility()

    const userRepository: UserRepository = new UserRepository(this.datastoreOne)
    const userManagement: UserManagement = new UserManagement(userRepository, objectUtility)
    const userControllerRest: UserControllerRest = new UserControllerRest(
      Router(),
      userManagement
    )
    userControllerRest.registerRoutes()
    routerVersionOne.use('/users', userControllerRest.router)

    const loginAuthentication: LoginAuthentication = new LoginAuthentication(userManagement)
    const registerAuthentication: RegisterAuthentication = new RegisterAuthentication(userManagement)
    const authenticationControllerRest: AuthenticationControllerRest = new AuthenticationControllerRest(
      Router(),
      loginAuthentication,
      registerAuthentication
    )
    authenticationControllerRest.registerRoutes()
    routerVersionOne.use('/authentications', authenticationControllerRest.router)

    const paymentGateway = new Midtrans()
    const topUpRepository = new TopUpRepository(paymentGateway, randomUUID)
    const topUpUseCase = new TopUp(topUpRepository, userRepository)
    const topUpControllerRest = new TopUpControllerRest(Router(), topUpUseCase)
    topUpControllerRest.registerRoutes()
    routerVersionOne.use('/topup', topUpControllerRest.router)

    this.app.use('/api/v1', routerVersionOne)
  }

  registerSockets = async (): Promise<void> => {

  }
}
