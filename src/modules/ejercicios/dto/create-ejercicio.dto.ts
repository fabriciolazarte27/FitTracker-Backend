export class CreateEjercicioDto {
  slug: string;
  nombre: string;
  grupoMuscularId: number;
  equipo: string;
  descripcion?: string;
  imagen?: string;
}