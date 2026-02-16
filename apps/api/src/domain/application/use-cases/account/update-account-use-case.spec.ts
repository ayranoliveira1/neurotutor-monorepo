import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { MakeUser } from '@test/factories/make-user'
import { UpdateAccountUseCase } from './update-account-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: UpdateAccountUseCase

describe('Update Account', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new UpdateAccountUseCase(inMemoryUsersRepository)
  })

  it('should be able to update user profile', async () => {
    const user = MakeUser({ name: 'John Doe' })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'Jane Doe',
      phone: '11999999999',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('Jane Doe')
      expect(result.value.user.phone).toBe('11999999999')
    }
  })

  it('should keep existing values when fields are not provided', async () => {
    const user = MakeUser({
      name: 'John Doe',
      cpfCnpj: '123.456.789-00',
      phone: '11999999999',
    })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'New Name',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('New Name')
      expect(result.value.user.cpfCnpj).toBe('123.456.789-00')
      expect(result.value.user.phone).toBe('11999999999')
    }
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existing-id',
      name: 'Jane Doe',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to update address fields', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      address: 'Rua das Flores, 123',
      addressNumber: '456',
      postalCode: '01234-567',
      province: 'SP',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.address).toBe('Rua das Flores, 123')
      expect(result.value.user.addressNumber).toBe('456')
      expect(result.value.user.postalCode).toBe('01234-567')
      expect(result.value.user.province).toBe('SP')
    }
  })
})
