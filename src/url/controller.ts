import { IUrlService } from './service'

export interface IUrlController {
  shortenUrl(url: string): Promise<string>
  getOriginalUrl(id: string): Promise<string>
  getUrls(limit: number, skip: number): Promise<IUrlHttpObjects[]>
}

interface IUrlHttpObjects {
  alias: string
  original: string
  createdAt: string
}

export class UrlController implements IUrlController {
  constructor(private readonly urlService: IUrlService) {}

  public shortenUrl = async (url: string) => {
    const newUrl = await this.urlService.createShortUrl(url)

    return newUrl
  }

  public getOriginalUrl = async (id: string) => {
    const originalUrl = await this.urlService.getUrl(id)

    return originalUrl
  }

  public getUrls = async (limit: number, skip: number) => {
    const urls = await this.urlService.getUrls(limit, skip)

    const response: IUrlHttpObjects[] = []

    for (const u of urls) {
      response.push({
        alias: u.alias,
        original: u.original,
        createdAt: u.createdAt.toISOString(),
      })
    }

    return response
  }
}
