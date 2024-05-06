import { IUrlService } from './service'

export interface IUrlController {
  shortenUrl(url: string): Promise<string>
  getOriginalUrl(id: string): Promise<string>
}

export class UrlController implements IUrlController {
  constructor(private readonly urlService: IUrlService) {}

  public shortenUrl = async (url: string) => {
    const newUrl = await this.urlService.createShortUrl(url)

    return newUrl
  }

  public getOriginalUrl = async (id: string) => {
    const originalUrl = this.urlService.getUrl(id)

    return originalUrl
  }
}
