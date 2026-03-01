export interface Candidature {
  id: number;
  sujetId: number;
  sujetTitre: string;
  rangPreference: number;
  statut: StatutCandidature;
  dateCandidature: string;
}

export enum StatutCandidature {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE'
}

export interface CandidatureCreate {
  sujetId: number;
  rangPreference: number;
  motivation?: string;
}
