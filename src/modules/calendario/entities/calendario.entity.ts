export class Calendario {
  id: number;
  usuarioId: number;
  rutinaId: number;
  // Fecha en formato AAAA-MM-DD; cada usuario puede tener una sola rutina por día.
  fecha: string;
  completado: boolean;
}