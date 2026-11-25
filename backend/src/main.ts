import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('json', { limit: '50mb' });
  app.useBodyParser('urlencoded', { limit: '50mb', extended: true });
  app.enableCors();
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Backend NestJS application running on http://localhost:${port}`);
}
await bootstrap();
