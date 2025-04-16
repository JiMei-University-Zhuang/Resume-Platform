import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

export function useLanguage() {
  const { locale } = useI18n({ useScope: 'global' })
  const locales = [
    {
      name: '简体中文',
      value: 'zh-cn'
    },
    {
      name: 'English',
      value: 'en'
    }
  ]

  // 使用响应式变量跟踪当前语言
  const currentLanguage = ref(localStorage.getItem('language') || locale.value)

  // 判断当前是否为英文
  const isEnglish = computed(() => currentLanguage.value === 'en')

  // 切换语言的方法
  const toggleLanguage = () => {
    const newLang = isEnglish.value ? 'zh-cn' : 'en'

    // 设置 i18n 的 locale
    locale.value = newLang

    // 保存到 localStorage 中
    localStorage.setItem('language', newLang)

    // 更新当前语言
    currentLanguage.value = newLang

    // 可选：通过发布事件通知其他组件语言已改变
    window.dispatchEvent(new Event('language-changed'))

    message.success(newLang === 'en' ? 'Switched to English' : '已切换为中文')
  }

  return {
    currentLanguage,
    isEnglish,
    toggleLanguage,
    locales
  }
}
