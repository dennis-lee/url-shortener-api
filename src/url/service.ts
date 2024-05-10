/* eslint-disable no-useless-catch */
import { createHash } from 'crypto'
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

    let alias = this.hash(sanitizedUrl, 7)
    try {
      for (;;) {
        const found = await this.urlRepository.findByAlias(alias)
        if (!found) {
          break
        }

        alias = this.hash(sanitizedUrl, 7)
      }
    } catch (e) {
      throw e
    }

    const u = new Url({
      alias,
      original: sanitizedUrl,
      createdAt: new Date(),
    })

    try {
      await this.urlRepository.save(u)
    } catch (e) {
      throw e
    }

    return u.alias
  }

  public async getUrl(alias: string): Promise<string> {
    let url: Url | null

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
    try {
      const urls = await this.urlRepository.find(limit, skip)
      return urls
    } catch (e) {
      throw e
    }
  }

  private hash(s: string, length: number): string {
    const [seconds, nanoseconds] = process.hrtime()
    const input = s + (seconds * 1000000000 + nanoseconds).toString()
    const md5 = createHash('md5').update(input).digest('hex')
    return Buffer.from(md5, 'hex').toString('base64').substring(0, length)
  }
}
