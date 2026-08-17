import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [PlaceModule],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
