<template>
  <q-page padding>
    <div class="text-h4 q-mb-md">Événements</div>
    <EventFilters />
    
    <div v-if="loading" class="row justify-center q-my-md">
      <q-spinner color="primary" size="40px" />
    </div>
    
    <div v-else class="weeks-container">
      <EventWeekView
        v-for="weekStart in weeks"
        :key="weekStart.toISOString()"
        :events="store.filteredEvents"
        :week-start="weekStart"
      />
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn
        fab
        icon="add"
        color="primary"
        to="/event/new"
      />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useEventStore } from '../stores/eventStore';
import EventWeekView from '../components/EventWeekView.vue';
import EventFilters from '../components/EventFilters.vue';
import { useQuasar } from 'quasar';

const store = useEventStore();
const $q = useQuasar();
const loading = ref(true);

// Calculate start of current week
const getCurrentWeekStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - date.getDay()); // Sunday = 0
  return date;
};

// Calculate end of next week
const getNextWeekEnd = () => {
  const date = getCurrentWeekStart();
  date.setDate(date.getDate() + 14); // Two weeks from start
  date.setHours(23, 59, 59, 999);
  return date;
};

// Generate array of week start dates
const weeks = computed(() => {
  const weekStarts = [];
  const currentWeekStart = getCurrentWeekStart();
  
  // Current week and next week
  weekStarts.push(currentWeekStart);
  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  weekStarts.push(nextWeekStart);
  
  return weekStarts;
});

onMounted(async () => {
  try {
    const startDate = getCurrentWeekStart();
    const endDate = getNextWeekEnd();
    await store.fetchEvents(startDate, endDate, 50);
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Erreur lors du chargement des événements',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.weeks-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>