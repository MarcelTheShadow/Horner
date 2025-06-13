import { createRouter, createWebHistory } from 'vue-router'
import Polynomdivision from '../components/polynomdivision.vue'
import Funktionswertberechnung from '../components/funktionswertberechnung.vue'
import Home from '../components/home.vue'

// Definition der Routen für die Anwendung, Start bei '/' mit Home-Komponente
const routes = [
    {path: '/', component: Home },
  { path: '/polynomdivision', component: Polynomdivision },
  { path: '/funktionswertberechnung', component: Funktionswertberechnung }
]

// Iniitialisierung des Routers
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Export des Routers für die Verwendung in der Vue-Anwendung
export default router