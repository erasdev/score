import { createRouter, createWebHistory } from 'vue-router'
import Index from '../components/Index.vue'


const routes = [
  { path: '/', name: 'Index', component: Index },
  // other routes...
]

export default createRouter({
  history: createWebHistory(),
  routes,
})