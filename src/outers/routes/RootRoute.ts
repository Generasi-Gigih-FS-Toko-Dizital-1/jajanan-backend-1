import {type Application, Router} from 'express'
import type OneDatastore from '../datastores/OneDatastore'
import UserRepository from '../repositories/UserRepository'
import UserManagement from '../../inners/use_cases/managements/UserManagement'
import UserControllerRest from '../controllers/rests/UserControllerRest'
import type socketIo from 'socket.io'
import LoginAuthentication from '../../inners/use_cases/authentications/LoginAuthentication'
import RegisterAuthentication from '../../inners/use_cases/authentications/RegisterAuthentication'
import AuthenticationControllerRest from '../controllers/rests/AuthenticationControllerRest'

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

    const userRepository: UserRepository = new UserRepository(this.datastoreOne)
    const userManagement: UserManagement = new UserManagement(userRepository)
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

    this.app.use('/api/v1', routerVersionOne)
  }

  registerSockets = async (): Promise<void> => {

  }
}
