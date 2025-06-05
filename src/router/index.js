import { createRouter, createWebHistory } from 'vue-router'
import Polynomdivision from '../components/polynomdivision.vue'
import Funktionswertberechnung from '../components/funktionswertberechnung.vue'
import Home from '../components/home.vue'

const routes = [
    {path: '/', component: Home },
  { path: '/polynomdivision', component: Polynomdivision },
  { path: '/funktionswertberechnung', component: Funktionswertberechnung }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router