import { UrlController } from './controller'
import { UrlService } from './service'
import { UrlRepository } from '../repositories/url/repository'
import { Url } from './domain'

describe('UrlController', () => {
  const MockUrlRepository = UrlRepository as jest.Mocked<typeof UrlRepository>
  const MockUrlService = UrlService as jest.Mocked<typeof UrlService>
  const repository = new MockUrlRepository()
  const service = new MockUrlService(repository)
  const controller = new UrlController(service)

  describe('shortenUrl', () => {
    it('should call UrlService.createShortUrl', async () => {
      repository.findByAlias = jest.fn().mockReturnValueOnce(null)
      repository.save = jest.fn().mockReturnValueOnce(null)

      const req = {
        body: {
          url: 'https://www.google.com',
        },
        query: {},
        params: {},
      }

      const createShortUrl = jest.spyOn(service, 'createShortUrl')
      await controller.shortenUrl(req)

      expect(createShortUrl).toHaveBeenCalledTimes(1)
    })
  })

  describe('getUrl', () => {
    it('should call UrlService.getUrl', async () => {
      const alias = 'abc123'
      const original = 'https://www.google.com'

      repository.findByAlias = jest.fn().mockReturnValueOnce(
        new Url({
          alias,
          original,
          createdAt: new Date(),
        }),
      )

      const req = {
        body: {},
        query: {},
        params: {
          alias,
        },
      }

      const getUrl = jest.spyOn(service, 'getUrl')
      const act = await controller.getOriginalUrl(req)

      expect(getUrl).toHaveBeenCalledTimes(1)
      expect(act.body?.url).toBe(original)
    })
  })
})
