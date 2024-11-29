import type { Event } from '../types/event'

export const mockEvents: Event[] = [
  {
    id: 1,
    titre: "Concert de Jazz",
    description: "Une soirée exceptionnelle avec les meilleurs artistes de jazz de la région",
    date: "15.03.2024",
    heure: "20:00",
    lieu: "Salle de concert Le Méridien"
  },
  {
    id: 2,
    titre: "Exposition d'Art Moderne",
    description: "Découvrez les œuvres contemporaines d'artistes locaux et internationaux",
    date: "20.03.2024",
    heure: "14:00",
    lieu: "Galerie des Arts"
  },
  {
    id: 3,
    titre: "Conférence Tech",
    description: "Les dernières innovations en intelligence artificielle et développement web",
    date: "25.03.2024",
    heure: "09:30",
    lieu: "Centre de Conférences"
  },
  {
    id: 4,
    titre: "Festival Gastronomique",
    description: "Un voyage culinaire avec les meilleurs chefs de la région",
    date: "01.04.2024",
    heure: "11:00",
    lieu: "Place du Marché"
  },
  {
    id: 5,
    titre: "Théâtre - Le Misanthrope",
    description: "Une nouvelle mise en scène moderne du classique de Molière",
    date: "10.04.2024",
    heure: "19:30",
    lieu: "Théâtre Municipal"
  }
]