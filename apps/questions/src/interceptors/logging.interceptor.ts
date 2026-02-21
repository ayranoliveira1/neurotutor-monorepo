import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable, tap, catchError } from 'rxjs'
import { Request, Response } from 'express'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP')

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>()
    const { method, url } = request
    const now = Date.now()

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>()
        const duration = Date.now() - now
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${duration}ms`,
        )
      }),
      catchError((error) => {
        const duration = Date.now() - now
        const status = error?.status || error?.getStatus?.() || 500
        const message = error?.message || 'Erro desconhecido'
        this.logger.error(
          `${method} ${url} ${status} - ${duration}ms - ${message}`,
        )
        throw error
      }),
    )
  }
}
