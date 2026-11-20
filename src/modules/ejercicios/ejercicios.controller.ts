import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EjerciciosService } from './ejercicios.service.js';
import { CreateEjercicioDto } from './dto/create-ejercicio.dto.js';
import { UpdateEjercicioDto } from './dto/update-ejercicio.dto.js';

@Controller('ejercicios')
export class EjerciciosController {
  constructor(private readonly ejerciciosService: EjerciciosService) {}

  @Post()
  create(@Body() createEjercicioDto: CreateEjercicioDto) {
    return this.ejerciciosService.create(createEjercicioDto);
  }

  @Get()
  findAll() {
    return this.ejerciciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ejerciciosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEjercicioDto: UpdateEjercicioDto) {
    return this.ejerciciosService.update(id, updateEjercicioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ejerciciosService.remove(id);
  }
}