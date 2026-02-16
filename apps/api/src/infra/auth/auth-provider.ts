import { AuthProvider } from '@/domain/application/providers/auth-provider'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Role } from '@/core/enums/enums'
import { User } from '@/domain/entreprise/entities/user'
import { Injectable } from '@nestjs/common'
import { auth } from './auth'

@Injectable()
export class BetterAuthProvider implements AuthProvider {
  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; headers?: Record<string, string> } | null> {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      returnHeaders: true,
    })

    if (!result.response?.user) return null

    const userData = result.response.user

    const user = User.create(
      {
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        image: userData.image,
        role: userData.role as Role | null,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      new UniqueEntityID(userData.id)
    )

    const headers: Record<string, string> = {}
    result.headers.forEach((value, key) => {
      headers[key] = value
    })

    return { user, headers }
  }

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null }> {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    })

    if (!result.user) {
      return { user: null }
    }

    const userData = result.user

    const user = User.create(
      {
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        image: userData.image,
        role: userData.role as Role | null,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
      new UniqueEntityID(userData.id)
    )

    return { user }
  }
}
