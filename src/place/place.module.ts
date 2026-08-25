import { Module } from '@nestjs/common';
import { PlaceController } from './place.controller';
import { PlaceService } from './place.service';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [DrizzleModule, TransactionModule],
  controllers: [PlaceController],
  providers: [PlaceService],
  exports: [PlaceService],
})
export class PlaceModule {}
