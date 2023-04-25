import { createRouter, createWebHistory } from 'vue-router'
import AuthenticationView from '../views/AuthenticationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {
        name: 'home',
      }
    },
    {
      path: '/index',
      name: 'home',
      component: AuthenticationView
    },
    {
      path: '/:pathMatch(.*)*', // redirects all other routes to home
      redirect: {
        name: 'home',
      }
    },
  ]
})

export default router
