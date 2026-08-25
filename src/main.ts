import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsConfig, ServerConfig } from './config/configuration';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const config = app.get(ConfigService<ServerConfig>);
  const port = config.get<number>('port')!;
  const cors = config.get<CorsConfig>('cors')!;

  app.enableCors({
    origin: cors.origins,
    maxAge: cors.maxAge,
  });

  await app.listen(port);
}
bootstrap();
