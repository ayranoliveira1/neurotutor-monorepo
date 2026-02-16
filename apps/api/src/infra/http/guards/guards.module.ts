import { Global, Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CustomThrottlerGuard } from './throttler.guard'
import { AuthGuard } from './auth.guard'
import { RolesGuard } from './roles.guard'

@Global()
@Module({
  providers: [
    { provide: APP_GUARD, useClass: CustomThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    CustomThrottlerGuard,
    AuthGuard,
    RolesGuard,
  ],
  exports: [CustomThrottlerGuard, AuthGuard, RolesGuard],
})
export class GuardsModule {}
