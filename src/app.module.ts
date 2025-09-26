import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PlaceModule } from './place/place.module';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle/drizzle.module';
import configuration from './config/configuration';

@Module({
  imports: [PlaceModule, ConfigModule.forRoot({
    load: [configuration],
    isGlobal: true,
  }), DrizzleModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule { }
