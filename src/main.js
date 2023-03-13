import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'highlight.js/styles/monokai.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faGear, faUser } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faGear, faUser)

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
