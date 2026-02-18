import { ApiKeyGuard } from './api-key.guard'
import { UnauthorizedException } from '@nestjs/common'

const mockConfigService = {
  get: vi.fn().mockReturnValue('test-api-key'),
}

function createMockContext(apiKey?: string) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          'x-api-key': apiKey,
        },
      }),
    }),
  } as any
}

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard

  beforeEach(() => {
    guard = new ApiKeyGuard(mockConfigService as any)
  })

  it('deve permitir requisição com API key válida', () => {
    const context = createMockContext('test-api-key')
    expect(guard.canActivate(context)).toBe(true)
  })

  it('deve rejeitar requisição sem API key', () => {
    const context = createMockContext(undefined)
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
  })

  it('deve rejeitar requisição com API key inválida', () => {
    const context = createMockContext('wrong-key')
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException)
  })
})
