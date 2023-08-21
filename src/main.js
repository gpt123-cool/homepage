import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import 'highlight.js/styles/monokai.css'
// import './style.css'

import App from './App.vue'
import { routes } from './routes.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App).use(router).mount('#app')
