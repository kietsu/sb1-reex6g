<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEventStore } from '../stores/eventStore'

const store = useEventStore()
const searchQuery = ref('')
const sortBy = ref('date')
const sortOrder = ref('asc')

watch([searchQuery, sortBy, sortOrder], () => {
  store.updateFilters({
    searchQuery: searchQuery.value,
    sortBy: sortBy.value as 'date' | 'titre' | 'lieu',
    sortOrder: sortOrder.value as 'asc' | 'desc'
  })
})
</script>

<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-input
          v-model="searchQuery"
          label="Rechercher"
          outlined
          dense
          clearable
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-3">
        <q-select
          v-model="sortBy"
          :options="[
            { label: 'Date', value: 'date' },
            { label: 'Titre', value: 'titre' },
            { label: 'Lieu', value: 'lieu' }
          ]"
          label="Trier par"
          outlined
          dense
        />
      </div>
      <div class="col-12 col-sm-3">
        <q-btn-toggle
          v-model="sortOrder"
          flat
          stretch
          toggle-color="primary"
          :options="[
            { label: 'Ascendant', value: 'asc' },
            { label: 'Descendant', value: 'desc' }
          ]"
        />
      </div>
    </div>
  </div>
</template>