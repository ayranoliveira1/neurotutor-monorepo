import { describe, it, expect, beforeEach } from 'vitest'
import { FakeAuthProvider } from '@test/providers/fake-auth-provider'
import { MakeUser } from '@test/factories/make-user'
import { AuthenticateAccountUseCase } from './authenticate-account-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let fakeAuthProvider: FakeAuthProvider
let sut: AuthenticateAccountUseCase

describe('Authenticate Account', () => {
  beforeEach(() => {
    fakeAuthProvider = new FakeAuthProvider()
    sut = new AuthenticateAccountUseCase(fakeAuthProvider)
  })

  it('should be able to authenticate with valid credentials', async () => {
    const user = MakeUser({ email: 'john@example.com' })
    fakeAuthProvider.users.push({ user, password: 'password123' })

    const result = await sut.execute({
      email: 'john@example.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.email).toBe('john@example.com')
      expect(result.value.headers).toBeDefined()
    }
  })

  it('should not authenticate with wrong password', async () => {
    const user = MakeUser({ email: 'john@example.com' })
    fakeAuthProvider.users.push({ user, password: 'password123' })

    const result = await sut.execute({
      email: 'john@example.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not authenticate with non-existing email', async () => {
    const result = await sut.execute({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
