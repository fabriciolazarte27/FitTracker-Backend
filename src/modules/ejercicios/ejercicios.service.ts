import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto.js';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto.js';

@Injectable()
export class EjerciciosService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEjercicioDto: CreateEjercicioDto) {
    return this.prisma.ejercicio.create({
      data: createEjercicioDto,
      include: { grupoMuscular: true },
    });
  }

  findAll() {
    return this.prisma.ejercicio.findMany({
      include: { grupoMuscular: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const ejercicio = await this.prisma.ejercicio.findUnique({
      where: { id },
      include: { grupoMuscular: true },
    });
    if (!ejercicio) throw new NotFoundException(`No existe el ejercicio con id ${id}`);
    return ejercicio;
  }

  update(id: number, updateEjercicioDto: UpdateEjercicioDto) {
    return this.prisma.ejercicio.update({
      where: { id },
      data: updateEjercicioDto,
      include: { grupoMuscular: true },
    });
  }

  remove(id: number) {
    return this.prisma.ejercicio.delete({ where: { id } });
  }
}