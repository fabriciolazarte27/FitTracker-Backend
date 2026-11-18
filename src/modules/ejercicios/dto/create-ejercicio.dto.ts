import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateEjercicioDto {
  @IsString({ message: 'El slug debe ser un texto' })
  @MaxLength(60, { message: 'El slug no puede superar los $constraint1 caracteres' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'El slug solo puede tener minúsculas, números y guiones',
  })
  slug: string;

  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MaxLength(80, { message: 'El nombre no puede superar los $constraint1 caracteres' })
  nombre: string;

  @IsInt({ message: 'El grupoMuscularId debe ser un número entero' })
  @IsPositive({ message: 'El grupoMuscularId debe ser un número positivo' })
  grupoMuscularId: number;

  @IsString({ message: 'El equipo debe ser un texto' })
  @IsNotEmpty({ message: 'El equipo no puede estar vacío' })
  @MaxLength(40, { message: 'El equipo no puede superar los $constraint1 caracteres' })
  equipo: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(300, { message: 'La descripción no puede superar los $constraint1 caracteres' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'La imagen debe ser un texto' })
  @MaxLength(200, { message: 'La imagen no puede superar los $constraint1 caracteres' })
  imagen?: string;
}