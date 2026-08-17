import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health/health.controller';
import { PlaceController } from './place/place.controller';
import { PlaceService } from './place/place.service';

@Module({
  imports: [],
  controllers: [AppController, HealthController, PlaceController],
  providers: [AppService, PlaceService],
})
export class AppModule {}
