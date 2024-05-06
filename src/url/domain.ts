export interface IUrlProps {
  alias: string
  original: string
  createdAt: Date
}

export class Url {
  constructor(private readonly props: IUrlProps) {}

  public get alias(): string {
    return this.props.alias
  }

  public get original(): string {
    return this.props.original
  }

  public get createdAt(): Date {
    return this.props.createdAt
  }
}
