import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
