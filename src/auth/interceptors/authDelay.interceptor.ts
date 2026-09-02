import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, delay, switchMap } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';

@Injectable()
export class AuthDelayInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(_: ExecutionContext, next: CallHandler) {
    const maxDelay = this.configService.get<number>('auth.maxDelay', 5000);
    const randomDelay = Math.round(Math.random() * maxDelay);
    return next.handle().pipe(
      delay(randomDelay),
      catchError((err) =>
        timer(randomDelay).pipe(switchMap(() => throwError(() => err))),
      ),
    );
  }
}
