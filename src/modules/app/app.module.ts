import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from '../users/users.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { EjerciciosModule } from '../ejercicios/ejercicios.module.js';
import { RutinasModule } from '../rutinas/rutinas.module.js';
import { CalendarioModule } from '../calendario/calendario.module.js';

@Module({
   imports: [
     ConfigModule.forRoot({ isGlobal: true }),
     UsersModule,
     AuthModule,
     EjerciciosModule,
     RutinasModule,
     CalendarioModule,
   ],
   controllers: [AppController],
   providers: [AppService],
 })
 export class AppModule {}