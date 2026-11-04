import { Module } from '@nestjs/common';
import { CalendarioService } from './calendario.service.js';
import { CalendarioController } from './calendario.controller.js';

@Module({
  controllers: [CalendarioController],
  providers: [CalendarioService],
})
export class CalendarioModule {}
