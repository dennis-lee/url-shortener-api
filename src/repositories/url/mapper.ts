import { Url } from '../../url/domain'
import { IUrlDocument, UrlModel } from './model'

export interface IUserMapper {
  toPersistence(url: Url): InstanceType<typeof UrlModel>
  toDomain(urlDocument: IUrlDocument): Url
}

export class UrlMapper implements IUserMapper {
  public toPersistence(url: Url): InstanceType<typeof UrlModel> {
    const newUrl = new UrlModel({
      alias: url.alias,
      original: url.original,
      created_at: url.createdAt,
    })

    return newUrl
  }

  public toDomain(urlDocument: IUrlDocument): Url {
    const url = new Url({
      alias: urlDocument.alias,
      original: urlDocument.original,
      createdAt: urlDocument.created_at,
    })

    return url
  }
}
