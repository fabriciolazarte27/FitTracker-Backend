import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { JwtPayload } from './jwt-auth.guard.js';

const sinPassword = { passwordHash: true } as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...datos } = registerDto;
    const usuario = await this.prisma.usuario.create({
      data: { ...datos, passwordHash: await bcrypt.hash(password, 10) },
      omit: sinPassword,
    });
    return this.crearSesion(usuario);
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: loginDto.email } });
    if (!usuario || !(await bcrypt.compare(loginDto.password, usuario.passwordHash))) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }
    const { passwordHash: _, ...datos } = usuario;
    return this.crearSesion(datos);
  }

  async perfil(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id }, omit: sinPassword });
    if (!usuario) throw new UnauthorizedException('El usuario de la sesión ya no existe');
    return usuario;
  }

  private async crearSesion(usuario: { id: number; email: string }) {
    const payload: JwtPayload = { sub: usuario.id, email: usuario.email };
    return { accessToken: await this.jwtService.signAsync(payload), usuario };
  }
}