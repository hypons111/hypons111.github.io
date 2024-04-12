import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFlag, faQuestion, faExplosion } from '@fortawesome/free-solid-svg-icons'

library.add(faFlag, faQuestion, faExplosion);

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon); // 全局註冊 Font Awesome
app.use(store).use(router).mount('#app')
