import { UserPagination } from '@/core/repositories/user-pagination'
import {
  FindManyUsersParams,
  UsersRepository,
} from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/entreprise/entities/user'
import { UsersMapper } from '../mappers/prisma-users-mapper'
import { SubscriptionsMapper } from '../mappers/prisma-subscriptions-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@/infra/generated/prisma'

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return UsersMapper.toDomain(user)
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) {
      return null
    }

    return UsersMapper.toDomain(user)
  }

  async findMany({
    page,
    perPage,
    search,
    startDate,
    endDate,
    role,
    active,
    planId,
  }: FindManyUsersParams): Promise<UserPagination> {
    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    if (role) {
      where.role = role as Prisma.EnumRolesFilter['equals']
    }

    if (active !== undefined || planId) {
      const some: Prisma.SubscriptionWhereInput = {}
      if (active !== undefined) some.active = active
      if (planId) some.planId = planId
      where.subscriptions = { some }
    }

    const offset = (page - 1) * perPage

    const [users, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: offset,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { subscriptions: true },
      }),
      this.prisma.user.count({ where }),
    ])

    return {
      users: users.map((raw) => ({
        user: UsersMapper.toDomain(raw),
        subscription: raw.subscriptions[0]
          ? SubscriptionsMapper.toDomain(raw.subscriptions[0])
          : null,
      })),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
      offset,
    }
  }

  async save(user: User): Promise<void> {
    const data = UsersMapper.toPrisma(user)

    await this.prisma.user.update({
      where: { id: user.id.toString() },
      data: data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    })
  }
}
