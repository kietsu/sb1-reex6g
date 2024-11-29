<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h4">Anniversaires</div>
      <q-btn
        color="primary"
        icon="add"
        label="Nouvel anniversaire"
        @click="showNewBirthdayDialog = true"
      />
    </div>

    <BirthdayFilters class="q-mb-md" />
    <BirthdayList />

    <q-dialog v-model="showNewBirthdayDialog">
      <BirthdayForm @saved="showNewBirthdayDialog = false" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BirthdayFilters from '../components/BirthdayFilters.vue';
import BirthdayList from '../components/BirthdayList.vue';
import BirthdayForm from '../components/BirthdayForm.vue';

const showNewBirthdayDialog = ref(false);
</script>

<style scoped>
@media (max-width: 599px) {
  .text-h4 {
    font-size: 1.5rem;
  }
  
  :deep(.q-btn) {
    padding: 4px 8px;
  }
}
</style>