// Erstellen der Vue-Anwendung über das div-Element in index.html. Eigentliches App.vue als Hauptkomponente

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Start der Vue-Anwendung mit App und Router-Navigation
createApp(App).use(router).mount('#app')
