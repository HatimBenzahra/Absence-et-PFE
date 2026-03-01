export interface Affectation {
  id: number;
  etudiantNom: string;
  sujetTitre: string;
  encadrantNom: string;
  statut: StatutAffectation;
  dateAffectation: string;
}

export enum StatutAffectation {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ABANDONNE = 'ABANDONNE'
}
