<script setup lang="ts">
import { useQuasar } from 'quasar'
import { onMounted } from 'vue'

const $q = useQuasar()

onMounted(() => {
  const darkMode = localStorage.getItem('darkMode') === 'true'
  $q.dark.set(darkMode)
})
</script>

<template>
  <router-view />
</template>

<style>
:root {
  --q-primary: #4CAF50;
  --q-secondary: #2E7D32;
  --q-accent: #BA68C8;
}

body {
  color: #2C3E50;
}

body.body--dark {
  color: #FFFFFF;
  background: #121212;
}

.q-card {
  transition: all 0.3s ease;
}

.body--light .q-card {
  background: #FFFFFF;
}

.body--dark .q-card {
  background: #1E1E1E;
}
</style>