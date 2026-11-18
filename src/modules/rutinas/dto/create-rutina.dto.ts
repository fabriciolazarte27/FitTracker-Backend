import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import type { UnidadEjercicio } from '../entities/rutina-ejercicio.entity.js';

export class RutinaEjercicioDto {
  @IsInt({ message: 'El ejercicioId debe ser un número entero' })
  @IsPositive({ message: 'El ejercicioId debe ser un número positivo' })
  ejercicioId: number;

  @IsInt({ message: 'Las series deben ser un número entero' })
  @IsPositive({ message: 'Las series deben ser un número positivo' })
  @Max(20, { message: 'Las series no pueden ser más de $constraint1' })
  series: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @Max(600, { message: 'La cantidad no puede ser más de $constraint1' })
  cantidad: number;

  @IsIn(['repeticiones', 'segundos'], {
    message: 'La unidad debe ser "repeticiones" o "segundos"',
  })
  unidad: UnidadEjercicio;
}

export class CreateRutinaDto {
  @IsInt({ message: 'El usuarioId debe ser un número entero' })
  @IsPositive({ message: 'El usuarioId debe ser un número positivo' })
  usuarioId: number;

  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(80, { message: 'El nombre no puede superar los $constraint1 caracteres' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(300, { message: 'La descripción no puede superar los $constraint1 caracteres' })
  descripcion?: string;

  @IsArray({ message: 'Los ejercicios deben ser una lista' })
  @ArrayMinSize(1, { message: 'La rutina debe tener al menos un ejercicio' })
  @ValidateNested({ each: true })
  @Type(() => RutinaEjercicioDto)
  ejercicios: RutinaEjercicioDto[];
}