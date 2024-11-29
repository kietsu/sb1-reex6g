<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import type { Event } from '../types/event'

const props = defineProps<{
  event: Event
}>()

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <q-card class="event-card q-mb-md">
    <q-card-section>
      <div class="text-h6">{{ event.titre }}</div>
      <div class="text-subtitle2">
        <q-icon name="event" /> {{ event.date }} à {{ event.heure }}
      </div>
      <div class="text-subtitle2">
        <q-icon name="place" /> {{ event.lieu }}
      </div>
    </q-card-section>

    <q-card-section>
      <p class="text-body2">{{ event.description }}</p>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        color="primary"
        :to="`/event/${event.id}`"
        label="Détails"
      />
      <q-btn
        v-if="isAuthenticated"
        flat
        color="secondary"
        :to="`/event/edit/${event.id}`"
        label="Modifier"
      />
    </q-card-actions>
  </q-card>
</template>

<style scoped>
.event-card {
  transition: transform 0.2s;
}

.event-card:hover {
  transform: translateY(-2px);
}
</style>