<template>
  <q-card style="min-width: 300px; max-width: 500px; width: 100%">
    <q-card-section>
      <div class="text-h6">{{ isEdit ? 'Modifier' : 'Nouvel' }} anniversaire</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-form @submit="handleSubmit" class="q-gutter-md">
        <q-input
          v-model="form.nom"
          label="Nom *"
          :rules="[val => !!val || 'Le nom est requis']"
          outlined
          dense
        />
        
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-4">
            <q-input
              v-model.number="form.jour"
              type="number"
              label="Jour *"
              outlined
              dense
              :rules="[
                val => val > 0 && val <= 31 || 'Jour invalide',
                val => Number.isInteger(val) || 'Doit être un nombre entier'
              ]"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="form.mois"
              :options="monthOptions"
              label="Mois *"
              outlined
              dense
              emit-value
              map-options
              :rules="[val => !!val || 'Le mois est requis']"
            />
          </div>
          <div class="col-12 col-sm-4">
            <q-input
              v-model.number="form.annee"
              type="number"
              label="Année *"
              outlined
              dense
              :rules="[
                val => val > 1900 && val <= new Date().getFullYear() || 'Année invalide',
                val => Number.isInteger(val) || 'Doit être un nombre entier'
              ]"
            />
          </div>
        </div>

        <div class="row items-center q-gutter-sm">
          <q-toggle
            v-model="isPublic"
            label="Publié"
          />
        </div>

        <template v-if="birthday">
          <div class="text-caption text-grey q-mt-sm">
            Créé le: {{ birthday.cspy }}<br>
            Dernière modification: {{ birthday.pspy !== '0000-00-00 00:00:00' ? birthday.pspy : 'Jamais' }}
          </div>
        </template>

        <div class="row justify-end q-gutter-sm">
          <q-btn
            label="Annuler"
            color="grey"
            flat
            v-close-popup
          />
          <q-btn
            :label="isEdit ? 'Mettre à jour' : 'Créer'"
            type="submit"
            color="primary"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useBirthdayStore } from '../stores/birthdayStore';
import type { Birthday } from '../types/birthday';

const props = defineProps<{
  birthday?: Birthday;
}>();

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

const store = useBirthdayStore();
const isEdit = computed(() => !!props.birthday);
const isPublic = ref(false);

const form = ref({
  nom: '',
  jour: 1,
  mois: 1,
  annee: new Date().getFullYear(),
});

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

onMounted(() => {
  if (props.birthday) {
    form.value = {
      nom: props.birthday.nom,
      jour: props.birthday.jour,
      mois: props.birthday.mois,
      annee: props.birthday.annee,
    };
    isPublic.value = props.birthday.publie === 'publie';
  }
});

const handleSubmit = () => {
  const birthdayData = {
    ...form.value,
    publie: isPublic.value ? 'publie' : 'prop'
  };

  if (props.birthday) {
    store.updateBirthday({
      ...props.birthday,
      ...birthdayData
    });
  } else {
    store.createBirthday(birthdayData);
  }

  emit('saved');
};
</script>