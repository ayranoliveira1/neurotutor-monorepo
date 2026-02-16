import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User, UserProps } from '@/domain/entreprise/entities/user'
import { faker } from '@faker-js/faker'

export function MakeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...override,
    },
    id
  )
  return user
}
