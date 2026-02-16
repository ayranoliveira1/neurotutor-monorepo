import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/core/enums/enums'
import { User } from '@/domain/entreprise/entities/user'
import {
  User as PrismaUser,
  Roles as PrismaRole,
} from '@/infra/generated/prisma'

export class UsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        emailVerified: raw.emailVerified,
        image: raw.image,
        role: raw.role ? this.mapRoleToDomain(raw.role) : null,
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
      role: user.role ? this.mapRoleToPrisma(user.role) : undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  private static mapRoleToPrisma(role: Role): PrismaRole {
    switch (role) {
      case Role.ADMIN:
        return PrismaRole.Admin
      case Role.STUDENT:
        return PrismaRole.Student
      case Role.TEACHER:
        return PrismaRole.Teacher
      default:
        throw new Error(`Invalid domain role: ${role}`)
    }
  }

  private static mapRoleToDomain(role: PrismaRole): Role {
    switch (role) {
      case PrismaRole.Admin:
        return Role.ADMIN
      case PrismaRole.Student:
        return Role.STUDENT
      case PrismaRole.Teacher:
        return Role.TEACHER
      default:
        throw new Error(`Invalid prisma role: ${role}`)
    }
  }
}
