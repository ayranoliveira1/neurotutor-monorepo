import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/core/enums/enums'
import { User } from '@/domain/entreprise/entities/user'
import {
  User as PrismaUser,
  Roles as PrismaRole,
} from '@/infra/generated/prisma'

const roleToDomain: Record<PrismaRole, Role> = {
  [PrismaRole.ADMIN]: Role.ADMIN,
  [PrismaRole.STUDENT]: Role.STUDENT,
  [PrismaRole.TEACHER]: Role.TEACHER,
}

const roleToPrisma: Record<Role, PrismaRole> = {
  [Role.ADMIN]: PrismaRole.ADMIN,
  [Role.STUDENT]: PrismaRole.STUDENT,
  [Role.TEACHER]: PrismaRole.TEACHER,
}

export class UsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        emailVerified: raw.emailVerified,
        image: raw.image,
        role: raw.role ? roleToDomain[raw.role] : null,
        cpfCnpj: raw.cpfCnpj || undefined,
        phone: raw.phone || undefined,
        address: raw.address || undefined,
        addressNumber: raw.addressNumber || undefined,
        province: raw.province || undefined,
        postalCode: raw.postalCode || undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(user: User) {
    return {
      id: user.id.toValue(),
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      cpfCnpj: user.cpfCnpj,
      phone: user.phone,
      address: user.address,
      addressNumber: user.addressNumber,
      province: user.province,
      postalCode: user.postalCode,
      image: user.image,
      role: user.role ? roleToPrisma[user.role] : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
