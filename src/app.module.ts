import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PlaceController } from './place/place.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController, PlaceController],
  providers: [AppService],
})
export class AppModule {}
