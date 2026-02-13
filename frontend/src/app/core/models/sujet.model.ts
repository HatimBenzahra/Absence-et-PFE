export interface Sujet {
  id: number;
  titre: string;
  description: string;
  motsCles: string;
  statut: StatutSujet;
  enseignantNom: string;
  dateCreation: Date;
}

export enum StatutSujet {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDE = 'VALIDE',
  REFUSE = 'REFUSE',
  AFFECTE = 'AFFECTE'
}

export interface SujetCreate {
  titre: string;
  description: string;
  motsCles: string;
  entreprisePartenaire?: string;
}
