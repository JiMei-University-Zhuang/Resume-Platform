import { createI18n } from 'vue-i18n'
import enUS from '@/locales/en'
import zhCN from '@/locales/zh-cn'

// 定义带有索引签名的消息类型
type MessageSchema = typeof enUS
interface Messages {
  [key: string]: MessageSchema
}

/**
 * 线上环境的语言包可能是从静态目录加载的
 * 这个函数用于在生产环境中动态加载语言文件
 */
const loadLocaleMessages = async (): Promise<Messages> => {
  const messages: Messages = {
    en: enUS,
    'zh-cn': zhCN
  }

  // 仅在生产环境中尝试从静态目录加载语言文件
  if (import.meta.env.PROD) {
    console.log('🔍 生产环境：尝试从静态目录加载语言文件...')

    // 定义可能的路径，按优先级排序
    const possiblePaths = [
      './locales/', // 相对于 index.html 的路径
      './dist/locales/', // 可能的备用路径
      '../locales/', // 上一级目录
      '/locales/' // 从根目录开始
    ]

    // 尝试从不同路径加载中文语言包
    let zhLoaded = false
    for (const basePath of possiblePaths) {
      if (zhLoaded) break

      try {
        console.log(`尝试从 ${basePath}zh-cn.json 加载中文语言包...`)
        const resp = await fetch(`${basePath}zh-cn.json`)
        if (resp.ok) {
          const data = await resp.json()
          messages['zh-cn'] = data
          console.log('✅ 成功从静态文件加载中文语言包')
          zhLoaded = true
          break
        }
      } catch (error) {
        console.warn(`无法从 ${basePath} 加载中文语言包:`, error)
      }
    }

    if (!zhLoaded) {
      console.warn('⚠️ 所有路径均无法加载中文语言包，将使用内置语言包')
    }

    // 尝试从不同路径加载英文语言包
    let enLoaded = false
    for (const basePath of possiblePaths) {
      if (enLoaded) break

      try {
        console.log(`尝试从 ${basePath}en.json 加载英文语言包...`)
        const resp = await fetch(`${basePath}en.json`)
        if (resp.ok) {
          const data = await resp.json()
          messages['en'] = data
          console.log('✅ 成功从静态文件加载英文语言包')
          enLoaded = true
          break
        }
      } catch (error) {
        console.warn(`无法从 ${basePath} 加载英文语言包:`, error)
      }
    }

    if (!enLoaded) {
      console.warn('⚠️ 所有路径均无法加载英文语言包，将使用内置语言包')
    }
  }

  return messages
}

const getBrowserLanguage = () => {
  const storedLanguage = localStorage.getItem('language')
  if (storedLanguage) {
    return storedLanguage
  }

  const browserLang = navigator.language.toLowerCase()
  return browserLang.startsWith('zh') ? 'zh-cn' : 'en'
}

// 先创建 i18n 实例，后续再加载完整的语言包
const i18n = createI18n({
  legacy: false,
  locale: getBrowserLanguage(),
  fallbackLocale: 'zh-cn',
  messages: {
    en: enUS,
    'zh-cn': zhCN
  },
  // 全局配置
  globalInjection: true,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false
})

// 使用动态加载语言文件（可能来自静态目录）
loadLocaleMessages().then(messages => {
  // 替换语言包
  Object.keys(messages).forEach(locale => {
    i18n.global.setLocaleMessage(locale, messages[locale])
  })
  console.log('🌐 语言配置初始化完成')
})

export default i18n
