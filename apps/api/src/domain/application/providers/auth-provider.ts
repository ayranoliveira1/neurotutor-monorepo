import { User } from '@/domain/entreprise/entities/user'

export abstract class AuthProvider {
  abstract signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null }>
  abstract signIn(
    email: string,
    password: string
  ): Promise<{ user: User; headers?: Record<string, string> } | null>
}
