export interface Seance {
  id: number;
  matiere: string;
  type: TypeSeance;
  dateDebut: Date;
  dateFin: Date;
  salle: string;
  enseignantNom: string;
  qrCodeToken?: string;
}

export enum TypeSeance {
  COURS = 'COURS',
  TD = 'TD',
  TP = 'TP',
  EXAMEN = 'EXAMEN'
}

export interface SeanceCreate {
  matiere: string;
  type: TypeSeance;
  dateDebut: string; // ISO string
  dateFin: string; // ISO string
  salle: string;
  groupeId?: number;
}
