import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './modules/app/app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  console.log(`API disponible en ${config.get<string>('API_BASE_URL') ?? `http://localhost:${port}/`}`);
}
await bootstrap();
