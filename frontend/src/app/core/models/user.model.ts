export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

export enum Role {
  ETUDIANT = 'ETUDIANT',
  ENSEIGNANT = 'ENSEIGNANT',
  RESPONSABLE_PFE = 'RESPONSABLE_PFE',
  SECRETARIAT = 'SECRETARIAT',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: Role;
  numEtudiant?: string;
  groupe?: string;
  filiere?: string;
  departement?: string;
  grade?: string;
  fonction?: string;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}
