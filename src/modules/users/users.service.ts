import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const sinPassword = { passwordHash: true } as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.usuario.findMany({ omit: sinPassword, orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id }, omit: sinPassword });
    if (!usuario) throw new NotFoundException(`No existe el usuario con id ${id}`);
    return usuario;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...datos } = updateUserDto;
    return this.prisma.usuario.update({
      where: { id },
      data: { ...datos, ...(password && { passwordHash: await bcrypt.hash(password, 10) }) },
      omit: sinPassword,
    });
  }

  remove(id: number) {
    return this.prisma.usuario.delete({ where: { id }, omit: sinPassword });
  }
}