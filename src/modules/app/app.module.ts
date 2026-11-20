import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
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
     PrismaModule,
     JwtModule.registerAsync({
       global: true,
       inject: [ConfigService],
       useFactory: (config: ConfigService) => ({
         secret: config.getOrThrow<string>('JWT_SECRET'),
         signOptions: { expiresIn: '1d' },
       }),
     }),
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