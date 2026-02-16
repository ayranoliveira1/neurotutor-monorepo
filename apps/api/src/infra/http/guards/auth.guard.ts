import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { auth } from '@/infra/auth/auth'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { IS_PUBLIC_SUBSCRIPTION_KEY } from '../decorators/public-subscription.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  private getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const isPublicSubscription = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_SUBSCRIPTION_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (isPublic) {
      return true
    }

    const request = this.getRequest(context)
    const session = await auth.api.getSession({
      headers: request.headers as any,
    })

    if (!session?.user) {
      throw new UnauthorizedException('Não autorizado -> Sessão inválida')
    }

    if (!isPublicSubscription) {
      const hasSubscription = await this.prisma.subscription.findFirst({
        where: {
          userId: session.user.id,
          active: true,
        },
      })

      const endDateIsValid = hasSubscription?.endDate
        ? hasSubscription.endDate > new Date()
        : false

      if (!hasSubscription || !endDateIsValid) {
        if (hasSubscription) {
          await this.prisma.subscription.update({
            where: {
              id: hasSubscription.id,
            },
            data: {
              active: false,
            },
          })
        }

        throw new UnauthorizedException('Não autorizado -> Assinatura inválida')
      }
      request.subscription = hasSubscription
    }

    request.user = session.user

    return !!session.user
  }
}
