import { UnidadEjercicio } from '../entities/rutina-ejercicio.entity.js';

export class CreateRutinaDto {
  usuarioId: number;
  nombre: string;
  descripcion?: string;
  ejercicios: {
    ejercicioId: number;
    series: number;
    cantidad: number;
    unidad: UnidadEjercicio;
  }[];
}