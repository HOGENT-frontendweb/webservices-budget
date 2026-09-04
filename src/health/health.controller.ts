import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('ping')
  ping(): { pong: boolean } {
    return { pong: true };
  }
}
