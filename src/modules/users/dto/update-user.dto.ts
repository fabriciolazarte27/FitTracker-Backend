import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos $constraint1 caracteres' })
  @MaxLength(60, { message: 'El nombre no puede superar los $constraint1 caracteres' })
  nombre?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @MaxLength(120, { message: 'El email no puede superar los $constraint1 caracteres' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos $constraint1 caracteres' })
  @MaxLength(72, { message: 'La contraseña no puede superar los $constraint1 caracteres' })
  password?: string;
}