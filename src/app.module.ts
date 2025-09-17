import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [PlaceModule],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule { }
