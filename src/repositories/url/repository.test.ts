import * as mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { UrlRepository } from './repository'
import { Url } from '../../url/domain'

describe('UrlRepository', () => {
  let con: mongoose.Mongoose
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    con = await mongoose.connect(mongoServer.getUri(), {
      dbName: process.env.MONGODB_DATABASE,
    })
  })

  afterEach(async () => {
    const collections = con.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany()
    }
  })

  afterAll(async () => {
    if (con) {
      await con.connection.close()
    }
    if (mongoServer) {
      await mongoServer.stop()
    }
  })

  const repository = new UrlRepository()

  describe('save', () => {
    it('should save Url', async () => {
      const alias = 't1'
      const url = new Url({
        alias,
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      await expect(repository.save(url)).resolves.not.toThrow()
    })

    it('should find a saved Url', async () => {
      const alias = 't2'
      const url = new Url({
        alias,
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      await repository.save(url)

      const u = await repository.findByAlias(alias)

      expect(u).toBeDefined()
      expect(u!.alias).toEqual(alias)
    })

    it('should not save Urls with the same alias', async () => {
      const alias = 't3'
      const url = new Url({
        alias,
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      await repository.save(url)

      try {
        await repository.save(url)
      } catch (error) {
        expect(error).toBeDefined()
        expect((error as Error).message).toContain('duplicate key error')
      }
    })
  })

  describe('find', () => {
    it('should return all', async () => {
      const u1 = new Url({
        alias: 'u1',
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      const u2 = new Url({
        alias: 'u2',
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      await repository.save(u1)
      await repository.save(u2)

      const results = await repository.find()

      expect(results.length).toEqual(2)
    })

    it('should limit results', async () => {
      const limit = 1
      const skip = 0

      const u1 = new Url({
        alias: 'u1',
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      const u2 = new Url({
        alias: 'u2',
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      await repository.save(u1)
      await repository.save(u2)

      const results = await repository.find(limit, skip)

      expect(results.length).toEqual(limit)
    })

    it('should skip results', async () => {
      const limit = 0
      const skip = 1

      const u1 = new Url({
        alias: 'u1',
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      const u2 = new Url({
        alias: 'u2',
        original: 'https://www.google.com',
        createdAt: new Date(),
      })

      await repository.save(u1)
      await repository.save(u2)

      const results = await repository.find(limit, skip)

      expect(results.length).toEqual(1)
      expect(results[0].alias).toEqual(u2.alias)
    })
  })
})
