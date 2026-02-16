import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/entreprise/entities/user'
import { AuthProvider } from '../../providers/auth-provider'
import { Injectable } from '@nestjs/common'

interface AuthenticateAccountUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAccountUseCaseResponse = Either<
  ResourceNotFoundError<AuthenticateAccountUseCaseRequest>,
  { user: User; headers?: Record<string, string> }
>

@Injectable()
export class AuthenticateAccountUseCase {
  constructor(private authProvider: AuthProvider) {}

  async execute({
    email,
    password,
  }: AuthenticateAccountUseCaseRequest): Promise<AuthenticateAccountUseCaseResponse> {
    const apiCall = await this.authProvider.signIn(email, password)

    if (!apiCall) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Credenciais inválidas.',
            },
          ],
        })
      )
    }

    return right({ user: apiCall.user, headers: apiCall.headers })
  }
}
