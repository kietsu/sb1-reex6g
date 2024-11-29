export interface Birthday {
  idanni?: number;
  nom: string;
  jour: number;
  mois: number;
  annee: number;
  publie: 'publie' | 'prop';
  cspy?: string;
  pspy?: string;
}

export interface BirthdayFilters {
  searchQuery: string;
  selectedMonth: number | null;
}