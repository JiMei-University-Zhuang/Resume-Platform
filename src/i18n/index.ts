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
    console.log('内置语言包版本：', { en: '内置英文', 'zh-cn': '内置中文' })

    // 获取应用的基础路径
    const baseUrl = import.meta.env.BASE_URL || './'
    console.log('应用基础路径：', baseUrl)

    // 确保基础路径以 / 结尾
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'

    // 定义可能的路径，按优先级排序
    const possiblePaths = [
      './locales/', // 首选相对于 index.html 的路径
      `${normalizedBaseUrl}locales/`, // 从基础路径开始
      '/locales/', // 从根目录开始
      '../locales/', // 上一级目录
      './dist/locales/', // 可能的备用路径
      // 更多可能的路径
      `${window.location.origin}${normalizedBaseUrl}locales/`,
      `${window.location.origin}/locales/`,
      `${window.location.pathname.split('/').slice(0, -1).join('/')}/locales/`
    ]

    // 记录当前位置，帮助调试
    console.log('当前页面URL:', window.location.href)
    console.log('当前路径名:', window.location.pathname)
    console.log('当前Origin:', window.location.origin)
    console.log('尝试的路径:', possiblePaths)

    try {
      // 首先尝试检测各个路径是否存在
      const checkPaths = async () => {
        console.log('开始检查各个路径是否可访问...')
        for (const basePath of possiblePaths) {
          try {
            const headResp = await fetch(`${basePath}zh-cn.json`, { method: 'HEAD' })
            if (headResp.ok) {
              console.log(`✅ 路径可访问: ${basePath}`)
              window.successPath = basePath
              return true
            }
          } catch (e) {
            console.log(`❌ 路径不可访问: ${basePath}`)
          }
        }
        return false
      }

      await checkPaths()
    } catch (e) {
      console.warn('路径检查过程出错:', e)
    }

    // 尝试从不同路径加载中文语言包
    let zhLoaded = false
    for (const basePath of possiblePaths) {
      if (zhLoaded) break

      try {
        console.log(`尝试从 ${basePath}zh-cn.json 加载中文语言包...`)
        const resp = await fetch(`${basePath}zh-cn.json`)
        console.log(`从 ${basePath}zh-cn.json 加载结果:`, resp.status)

        if (resp.ok) {
          const data = await resp.json()
          console.log('获取到的中文语言包数据:', data)
          messages['zh-cn'] = data
          console.log('✅ 成功从静态文件加载中文语言包:', basePath)
          zhLoaded = true
          // 成功加载后记录路径，供英文语言包使用
          window.successPath = basePath
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

    // 如果中文包已成功加载，优先使用相同路径
    const enPaths = window.successPath ? [window.successPath, ...possiblePaths] : possiblePaths

    for (const basePath of enPaths) {
      if (enLoaded) break

      try {
        console.log(`尝试从 ${basePath}en.json 加载英文语言包...`)
        const resp = await fetch(`${basePath}en.json`)
        console.log(`从 ${basePath}en.json 加载结果:`, resp.status)

        if (resp.ok) {
          const data = await resp.json()
          console.log('获取到的英文语言包数据:', data)
          messages['en'] = data
          console.log('✅ 成功从静态文件加载英文语言包:', basePath)
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

    // 如果都无法加载，尝试直接使用内置语言包
    if (!zhLoaded && !enLoaded) {
      console.warn('🔴 无法从任何路径加载语言文件，将使用内置语言包')
      // 记录语言包内容，帮助调试
      console.log('内置中文语言包样例:', Object.keys(zhCN).slice(0, 5))
      console.log('内置英文语言包样例:', Object.keys(enUS).slice(0, 5))
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

// 声明全局变量
declare global {
  interface Window {
    successPath?: string
  }
}

// 使用动态加载语言文件（可能来自静态目录）
loadLocaleMessages().then(messages => {
  // 替换语言包
  Object.keys(messages).forEach(locale => {
    i18n.global.setLocaleMessage(locale, messages[locale])
  })
  console.log('🌐 语言配置初始化完成')
})

export default i18n
