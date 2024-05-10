import { UrlRepository } from '../repositories/url/repository'
import { UrlService } from './service'

describe('UrlService', () => {
  const MockUrlRepository = UrlRepository as jest.Mocked<typeof UrlRepository>
  const repository = new MockUrlRepository()
  const service = new UrlService(repository)

  describe('createShortUrl', () => {
    it('should only accept valid URLs', async () => {
      repository.save = jest.fn().mockReturnValueOnce({})

      const validUrl = 'https://www.google.com'
      const invalidUrl = 'test'

      await expect(service.createShortUrl(validUrl)).resolves.not.toThrow()
      await expect(service.createShortUrl(invalidUrl)).rejects.toThrow()
    })

    it('should accept URLs without protocol', async () => {
      repository.save = jest.fn().mockReturnValueOnce({})

      const urlWithoutProtocol = 'www.google.com'

      await expect(service.createShortUrl(urlWithoutProtocol)).resolves.not.toThrow()
    })
  })
})
