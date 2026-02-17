import { UserPagination } from '@/core/repositories/user-pagination'
import {
  FindManyUsersParams,
  UsersRepository,
} from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/entreprise/entities/user'
import { InMemorySubscriptionsRepository } from './in-memory-subscriptions-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  constructor(
    private subscriptionsRepository?: InMemorySubscriptionsRepository
  ) {}

  async save(user: User): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === user.id.toString()
    )

    if (index >= 0) {
      this.items[index] = user
    } else {
      this.items.push(user)
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)
    return user ?? null
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id)
    return user ?? null
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
    let filtered = this.items

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchLower)
      )
    }

    if (startDate) {
      filtered = filtered.filter((item) => item.createdAt >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((item) => item.createdAt <= endDate)
    }

    if (role) {
      filtered = filtered.filter((item) => item.role === role)
    }

    if (active !== undefined || planId) {
      const results: User[] = []
      for (const item of filtered) {
        const sub = this.subscriptionsRepository
          ? await this.subscriptionsRepository.findByUserId(item.id.toString())
          : null
        if (!sub) continue
        if (active !== undefined && sub.active !== active) continue
        if (planId && sub.planId.toString() !== planId) continue
        results.push(item)
      }
      filtered = results
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    const totalItems = filtered.length
    const offset = (page - 1) * perPage
    const paged = filtered.slice(offset, offset + perPage)

    const users = await Promise.all(
      paged.map(async (user) => {
        const subscription = this.subscriptionsRepository
          ? await this.subscriptionsRepository.findByUserId(user.id.toString())
          : null
        return { user, subscription }
      })
    )

    return {
      users,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
      offset,
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id)
  }

  async findAllIds(): Promise<string[]> {
    return this.items.map((item) => item.id.toString())
  }
}
