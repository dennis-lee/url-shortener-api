import { nanoid } from 'nanoid'
import { IUrlRepository } from '../repositories/url/repository'
import { Url } from './domain'

export interface IUrlService {
  createShortUrl(url: string): Promise<string>
  getUrl(id: string): Promise<string>
}

export class UrlService implements IUrlService {
  constructor(private readonly urlRepository: IUrlRepository) {}

  public async createShortUrl(url: string): Promise<string> {
    try {
      new URL(url)
    } catch (_) {
      throw new Error(`invalid url: ${url}`)
    }

    const u = new Url({
      alias: nanoid(7),
      original: url,
      createdAt: new Date(),
    })

    // TODO: remove disable
    // eslint-disable-next-line no-useless-catch
    try {
      await this.urlRepository.save(u)
    } catch (e) {
      throw e
    }

    return u.alias
  }

  public async getUrl(alias: string): Promise<string> {
    let url: Url | null

    // TODO: remove disable
    // eslint-disable-next-line no-useless-catch
    try {
      url = await this.urlRepository.findByAlias(alias)
    } catch (e) {
      throw e
    }

    if (!url) {
      throw new Error(`invalid alias: ${alias}`)
    }

    return url.original
  }
}
