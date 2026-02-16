import { AuthProvider } from '@/domain/application/providers/auth-provider'
import { User } from '@/domain/entreprise/entities/user'

export class FakeAuthProvider implements AuthProvider {
  public users: { user: User; password: string }[] = []

  async signUp(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null }> {
    const user = User.create({ name, email })
    this.users.push({ user, password })
    return { user }
  }

  async signIn(
    email: string,
    password: string
  ): Promise<{ user: User; headers?: Record<string, string> } | null> {
    const found = this.users.find(
      (item) => item.user.email === email && item.password === password
    )

    if (!found) {
      return null
    }

    return { user: found.user, headers: { 'set-cookie': 'session=fake-token' } }
  }
}
