import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import MainLayout from '../layouts/MainLayout.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'event/:id',
          name: 'event-detail',
          component: () => import('../views/EventDetail.vue')
        },
        {
          path: 'event/new',
          name: 'event-new',
          component: () => import('../views/EventForm.vue')
        },
        {
          path: 'event/edit/:id',
          name: 'event-edit',
          component: () => import('../views/EventForm.vue')
        },
        {
          path: 'birthdays',
          name: 'birthdays',
          component: () => import('../views/Birthdays.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Allow access to login page even when authenticated
  if (to.path === '/login') {
    next()
    return
  }

  // For edit/new/delete operations, require authentication
  const requiresAuth = to.path.includes('/edit') || 
                      to.path.includes('/new') ||
                      (to.name === 'event-detail' && from.path.includes('/edit'))

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router