import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PlaceModule } from './place/place.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import configuration from './config/configuration';
import { LoggerMiddleware } from './lib/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PlaceModule,
    DrizzleModule,
    TransactionModule,
    UserModule,
    AuthModule,
    SessionModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*path');
  }
}
