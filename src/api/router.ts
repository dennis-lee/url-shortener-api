import express from 'express'
import { IUrlController } from '../url/controller'

export interface IControllerRequest {
  body: Record<string, unknown>
  query: Record<string, unknown>
  params: Record<string, unknown>
}

export interface IControllerResponse {
  code: number
  body: Record<string, unknown> | null
}

export type HandlerFunction = (req: express.Request) => Promise<IControllerResponse>

export class ExpressRouter {
  constructor(private readonly urlController: IUrlController) {}

  public create(): express.Router {
    const router = express.Router()

    router.post('/url', this.toController(this.urlController.shortenUrl))
    router.get('/url/:alias', this.toController(this.urlController.getOriginalUrl))
    router.get('/url', this.toController(this.urlController.getUrls))

    return router
  }

  private toController(handlerFunction: HandlerFunction): express.Handler {
    return async function handler(req: express.Request, res: express.Response): Promise<void> {
      req.log.info('request received')

      try {
        const result = await handlerFunction(req)

        if (result.body) {
          res.status(result.code).json(result.body)
        } else {
          res.status(result.code).end()
        }
      } catch (e) {
        res.status(500).json().end()
      }
    }
  }
}
