export type UnidadEjercicio = 'repeticiones' | 'segundos';

export class RutinaEjercicio {
  rutinaId: number;
  ejercicioId: number;
  series: number;
  cantidad: number;
  unidad: UnidadEjercicio;
  orden: number;
}