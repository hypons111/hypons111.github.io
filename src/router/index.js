import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/clock',
    name: 'clock',
    component: () => import('../views/Clock.vue')
  },
  {
    path: '/minesweeper',
    name: 'minesweeper',
    component: () => import('../views/MineSweeper.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),  // hash mode
  // history: createWebHistory(process.env.BASE_URL),      // history mode
  routes
})

export default router
