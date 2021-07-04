import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import utils from "./plugins/utils"

createApp(App)
    .use(store)
    .use(router)
    .use(utils)
    .mount('#app')
