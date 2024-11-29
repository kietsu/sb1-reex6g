import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Dark, Notify } from 'quasar'
import router from './router'

// Import Quasar css
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import 'quasar/dist/quasar.css'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Dark,
    Notify
  },
  config: {
    dark: Dark.isActive,
    notify: {
      position: 'top-right',
      timeout: 2500,
      textColor: 'white'
    }
  }
})

app.mount('#app')