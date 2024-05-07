import { UrlController } from './controller'
import { UrlService } from './service'
import { UrlRepository } from '../repositories/url/repository'
import { UrlModel } from '../repositories/url/model'
import { Url } from './domain'

describe('UrlController', () => {
  const MockUrlRepository = UrlRepository as jest.Mocked<typeof UrlRepository>
  const MockUrlService = UrlService as jest.Mocked<typeof UrlService>
  const repository = new MockUrlRepository()
  const service = new MockUrlService(repository)
  const controller = new UrlController(service)

  describe('shortenUrl', () => {
    it('should call UrlService.createShortUrl', async () => {
      repository.save = jest.fn().mockReturnValueOnce(null)

      const createShortUrl = jest.spyOn(service, 'createShortUrl')
      await controller.shortenUrl('https://www.google.com')

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

      const getUrl = jest.spyOn(service, 'getUrl')
      const act = await controller.getOriginalUrl(alias)

      expect(getUrl).toHaveBeenCalledTimes(1)
      expect(act).toBe(original)
    })
  })
})
