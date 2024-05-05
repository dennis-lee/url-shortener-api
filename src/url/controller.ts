import { IUrlService } from './service'

export interface IUrlController {
  shortenUrl(url: string): string
}

export class UrlController implements IUrlController {
  constructor(private readonly urlService: IUrlService) {}

  public shortenUrl = (url: string) => {
    const newUrl = this.urlService.createShortUrl(url)

    return newUrl
  }
}
