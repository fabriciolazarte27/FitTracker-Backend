import { RutinaEjercicio } from './rutina-ejercicio.entity.js';

export class Rutina {
  id: number;
  // null en las plantillas de ejemplo, que no pertenecen a ningún usuario.
  usuarioId: number | null;
  nombre: string;
  descripcion: string | null;
  creadoEn: Date;
  ejercicios?: RutinaEjercicio[];
}