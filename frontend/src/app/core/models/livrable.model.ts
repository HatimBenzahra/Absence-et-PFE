export interface Livrable {
  id: number;
  type: TypeLivrable;
  titre: string;
  urlFichier: string;
  dateDepot: string;
}

export interface LivrableCreate {
  type: TypeLivrable;
  titre?: string;
  urlFichier: string;
  commentaire?: string;
}

export enum TypeLivrable {
  RAPPORT_INTERMEDIAIRE = 'RAPPORT_INTERMEDIAIRE',
  RAPPORT_FINAL = 'RAPPORT_FINAL',
  CODE_SOURCE = 'CODE_SOURCE',
  PRESENTATION = 'PRESENTATION',
  AUTRE = 'AUTRE'
}
