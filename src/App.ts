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

let app: Application | undefined
let io: socketIo.Server | undefined
let server: http.Server | undefined
const main = async (): Promise<void> => {
  app = express()
  app.use(cors())
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

  const oneDatastore = new OneDatastore()

  try {
    await oneDatastore.connect()
    console.log('One datastore connected.')
  } catch (error) {
    console.log('Error connecting to one datastore: ', error)
  }

  const oneMigration = new OneSeeder(oneDatastore)
  if (process.env.NODE_ENV !== 'test') {
    await oneMigration.down()
    await oneMigration.up()
  } else {
    await oneMigration.down()
  }

  const rootRoute = new RootRoute(app, io, oneDatastore)
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
