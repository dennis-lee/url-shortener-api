import { UrlController } from './controller'
import { UrlService } from './service'

describe('UrlController', () => {
  const MockUrlService = UrlService as jest.Mocked<typeof UrlService>
  const service = new MockUrlService()
  const controller = new UrlController(service)

  describe('shortenUrl', () => {
    it('should call UrlService.createShortUrl', () => {
      const spy = jest.spyOn(service, 'createShortUrl')
      controller.shortenUrl('test')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })
})
