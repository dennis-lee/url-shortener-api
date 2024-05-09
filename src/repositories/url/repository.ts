import { IUrlDocument, UrlModel } from './model'
import { Url } from '../../url/domain'
import { UrlMapper } from './mapper'

export interface IUrlRepository {
  save(url: Url): void
  findByAlias(alias: string): Promise<Url | null>
  find(limit: number, skip: number): Promise<Url[]>
}

export class UrlRepository implements IUrlRepository {
  private mapper: UrlMapper

  constructor() {
    this.mapper = new UrlMapper()
  }

  public async save(url: Url): Promise<void> {
    const model = this.mapper.toPersistence(url)

    // TODO: remove disable
    // eslint-disable-next-line no-useless-catch
    try {
      await model.save()
    } catch (e) {
      throw e
    }
  }

  public async findByAlias(alias: string): Promise<Url | null> {
    let urlDoc: IUrlDocument | null

    // TODO: remove disable
    // eslint-disable-next-line no-useless-catch
    try {
      urlDoc = await UrlModel.findOne({ alias })
    } catch (e) {
      throw e
    }

    if (urlDoc) {
      const url = this.mapper.toDomain(urlDoc)
      return url
    }

    return null
  }

  public async find(limit: number = 10, skip: number = 0): Promise<Url[]> {
    let urlDocs: IUrlDocument[]

    // TODO: remove disable
    // eslint-disable-next-line no-useless-catch
    try {
      urlDocs = await UrlModel.find({}).limit(limit).skip(skip)
    } catch (e) {
      throw e
    }

    const urls = []

    for (const u of urlDocs) {
      urls.push(this.mapper.toDomain(u))
    }

    return urls
  }
}
