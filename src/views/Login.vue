<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const credentials = ref({
  usernameEmail: '',
  password: '',
  remember: true
});

const loading = ref(false);

const handleLogin = async () => {
  if (!credentials.value.usernameEmail || !credentials.value.password) {
    $q.notify({
      color: 'negative',
      message: 'Veuillez remplir tous les champs',
      icon: 'warning'
    });
    return;
  }

  loading.value = true;
  try {
    await authStore.login(credentials.value);
    $q.notify({
      color: 'positive',
      message: 'Connexion réussie',
      icon: 'check'
    });
    router.push('/');
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Erreur de connexion',
      icon: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-center">
    <q-card class="login-card">
      <q-card-section class="text-center">
        <div class="text-h5 q-mb-md">Connexion</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleLogin">
          <q-input
            v-model="credentials.usernameEmail"
            label="Nom d'utilisateur"
            outlined
            :disable="loading"
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>

          <q-input
            v-model="credentials.password"
            label="Mot de passe"
            type="password"
            outlined
            :disable="loading"
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
          </q-input>

          <q-checkbox
            v-model="credentials.remember"
            label="Se souvenir de moi"
            :disable="loading"
            class="q-mb-md"
          />

          <div class="full-width q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="Se connecter"
              class="full-width"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}
</style>