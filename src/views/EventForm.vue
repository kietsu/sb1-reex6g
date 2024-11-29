<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventStore } from '../stores/eventStore'
import { useQuasar } from 'quasar'
import { isValidDate, isValidTime } from '../utils/dateValidation'
import type { Event } from '../types/event'

const route = useRoute()
const router = useRouter()
const store = useEventStore()
const $q = useQuasar()

const event = ref<Event>({
  titre: '',
  description: '',
  date: '',
  heure: '',
  lieu: ''
})

const loading = ref(false)

onMounted(async () => {
  const id = route.params.id
  if (id && typeof id === 'string') {
    loading.value = true
    try {
      const fetchedEvent = await store.getEvent(parseInt(id))
      event.value = fetchedEvent
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Erreur lors du chargement de l\'événement',
        icon: 'error'
      })
    } finally {
      loading.value = false
    }
  }
})

const validateForm = (): boolean => {
  if (!event.value.titre.trim()) {
    $q.notify({ color: 'negative', message: 'Le titre est requis', icon: 'error' })
    return false
  }
  if (!event.value.date.trim() || !isValidDate(event.value.date)) {
    $q.notify({ color: 'negative', message: 'Date invalide (format: JJ.MM.AAAA)', icon: 'error' })
    return false
  }
  if (!event.value.heure.trim() || !isValidTime(event.value.heure)) {
    $q.notify({ color: 'negative', message: 'Heure invalide (format: HH:MM)', icon: 'error' })
    return false
  }
  if (!event.value.lieu.trim()) {
    $q.notify({ color: 'negative', message: 'Le lieu est requis', icon: 'error' })
    return false
  }
  return true
}

const saveEvent = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    if (event.value.id) {
      await store.updateEvent(event.value)
      $q.notify({ color: 'positive', message: 'Événement mis à jour avec succès', icon: 'check' })
    } else {
      await store.createEvent(event.value)
      $q.notify({ color: 'positive', message: 'Événement créé avec succès', icon: 'check' })
    }
    router.push('/')
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Erreur lors de l\'enregistrement',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">{{ event.id ? 'Modifier' : 'Créer' }} un événement</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="saveEvent">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="event.titre"
                label="Titre *"
                outlined
                :disable="loading"
              />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="event.date"
                label="Date *"
                outlined
                mask="##.##.####"
                :rules="[
                  val => !!val || 'La date est requise',
                  val => isValidDate(val) || 'Format invalide (JJ.MM.AAAA)'
                ]"
                :disable="loading"
              >
                <template #append>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="event.heure"
                label="Heure *"
                outlined
                mask="##:##"
                :rules="[
                  val => !!val || 'L\'heure est requise',
                  val => isValidTime(val) || 'Format invalide (HH:MM)'
                ]"
                :disable="loading"
              >
                <template #append>
                  <q-icon name="schedule" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="event.lieu"
                label="Lieu *"
                outlined
                :disable="loading"
              >
                <template #append>
                  <q-icon name="place" />
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input
                v-model="event.description"
                label="Description"
                type="textarea"
                outlined
                :disable="loading"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-md">
            <div class="col">
              <q-btn
                label="Annuler"
                color="grey"
                to="/"
                flat
                :disable="loading"
              />
              <q-btn
                type="submit"
                :label="event.id ? 'Mettre à jour' : 'Créer'"
                color="primary"
                class="q-ml-sm"
                :loading="loading"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>