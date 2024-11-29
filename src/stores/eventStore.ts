import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { eventApi, type ApiEvent } from '../services/api';
import type { Event, EventFilters } from '../types/event';

function apiEventToEvent(apiEvent: ApiEvent): Event {
  const dateTime = new Date(apiEvent.date_heure);
  return {
    id: apiEvent.id,
    titre: apiEvent.titre,
    description: apiEvent.description || '',
    date: dateTime.toLocaleDateString('fr-CH'),
    heure: dateTime.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }),
    lieu: apiEvent.lieu || ''
  };
}

function eventToApiEvent(event: Event): Partial<ApiEvent> {
  const [day, month, year] = event.date.split('.');
  const [hours, minutes] = event.heure.split(':');
  const dateTime = new Date(
    parseInt(year),
    parseInt(month) - 1,
    parseInt(day),
    parseInt(hours),
    parseInt(minutes)
  );

  return {
    titre: event.titre,
    description: event.description || null,
    lieu: event.lieu || null,
    date_heure: dateTime.toISOString().slice(0, 19).replace('T', ' ')
  };
}

export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([]);
  const filters = ref<EventFilters>({
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  const filteredEvents = computed(() => {
    return events.value
      .filter(event => {
        const searchLower = filters.value.searchQuery.toLowerCase();
        return (
          event.titre.toLowerCase().includes(searchLower) ||
          event.lieu.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const order = filters.value.sortOrder === 'asc' ? 1 : -1;
        if (filters.value.sortBy === 'date') {
          const [aDay, aMonth, aYear] = a.date.split('.');
          const [bDay, bMonth, bYear] = b.date.split('.');
          const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay));
          const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay));
          return aDate > bDate ? order : -order;
        }
        const aValue = a[filters.value.sortBy];
        const bValue = b[filters.value.sortBy];
        return aValue > bValue ? order : -order;
      });
  });

  async function fetchEvents(startDate: Date, endDate?: Date, limit?: number) {
    try {
      const apiEvents = await eventApi.getEventsBetweenDates(startDate, endDate, limit);
      const newEvents = apiEvents.map(apiEventToEvent);
      
      // Merge new events with existing ones, avoiding duplicates
      const existingIds = new Set(events.value.map(e => e.id));
      const uniqueNewEvents = newEvents.filter(e => e.id && !existingIds.has(e.id));
      
      events.value = [...events.value, ...uniqueNewEvents].sort((a, b) => {
        const [aDay, aMonth, aYear] = a.date.split('.');
        const [bDay, bMonth, bYear] = b.date.split('.');
        const aDate = new Date(parseInt(aYear), parseInt(aMonth) - 1, parseInt(aDay));
        const bDate = new Date(parseInt(bYear), parseInt(bMonth) - 1, parseInt(bDay));
        return aDate.getTime() - bDate.getTime();
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  }

  async function getEvent(id: number) {
    try {
      const apiEvent = await eventApi.getEvent(id);
      return apiEventToEvent(apiEvent);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'événement:', error);
      throw error;
    }
  }

  async function createEvent(event: Event) {
    try {
      const apiEvent = await eventApi.createEvent(eventToApiEvent(event));
      const newEvent = apiEventToEvent(apiEvent);
      events.value.push(newEvent);
      return newEvent;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  }

  async function updateEvent(event: Event) {
    if (!event.id) return;
    try {
      const apiEvent = await eventApi.updateEvent(event.id, eventToApiEvent(event));
      const updatedEvent = apiEventToEvent(apiEvent);
      const index = events.value.findIndex(e => e.id === event.id);
      if (index !== -1) {
        events.value[index] = updatedEvent;
      }
      return updatedEvent;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      throw error;
    }
  }

  async function deleteEvent(id: number) {
    try {
      await eventApi.deleteEvent(id);
      events.value = events.value.filter(event => event.id !== id);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'événement:', error);
      throw error;
    }
  }

  function updateFilters(newFilters: Partial<EventFilters>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  return {
    events,
    filters,
    filteredEvents,
    fetchEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    updateFilters
  };
});