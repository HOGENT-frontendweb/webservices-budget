import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PlaceModule } from './place/place.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { TransactionModule } from './transaction/transaction.module';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './lib/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    PlaceModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DrizzleModule,
    TransactionModule,
    UserModule,
    AuthModule,
    SessionModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
