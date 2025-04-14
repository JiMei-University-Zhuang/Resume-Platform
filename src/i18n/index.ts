import { createI18n } from 'vue-i18n'
import enUS from '../locales/en'
import zhCN from '../locales/zh-cn'

const messages = {
  en: enUS,
  'zh-cn': zhCN
}

const getBrowserLanguage = () => {
  const storedLanguage = localStorage.getItem('language')
  if (storedLanguage) {
    return storedLanguage
  }

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('zh') ? 'zh-cn' : 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLanguage(),
  fallbackLocale: 'zh-cn',
  messages
})

export default i18n
