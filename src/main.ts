import { createApp } from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElConfigProvider } from 'element-plus'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
// Import custom Ant Design Vue CSS fixes
import '../public/css/antd-fixes.css'

import './style.css'
import '../public/css/template-enhancements.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(ElementPlus)
app.component('ElConfigProvider', ElConfigProvider)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(Antd)

app.provide('LOCALE', 'zh-cn')
app.use(router)
app.use(createPinia())

app.mount('#app')
