export interface Justificatif {
  id: number;
  motif: string;
  urlFichier: string;
  statut: StatutJustificatif;
  dateDepot: string;
  presenceId: number;
  commentaireValidation?: string;
}

export interface JustificatifCreate {
  presenceId: number;
  motif: string;
  urlFichier?: string;
}

export enum StatutJustificatif {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE'
}
