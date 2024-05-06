import { Document, Mongoose } from 'mongoose'
import { IUrlDocument, UrlModel } from './model'
import { Url } from '../../url/domain'
import { UrlMapper } from './mapper'

export interface IUrlRepository {
  save(url: Url): void
  findByAlias(alias: string): Promise<Url | null>
}

export class UrlRepository implements IUrlRepository {
  private mapper: UrlMapper

  constructor() {
    this.mapper = new UrlMapper()
  }

  public async save(url: Url): Promise<void> {
    const model = this.mapper.toPersistence(url)
    try {
      await model.save()
    } catch (e) {
      throw e
    }
  }

  public async findByAlias(alias: string): Promise<Url | null> {
    let urlDoc: IUrlDocument | null

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
}
