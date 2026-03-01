export interface Soutenance {
  id: number;
  affectationId: number;
  etudiantNom: string;
  sujetTitre: string;
  dateSoutenance: string; // ISO datetime string
  lieu?: string;
  jury?: string;
  observations?: string;
}

export interface SoutenanceCreate {
  affectationId: number;
  dateSoutenance: string;
  lieu?: string;
  jury?: string;
}
