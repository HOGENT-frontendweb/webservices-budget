import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ServerConfig } from './config/configuration';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = app.get(ConfigService<ServerConfig>);
  const port = config.get<number>('port')!;

  app.enableCors({
    origin: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  });

  await app.listen(port);
}
bootstrap();
