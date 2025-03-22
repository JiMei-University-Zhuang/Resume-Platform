import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'element-plus/theme-chalk/dark/css-vars.css'
<<<<<<< Updated upstream
=======
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
>>>>>>> Stashed changes

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

<<<<<<< Updated upstream
app.use(ElementPlus)
=======
app.use(ElementPlus, {
  locale: zhCn,
})
>>>>>>> Stashed changes
app.use(router)
app.use(createPinia())
app.mount('#app')
