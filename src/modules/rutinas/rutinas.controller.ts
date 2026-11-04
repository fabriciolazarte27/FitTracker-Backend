import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RutinasService } from './rutinas.service.js';
import { CreateRutinaDto } from './dto/create-rutina.dto.js';
import { UpdateRutinaDto } from './dto/update-rutina.dto.js';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  @Post()
  create(@Body() createRutinaDto: CreateRutinaDto) {
    return this.rutinasService.create(createRutinaDto);
  }

  @Get()
  findAll() {
    return this.rutinasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutinasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRutinaDto: UpdateRutinaDto) {
    return this.rutinasService.update(+id, updateRutinaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutinasService.remove(+id);
  }
}
