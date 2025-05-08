import { createRouter, createWebHistory } from 'vue-router'
import Upload from '../components/Upload.vue'


const routes = [
  { path: '/upload', name: 'Upload', component: Upload },
  // other routes...
]

export default createRouter({
  history: createWebHistory(),
  routes,
})