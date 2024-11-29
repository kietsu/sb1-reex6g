<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '../stores/eventStore'
import { useAuthStore } from '../stores/authStore'
import { useQuasar } from 'quasar'
import type { Event } from '../types/event'

const route = useRoute()
const router = useRouter()
const store = useEventStore()
const authStore = useAuthStore()
const $q = useQuasar()

const event = ref<Event | null>(null)
const loading = ref(true)
const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(async () => {
  const id = route.params.id
  if (id && typeof id === 'string') {
    try {
      event.value = await store.getEvent(parseInt(id))
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Erreur lors du chargement de l\'événement',
        icon: 'error'
      })
      router.push('/')
    } finally {
      loading.value = false
    }
  }
})

const confirmDelete = () => {
  $q.dialog({
    title: 'Confirmer la suppression',
    message: 'Êtes-vous sûr de vouloir supprimer cet événement ?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    if (event.value?.id) {
      try {
        await store.deleteEvent(event.value.id)
        $q.notify({
          color: 'positive',
          message: 'Événement supprimé avec succès',
          icon: 'check'
        })
        router.push('/')
      } catch (error) {
        $q.notify({
          color: 'negative',
          message: 'Erreur lors de la suppression',
          icon: 'error'
        })
      }
    }
  })
}
</script>

<template>
  <q-page padding>
    <q-card v-if="event" class="q-pa-md">
      <q-card-section>
        <div class="text-h4">{{ event.titre }}</div>
        <div class="text-subtitle1 q-mt-md">
          <q-icon name="event" /> {{ event.date }} à {{ event.heure }}
        </div>
        <div class="text-subtitle1">
          <q-icon name="place" /> {{ event.lieu }}
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-body1">{{ event.description }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          icon="arrow_back"
          label="Retour"
          to="/"
        />
        <template v-if="isAuthenticated">
          <q-btn
            flat
            color="secondary"
            icon="edit"
            :to="`/event/edit/${event.id}`"
            label="Modifier"
          />
          <q-btn
            flat
            color="negative"
            icon="delete"
            label="Supprimer"
            @click="confirmDelete"
          />
        </template>
      </q-card-actions>
    </q-card>

    <div v-else-if="loading" class="text-center q-pa-md">
      <q-spinner
        color="primary"
        size="3em"
      />
      <div class="text-subtitle1 q-mt-md">
        Chargement de l'événement...
      </div>
    </div>
  </q-page>
</template>