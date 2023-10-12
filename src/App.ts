import express, { type Application } from 'express'
import './outers/configurations/DotenvConfiguration'
import OneDatastore from './outers/datastores/OneDatastore'
import RootRoute from './outers/routes/RootRoute'
import socketIo from 'socket.io'
import http from 'http'
import caseExpressMiddleware from './outers/middlewares/CaseExpressMiddleware'
import { type AddressInfo } from 'net'
import cors from 'cors'
import OneSeeder from './outers/seeders/OneSeeder'
import TwoDatastore from './outers/datastores/TwoDatastore'
import cookieParser from 'cookie-parser'
import PaymentGateway from './outers/gateways/PaymentGateway'

let app: Application | undefined
let io: socketIo.Server | undefined
let server: http.Server | undefined
const main = async (): Promise<void> => {
  app = express()
  app.use(cors())
  app.use(cookieParser())
  app.use(express.json({ type: '*/*' }))
  app.use(caseExpressMiddleware())

  const appHttp: http.Server = http.createServer(app)

  io = new socketIo.Server(
    appHttp,
    {
      cors: {
        origin: '*'
      }
    }
  )

  const oneDatastore: OneDatastore = new OneDatastore()
  const twoDatastore: TwoDatastore = new TwoDatastore()

  try {
    await oneDatastore.connect()
    console.log('One datastore connected.')
  } catch (error) {
    console.log('Error connecting to one datastore: ', error)
  }

  try {
    await twoDatastore.connect()
    console.log('Two datastore connected.')
  } catch (error) {
    console.log('Error connecting to two datastore: ', error)
  }

  const oneSeeder = new OneSeeder(oneDatastore)
  if (process.env.NODE_ENV === undefined) {
    throw new Error('NODE_ENV is undefined.')
  } else if (['test'].includes(process.env.NODE_ENV)) {
    await oneSeeder.down()
  } else if (['development', 'staging'].includes(process.env.NODE_ENV)) {
    await oneSeeder.down()
    await oneSeeder.up()
  } else {
    throw new Error('Unknown NODE_ENV.')
  }

  const rootRoute = new RootRoute(app, io, oneDatastore, twoDatastore)
  await rootRoute.registerRoutes()
  await rootRoute.registerSockets()

  const port = process.env.NODE_ENV === 'test' ? 0 : Number(process.env.APP_PORT)
  if (port === undefined) {
    throw new Error('Port is undefined.')
  }

  server = await new Promise((resolve, reject) => {
    const server: http.Server = appHttp.listen(port, () => {
      resolve(server)
    })
  })

  const addressInfo: AddressInfo = server?.address() as AddressInfo
  console.log(`App listening on port ${addressInfo.port}.`)
}

main()
  .then(() => {
    console.log('App started.')
  })
  .catch((error) => {
    console.log('Error starting app: ', error)
  })

export { app, server, io }
