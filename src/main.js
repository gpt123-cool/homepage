import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import 'highlight.js/styles/monokai.css'

import i18n from './i18n'
import App from './App.vue'
import { routes } from './routes.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

createApp(App).use(i18n).use(router).mount('#app')
