// import { createRouter, createWebHistory } from 'vue-router'    // hash mode
import { createRouter, createWebHashHistory } from 'vue-router';   // history mode
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
    component: () => import('../views/Minesweeper.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),  // hash mode
  // history: createWebHistory(process.env.BASE_URL),   // history mode
  routes
})

export default router
