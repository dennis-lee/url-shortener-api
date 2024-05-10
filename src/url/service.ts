import { nanoid } from 'nanoid'
import { IUrlRepository } from '../repositories/url/repository'
import { Url } from './domain'
import { isURL } from 'validator'

export interface IUrlService {
  createShortUrl(url: string): Promise<string>
  getUrl(id: string): Promise<string>
  getUrls(limit: number, skip: number): Promise<Url[]>
}

const URL_VALIDATOR_OPTIONS = {
  require_protocol: false,
}

export class UrlService implements IUrlService {
  constructor(private readonly urlRepository: IUrlRepository) {}

  public async createShortUrl(url: string): Promise<string> {
    if (!isURL(url, URL_VALIDATOR_OPTIONS)) {
      throw new Error(`invalid url: ${url}`)
    }

    let sanitizedUrl = url
    try {
      new URL(url)
    } catch (_) {
      sanitizedUrl = 'http://' + url
    }

    const u = new Url({
      alias: nanoid(7),
      original: sanitizedUrl,
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

  public async getUrls(limit: number, skip: number): Promise<Url[]> {
    // TODO: remove disable
    // eslint-disable-next-line no-useless-catch
    try {
      const urls = await this.urlRepository.find(limit, skip)
      return urls
    } catch (e) {
      throw e
    }
  }
}
