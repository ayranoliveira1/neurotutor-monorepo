import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { type Env } from '@/env/env'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService<Env, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.headers['x-api-key']

    if (!apiKey || apiKey !== this.config.get('API_KEY')) {
      throw new UnauthorizedException('API key inválida')
    }

    return true
  }
}
