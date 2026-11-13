import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module.js';

function obtenerMensajes(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => [
    ...Object.values(error.constraints ?? {}),
    ...obtenerMensajes(error.children ?? []),
  ]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Devuelve solo los mensajes definidos en las DTOs, sin el prefijo
      // "ejercicios.0." que Nest agrega en las validaciones anidadas.
      exceptionFactory: (errors) => new BadRequestException(obtenerMensajes(errors)),
    }),
  );
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 4000;
  await app.listen(port);
  console.log(`API disponible en ${config.get<string>('API_BASE_URL') ?? `http://localhost:${port}/`}`);
}
await bootstrap();
