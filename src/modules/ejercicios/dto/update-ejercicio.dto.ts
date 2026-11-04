import { PartialType } from '@nestjs/mapped-types';
import { CreateEjercicioDto } from './create-ejercicio.dto.js';

export class UpdateEjercicioDto extends PartialType(CreateEjercicioDto) {}
