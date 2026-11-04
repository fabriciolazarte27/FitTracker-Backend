import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from '../users/users.module.js';
import { RutinasModule } from '../rutinas/rutinas.module.js';
import { CalendarioModule } from '../calendario/calendario.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    RutinasModule,
    CalendarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}