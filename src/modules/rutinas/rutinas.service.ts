import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRutinaDto, RutinaEjercicioDto } from './dto/create-rutina.dto.js';
import { UpdateRutinaDto } from './dto/update-rutina.dto.js';

const incluirEjercicios = {
  ejercicios: {
    include: { ejercicio: true },
    orderBy: { orden: 'asc' },
  },
} as const;

function conOrden(ejercicios: RutinaEjercicioDto[]) {
  return ejercicios.map((ejercicio, indice) => ({ ...ejercicio, orden: indice + 1 }));
}

@Injectable()
export class RutinasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createRutinaDto: CreateRutinaDto) {
    const { ejercicios, ...rutina } = createRutinaDto;
    return this.prisma.rutina.create({
      data: { ...rutina, ejercicios: { create: conOrden(ejercicios) } },
      include: incluirEjercicios,
    });
  }

  findAll() {
    return this.prisma.rutina.findMany({
      include: incluirEjercicios,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const rutina = await this.prisma.rutina.findUnique({
      where: { id },
      include: incluirEjercicios,
    });
    if (!rutina) throw new NotFoundException(`No existe la rutina con id ${id}`);
    return rutina;
  }

  update(id: number, updateRutinaDto: UpdateRutinaDto) {
    const { ejercicios, ...rutina } = updateRutinaDto;
    return this.prisma.rutina.update({
      where: { id },
      data: {
        ...rutina,
        ...(ejercicios && { ejercicios: { deleteMany: {}, create: conOrden(ejercicios) } }),
      },
      include: incluirEjercicios,
    });
  }

  remove(id: number) {
    return this.prisma.rutina.delete({ where: { id } });
  }
}