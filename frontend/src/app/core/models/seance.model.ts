export interface Seance {
  id: number;
  matiere: string;
  typeSeance: TypeSeance;
  dateHeureDebut: string;
  dateHeureFin: string;
  groupe: string;
  salle: string;
  enseignantNom: string;
}

export enum TypeSeance {
  COURS = 'COURS',
  TD = 'TD',
  TP = 'TP',
  EXAMEN = 'EXAMEN'
}

export interface SeanceCreate {
  matiere: string;
  typeSeance: TypeSeance;
  dateHeureDebut: string;
  dateHeureFin: string;
  groupe?: string;
  salle?: string;
}
