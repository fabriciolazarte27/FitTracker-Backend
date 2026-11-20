import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

function convertir(exception: Prisma.PrismaClientKnownRequestError): HttpException {
  const codigoPostgres = (exception.meta?.driverAdapterError as { cause?: { originalCode?: string } })?.cause?.originalCode;
  if (codigoPostgres === '23514') {
    return new BadRequestException(['Los datos no cumplen las reglas de la base de datos']);
  }
  switch (exception.code) {
    case 'P2002':
      return new ConflictException(['Ya existe un registro con esos datos']);
    case 'P2003':
      return new ConflictException(['El registro hace referencia a otro que no existe o es usado por otro registro']);
    case 'P2025':
      return new NotFoundException(['No se encontró el registro']);
    default:
      return new InternalServerErrorException(['Error al acceder a la base de datos']);
  }
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const error = convertir(exception);
    host.switchToHttp().getResponse<Response>().status(error.getStatus()).json(error.getResponse());
  }
}