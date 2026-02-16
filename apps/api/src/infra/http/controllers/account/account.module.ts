import { Module } from '@nestjs/common'
import { CreateAccountController } from './create-account.controller'
import { CreateAccountUseCase } from '@/domain/application/use-cases/account/create-account-use-case'
import { AuthenticateAccountController } from './authenticate.controller'
import { AuthenticateAccountUseCase } from '@/domain/application/use-cases/account/authenticate-account-use-case'
import { AuthProvider } from '@/domain/application/providers/auth-provider'
import { BetterAuthProvider } from '@/infra/auth/auth-provider'
import { UpdateAccountController } from './update-account.controller'
import { UpdateAccountUseCase } from '@/domain/application/use-cases/account/update-account-use-case'
import { GetAccountByIdUseCase } from '@/domain/application/use-cases/account/get-account-by-id-use-case'
import { GetSubscriptionByUserIdUseCase } from '@/domain/application/use-cases/subscription/get-subscription-by-user-id-use-case'
import { GetCurrentUserController } from './get-current-user.controller'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateAccountController,
    UpdateAccountController,
    GetCurrentUserController,
  ],
  providers: [
    { provide: AuthProvider, useClass: BetterAuthProvider },
    CreateAccountUseCase,
    AuthenticateAccountUseCase,
    UpdateAccountUseCase,
    GetAccountByIdUseCase,
    GetSubscriptionByUserIdUseCase,
  ],
})
export class AccountModule {}
