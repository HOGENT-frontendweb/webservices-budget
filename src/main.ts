import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ServerConfig, CorsConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = app.get(ConfigService<ServerConfig>);
  const port = config.get<number>('port')!;
  const cors = config.get<CorsConfig>('cors')!;

  app.enableCors({
    origins: cors.origins,
    maxAge: cors.maxAge,
  });

  await app.listen(port);
}
bootstrap();
