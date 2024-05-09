import { HandlerFunction, IControllerRequest } from '../api/router'
import { IUrlService } from './service'

export interface IUrlController {
  shortenUrl: HandlerFunction
  getOriginalUrl: HandlerFunction
  getUrls: HandlerFunction
}

export class UrlController implements IUrlController {
  constructor(private readonly urlService: IUrlService) {}

  public shortenUrl = async (payload: IControllerRequest) => {
    const originalUrl = payload.body.url as string
    const shortUrl = await this.urlService.createShortUrl(originalUrl)

    return {
      code: 200,
      body: {
        url: shortUrl,
      },
    }
  }

  public getOriginalUrl = async (payload: IControllerRequest) => {
    const alias = payload.params.alias as string

    const originalUrl = await this.urlService.getUrl(alias)
    if (!originalUrl)
      return {
        code: 404,
        body: null,
      }

    return {
      code: 200,
      body: {
        url: originalUrl,
      },
    }
  }

  public getUrls = async (payload: IControllerRequest) => {
    let limit = 10
    let skip = 0

    if (payload.query) {
      limit = Number(payload.query['limit'])
      skip = Number(payload.query['skip'])
    }

    const shortenedUrls = await this.urlService.getUrls(limit, skip)

    const urls = shortenedUrls.map((u) => {
      return { alias: u.alias, original: u.original, createdAt: u.createdAt.toISOString() }
    })

    return {
      code: 200,
      body: {
        urls,
      },
    }
  }
}
