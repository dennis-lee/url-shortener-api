import express from 'express'
import { UrlService } from './url/service'
import { UrlController } from './url/controller'

import 'dotenv/config'

const app = express()
app.use(express.json())
const port = process.env.SERVER_PORT

const urlService = new UrlService()
const urlController = new UrlController(urlService)

app.post('/url', (req: express.Request, res: express.Response) => {
  const url = urlController.shortenUrl(req.body.url)
  res.status(200).json({
    url,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
