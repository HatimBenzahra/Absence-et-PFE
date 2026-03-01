export interface Presence {
  id: number;
  etudiantNom: string;
  etudiantNumero: string;
  statut: StatutPresence;
  modeSaisie: ModeSaisie;
  horodatage: string;
  aJustificatif: boolean;
}

export enum StatutPresence {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  RETARD = 'RETARD',
  EXCUSE = 'EXCUSE'
}

export enum ModeSaisie {
  QR = 'QR',
  MANUEL = 'MANUEL'
}

export interface PointageQRRequest {
  tokenQR: string;
}

export interface PointageManuelRequest {
  etudiantId: number;
  statut: StatutPresence;
}
