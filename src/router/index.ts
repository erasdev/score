import { createRouter, createWebHistory } from 'vue-router'
import Index from '../components/Index.vue'
import Pdf from '../components/Pdf.vue'

const routes = [
  { path: '/', name: 'Index', component: Index },
  { path: '/pdfs/:slug', name: 'Pdf', component: Pdf },
  // other routes...
]

export default createRouter({
  history: createWebHistory(),
  routes,
})