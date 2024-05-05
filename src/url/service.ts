export interface IUrlService {
  createShortUrl(url: string): string
}

export class UrlService implements IUrlService {
  public createShortUrl(url: string): string {
    // TODO: replace with actual logic
    return Math.random().toString(36).slice(2)
  }
}
