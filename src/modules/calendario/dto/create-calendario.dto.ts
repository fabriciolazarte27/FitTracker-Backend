import { IsBoolean, IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreateCalendarioDto {
  @IsInt({ message: 'El usuarioId debe ser un número entero' })
  @IsPositive({ message: 'El usuarioId debe ser un número positivo' })
  usuarioId: number;

  @IsInt({ message: 'El rutinaId debe ser un número entero' })
  @IsPositive({ message: 'El rutinaId debe ser un número positivo' })
  rutinaId: number;

  @IsDateString({ strict: true }, { message: 'La fecha debe tener el formato AAAA-MM-DD' })
  fecha: string;

  @IsOptional()
  @IsBoolean({ message: 'El campo completado debe ser true o false' })
  completado?: boolean;
}