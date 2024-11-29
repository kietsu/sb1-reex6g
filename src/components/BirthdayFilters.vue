<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-input
          v-model="searchQuery"
          label="Rechercher par nom"
          outlined
          dense
          clearable
        >
          <template #append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          v-model="selectedMonth"
          :options="monthOptions"
          label="Filtrer par mois"
          outlined
          dense
          clearable
          emit-value
          map-options
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBirthdayStore } from '../stores/birthdayStore';

const store = useBirthdayStore();
const searchQuery = ref('');
const selectedMonth = ref<number | null>(null);

const monthOptions = [
  { label: 'Janvier', value: 1 },
  { label: 'Février', value: 2 },
  { label: 'Mars', value: 3 },
  { label: 'Avril', value: 4 },
  { label: 'Mai', value: 5 },
  { label: 'Juin', value: 6 },
  { label: 'Juillet', value: 7 },
  { label: 'Août', value: 8 },
  { label: 'Septembre', value: 9 },
  { label: 'Octobre', value: 10 },
  { label: 'Novembre', value: 11 },
  { label: 'Décembre', value: 12 }
];

watch([searchQuery, selectedMonth], () => {
  store.updateFilters({
    searchQuery: searchQuery.value,
    selectedMonth: selectedMonth.value
  });
});
</script>