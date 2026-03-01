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
  CM = 'CM',
  TD = 'TD',
  TP = 'TP',
  EXAMEN = 'EXAMEN',
  SOUTENANCE = 'SOUTENANCE'
}

export interface SeanceCreate {
  matiere: string;
  typeSeance: TypeSeance;
  dateHeureDebut: string;
  dateHeureFin: string;
  groupe?: string;
  salle?: string;
}

export interface EnseignantOption {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}
