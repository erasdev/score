import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Pdf from '../components/Pdf.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/pdfs/:slug', name: 'Pdf', component: Pdf },
  // other routes...
]

export default createRouter({
  history: createWebHistory(),
  routes,
})