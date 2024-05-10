import { UrlRepository } from '../repositories/url/repository'
import { Url } from './domain'
import { UrlService } from './service'

describe('UrlService', () => {
  const MockUrlRepository = UrlRepository as jest.Mocked<typeof UrlRepository>
  const repository = new MockUrlRepository()
  const service = new UrlService(repository)

  describe('createShortUrl', () => {
    it('should only accept valid URLs', async () => {
      repository.findByAlias = jest.fn().mockReturnValueOnce(null)
      repository.save = jest.fn().mockReturnValueOnce({})

      const validUrl = 'https://www.google.com'
      const invalidUrl = 'test'

      await expect(service.createShortUrl(validUrl)).resolves.not.toThrow()
      await expect(service.createShortUrl(invalidUrl)).rejects.toThrow()
    })

    it('should accept URLs without protocol', async () => {
      repository.findByAlias = jest.fn().mockReturnValueOnce(null)
      repository.save = jest.fn().mockReturnValueOnce({})

      const urlWithoutProtocol = 'www.google.com'

      await expect(service.createShortUrl(urlWithoutProtocol)).resolves.not.toThrow()
    })

    it('should generate a new alias when there is collision', async () => {
      const alias = '123'

      const u1 = new Url({
        alias,
        original: 'http://www.google.com',
        createdAt: new Date(),
      })

      const hashSpy = jest.spyOn(UrlService.prototype as never, 'hash')
      repository.findByAlias = jest.fn().mockReturnValueOnce(u1)
      repository.save = jest.fn().mockReturnValueOnce({})

      await expect(service.createShortUrl(u1.original)).resolves.not.toThrow()
      expect(repository.save).toHaveBeenCalledTimes(1)
      expect(hashSpy).toHaveBeenCalledTimes(2)
    })
  })
})
