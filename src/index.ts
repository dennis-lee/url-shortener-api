import express from 'express'
import { UrlService } from './url/service'
import { UrlController } from './url/controller'

import * as mongoose from 'mongoose'
import cors from 'cors'

import pino from 'pino'
import { pinoHttp } from 'pino-http'

import 'dotenv/config'
import { UrlRepository } from './repositories/url/repository'
import gracefulShutdown from 'http-graceful-shutdown'
import { ExpressRouter } from './api/router'

void main()

async function main() {
  const logger = pino({
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    },
  })

  const app = express()
  app.use(pinoHttp({ logger }))
  app.use(cors())
  app.use(express.json())

  const port = process.env.SERVER_PORT

  let db: mongoose.Mongoose

  try {
    const uri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`
    db = await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DATABASE,
      user: process.env.MONGODB_USERNAME,
      pass: process.env.MONGODB_PASSWORD,
    })
  } catch (e) {
    logger.error(`Error connecting to mongodb: ${e}`)
    return
  }

  const shortUrlRepo = new UrlRepository()
  const urlService = new UrlService(shortUrlRepo)
  const urlController = new UrlController(urlService)

  const router = new ExpressRouter(urlController)

  app.use('/api', router.create())

  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
  })

  gracefulShutdown(server, {
    onShutdown: async () => {
      logger.info('Closing connections')
      await db.disconnect()
    },
    finally: () => {
      logger.info('Server shutdown gracefully')
      process.exit(0)
    },
  })
}
