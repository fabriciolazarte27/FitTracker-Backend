import { PartialType } from '@nestjs/mapped-types';
import { CreateCalendarioDto } from './create-calendario.dto.js';

export class UpdateCalendarioDto extends PartialType(CreateCalendarioDto) {}
