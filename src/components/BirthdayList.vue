<template>
  <div class="q-pa-md">
    <q-list bordered separator class="rounded-borders">
      <template v-for="(monthBirthdays, month) in groupedBirthdays" :key="month">
        <q-separator v-if="monthBirthdays.length > 0" />
        <q-item-label v-if="monthBirthdays.length > 0" header class="text-primary">
          {{ getMonthName(parseInt(month)) }}
        </q-item-label>

        <q-item
          v-for="birthday in monthBirthdays"
          :key="birthday.idanni"
          clickable
          v-ripple
          @click="openEditDialog(birthday)"
        >
          <q-item-section>
            <q-item-label>{{ birthday.nom }}</q-item-label>
            <q-item-label caption>
              {{ birthday.jour }} {{ getMonthName(birthday.mois) }} {{ birthday.annee }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              :color="birthday.publie === 'publie' ? 'positive' : 'grey'"
              :icon="birthday.publie === 'publie' ? 'visibility' : 'visibility_off'"
              flat
              round
              dense
              @click.stop="toggleStatus(birthday)"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-list>

    <q-dialog v-model="editDialog">
      <BirthdayForm
        :birthday="selectedBirthday"
        @saved="closeEditDialog"
      />
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBirthdayStore } from '../stores/birthdayStore';
import type { Birthday } from '../types/birthday';
import BirthdayForm from './BirthdayForm.vue';

const store = useBirthdayStore();
const editDialog = ref(false);
const selectedBirthday = ref<Birthday | null>(null);

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

const getMonthName = (month: number): string => {
  return monthOptions.find(m => m.value === month)?.label || '';
};

const groupedBirthdays = computed(() => {
  const grouped: { [key: string]: Birthday[] } = {};
  for (let i = 1; i <= 12; i++) {
    grouped[i] = [];
  }
  
  store.filteredBirthdays.forEach(birthday => {
    grouped[birthday.mois].push(birthday);
  });
  
  return grouped;
});

const openEditDialog = (birthday: Birthday) => {
  selectedBirthday.value = birthday;
  editDialog.value = true;
};

const closeEditDialog = () => {
  editDialog.value = false;
  selectedBirthday.value = null;
};

const toggleStatus = (birthday: Birthday) => {
  if (birthday.idanni) {
    store.togglePublicationStatus(birthday.idanni);
  }
};
</script>

<style scoped>
.q-item {
  transition: background-color 0.3s;
}

.q-item:hover {
  background-color: var(--q-primary-fade);
}

@media (max-width: 599px) {
  .q-item {
    padding: 8px;
  }
  
  .q-item-label {
    font-size: 0.9rem;
  }
  
  .q-item-label.caption {
    font-size: 0.75rem;
  }
}
</style>