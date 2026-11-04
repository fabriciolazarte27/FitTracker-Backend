import { Module } from '@nestjs/common';
import { EjerciciosService } from './ejercicios.service.js';
import { EjerciciosController } from './ejercicios.controller.js';

@Module({
  controllers: [EjerciciosController],
  providers: [EjerciciosService],
})
export class EjerciciosModule {}
