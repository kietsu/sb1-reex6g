<script setup lang="ts">
import { computed } from 'vue';
import type { Event } from '../types/event';
import EventCard from './EventCard.vue';

const props = defineProps<{
  events: Event[];
  weekStart: Date;
}>();

const weekDays = computed(() => {
  const days = [];
  const currentDate = new Date(props.weekStart);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    const eventsForDay = getEventsForDay(date);
    
    if (eventsForDay.length > 0) {
      days.push({ date, events: eventsForDay });
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
});

const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const getEventsForDay = (date: Date) => {
  return props.events.filter(event => {
    const [day, month, year] = event.date.split('.');
    const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return eventDate.getDate() === date.getDate() &&
           eventDate.getMonth() === date.getMonth() &&
           eventDate.getFullYear() === date.getFullYear();
  });
};
</script>

<template>
  <div v-if="weekDays.length > 0" class="week-view q-mb-lg">
    <div class="text-subtitle1 q-mb-sm">
      Semaine du {{ weekStart.toLocaleDateString('fr-CH', { day: 'numeric', month: 'long' }) }}
    </div>
    
    <div v-for="{ date, events } in weekDays" 
         :key="date.toISOString()" 
         class="day-section q-mb-md">
      <div :class="['day-header q-mb-sm', { 'today': isToday(date) }]">
        {{ date.toLocaleDateString('fr-CH', { weekday: 'long', day: 'numeric', month: 'long' }) }}
      </div>
      
      <div class="row q-col-gutter-md">
        <div v-for="event in events"
             :key="event.id"
             class="col-12 col-md-6 col-lg-4">
          <EventCard :event="event" :is-today="isToday(date)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-view {
  border-radius: 8px;
  padding: 16px;
}

.day-header {
  font-weight: 500;
  padding: 8px;
  border-radius: 4px;
  background: var(--q-primary);
  color: white;
}

.day-header.today {
  background: var(--q-accent);
  font-weight: 700;
}
</style>