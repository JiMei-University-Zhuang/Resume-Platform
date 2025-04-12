import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ElConfigProvider } from 'element-plus'
import './style.css'
import '../public/css/template-enhancements.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('ElConfigProvider', ElConfigProvider)

app.provide('LOCALE', 'zh-cn')

app.use(router)
app.use(createPinia())
app.mount('#app')
