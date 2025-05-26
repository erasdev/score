import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { applyTheme } from './utils/applyTheme'

const pinia = createPinia()

const app = createApp(App)
app.use(router)
app.use(pinia)

// Apply theme before mounting
applyTheme().then(() => {
  app.mount('#app')
})
