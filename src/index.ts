import express from 'express'
import { UrlService } from './url/service'
import { UrlController } from './url/controller'

import * as mongoose from 'mongoose'
import cors from 'cors'

import pino from 'pino'
import { pinoHttp } from 'pino-http'

import 'dotenv/config'
import { UrlRepository } from './repositories/url/repository'

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

  try {
    const uri = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}`
    await mongoose.connect(uri, {
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

  app.post('/url', async (req: express.Request, res: express.Response) => {
    req.log.info('request received')

    try {
      const url = await urlController.shortenUrl(req.body.url)
      res.status(200).json({
        url,
      })
    } catch (e) {
      res.status(500).send((e as Error).message)
    }
  })

  app.get('/url', async (req: express.Request, res: express.Response) => {
    req.log.info('request received')
    let limit = 10
    let skip = 0

    if (req.query) {
      limit = Number(req.query['limit'])
      skip = Number(req.query['skip'])
    }

    try {
      const urls = await urlController.getUrls(limit, skip)
      res.status(200).json({
        urls,
      })
    } catch (e) {
      res.status(500).send((e as Error).message)
    }
  })

  app.get('/:alias', async (req: express.Request, res: express.Response) => {
    req.log.info('request received')

    try {
      const url = await urlController.getOriginalUrl(req.params.alias)
      if (!url) return res.sendStatus(404)

      res.status(200).json({ url })
    } catch (e) {
      res.status(500).send((e as Error).message)
    }
  })

  app.listen(port, () => {
    logger.info(`Server running on port ${port}`)
  })
}
