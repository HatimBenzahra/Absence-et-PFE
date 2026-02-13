export interface Presence {
  id: number;
  seanceId: number;
  etudiantId: number;
  statut: StatutPresence;
  datePointage?: Date;
}

export enum StatutPresence {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  RETARD = 'RETARD',
  EXCUSE = 'EXCUSE'
}

export interface PointageRequest {
  qrToken: string;
  latitude?: number;
  longitude?: number;
}
