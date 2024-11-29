export interface Event {
  id?: number;
  titre: string;
  description: string;
  date: string;
  heure: string;
  lieu: string;
}

export interface EventFilters {
  searchQuery: string;
  sortBy: 'date' | 'titre' | 'lieu';
  sortOrder: 'asc' | 'desc';
}