// infra/auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { Role } from '@/core/enums/enums'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    )

    if (isPublic) {
      return true
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    )

    if (!requiredRoles || requiredRoles.length === 0) {
      return true // sem roles = qualquer usuário autenticado
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.roles) {
      return false
    }

    return requiredRoles.some(role =>
      user.roles.includes(role),
    )
  }
}
