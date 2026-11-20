import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCalendarioDto } from './dto/create-calendario.dto.js';
import { UpdateCalendarioDto } from './dto/update-calendario.dto.js';

@Injectable()
export class CalendarioService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCalendarioDto: CreateCalendarioDto) {
    return this.prisma.calendario.create({
      data: { ...createCalendarioDto, fecha: new Date(createCalendarioDto.fecha) },
      include: { rutina: true },
    });
  }

  findAll() {
    return this.prisma.calendario.findMany({
      include: { rutina: true },
      orderBy: { fecha: 'asc' },
    });
  }

  async findOne(id: number) {
    const entrenamiento = await this.prisma.calendario.findUnique({
      where: { id },
      include: { rutina: true },
    });
    if (!entrenamiento) throw new NotFoundException(`No existe el entrenamiento agendado con id ${id}`);
    return entrenamiento;
  }

  update(id: number, updateCalendarioDto: UpdateCalendarioDto) {
    const { fecha, ...datos } = updateCalendarioDto;
    return this.prisma.calendario.update({
      where: { id },
      data: { ...datos, ...(fecha && { fecha: new Date(fecha) }) },
      include: { rutina: true },
    });
  }

  remove(id: number) {
    return this.prisma.calendario.delete({ where: { id } });
  }
}