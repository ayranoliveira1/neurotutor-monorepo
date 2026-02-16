import { ExecutionContext, Injectable } from '@nestjs/common'
import {
  ThrottlerGuard,
  ThrottlerModuleOptions,
  ThrottlerStorage,
} from '@nestjs/throttler'
import { THROTTLER_LIMIT } from '@nestjs/throttler/dist/throttler.constants'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(
    options: ThrottlerModuleOptions,
    storage: ThrottlerStorage,
    reflector: Reflector
  ) {
    super(options, storage, reflector)
  }

  private hasThrottleMetadata(context: ExecutionContext): boolean {
    const handler = context.getHandler()
    const keys = Reflect.getMetadataKeys(handler)
    return keys.some((key: string) => key.startsWith(THROTTLER_LIMIT))
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.hasThrottleMetadata(context)) {
      return super.canActivate(context)
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    return super.canActivate(context)
  }
}
