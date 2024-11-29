<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('darkMode', $q.dark.isActive.toString())
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  $q.notify({
    color: 'info',
    message: 'Déconnexion réussie',
    icon: 'logout'
  })
}
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Gestion d'Événements
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
          aria-label="Mode sombre"
        />

        <template v-if="isAuthenticated">
          <q-btn
            flat
            dense
            round
            icon="logout"
            @click="handleLogout"
            aria-label="Déconnexion"
          />
        </template>
        <template v-else>
          <q-btn
            flat
            dense
            to="/login"
            icon="login"
            aria-label="Connexion"
          />
        </template>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item
          clickable
          to="/"
          exact
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            Accueil
          </q-item-section>
        </q-item>

        <q-item
          v-if="isAuthenticated"
          clickable
          to="/event/new"
        >
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
          <q-item-section>
            Nouvel Événement
          </q-item-section>
        </q-item>

        <q-item
          clickable
          to="/birthdays"
        >
          <q-item-section avatar>
            <q-icon name="cake" />
          </q-item-section>
          <q-item-section>
            Anniversaires
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>