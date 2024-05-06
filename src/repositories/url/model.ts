import { Schema, Model, model } from 'mongoose'
import { nanoid } from 'nanoid'

export interface IUrlDocument extends Document {
  alias: string
  original: string
  created_at: Date
}

const urlSchema = new Schema({
  alias: {
    type: String,
    required: true,
    unique: true,
  },
  original: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
})

export const UrlModel = model<IUrlDocument>('Url', urlSchema)
