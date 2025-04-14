import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

export function useLanguage() {
  const { locale } = useI18n()

  const availableLocales = [
    { code: 'zh-cn', name: '中文' },
    { code: 'en', name: 'English' }
  ]

  const currentLocale = computed(() => {
    return locale.value
  })

  const isEnglish = computed(() => {
    return locale.value === 'en'
  })

  const toggleLanguage = () => {
    const newLocale = isEnglish.value ? 'zh-cn' : 'en'

    locale.value = newLocale
    localStorage.setItem('language', newLocale)

    message.success(newLocale === 'en' ? 'Switched to English' : '已切换为中文')
  }

  return {
    currentLocale,
    isEnglish,
    toggleLanguage,
    availableLocales
  }
}
