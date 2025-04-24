/**
 * 该脚本用于手动复制语言文件到 dist 目录
 * 可以在构建后单独运行，或者添加到 npm 脚本中
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

// 创建require函数
const require = createRequire(import.meta.url)

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 源文件目录
const srcLocalesDir = path.resolve(__dirname, 'src/locales')
// 目标目录
const distLocalesDir = path.resolve(__dirname, 'dist/locales')
// 备份目录 - 用于临时存储公共目录中可能存在的语言文件
const publicLocalesDir = path.resolve(__dirname, 'public/locales')

// 确保目标目录存在
if (!fs.existsSync(distLocalesDir)) {
  fs.mkdirSync(distLocalesDir, { recursive: true })
  console.log(`创建目录: ${distLocalesDir}`)
}

// 简单验证 JSON 文件是否有效
function isValidJson(jsonContent) {
  try {
    JSON.parse(jsonContent)
    return true
  } catch (e) {
    return false
  }
}

try {
  // 读取源目录下的所有文件
  const files = fs.readdirSync(srcLocalesDir)

  // 遍历文件并复制
  files.forEach(file => {
    const srcFile = path.join(srcLocalesDir, file)
    const distFile = path.join(distLocalesDir, file)

    // 检查是否是文件
    if (fs.statSync(srcFile).isFile()) {
      // 读取文件内容
      const content = fs.readFileSync(srcFile, 'utf-8')

      // 将 TypeScript 文件转换为 JSON
      if (file.endsWith('.ts')) {
        const jsonFileName = file.replace('.ts', '.json')
        const distJsonFile = path.join(distLocalesDir, jsonFileName)

        try {
          // 使用更安全的方法：创建临时转换文件（使用.cjs扩展名以支持CommonJS模块）
          const tempJsFile = path.join(__dirname, `_temp_${file.replace('.ts', '.cjs')}`)

          // 简化的转换：只替换 export default
          let jsContent = content
            .replace(/export\s+default\s+/, 'module.exports = ')
            // 移除不必要的注释
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')

          // 写入临时 JS 文件
          fs.writeFileSync(tempJsFile, jsContent, 'utf-8')

          // 尝试导入这个 JS 模块
          try {
            // 使用原生的 require 加载模块（现在使用.cjs文件，可以在ESM环境中被require）
            const localePath = `./_temp_${file.replace('.ts', '.cjs')}`
            // 清除缓存，以防重复运行
            delete require.cache[require.resolve(localePath)]
            const localeModule = require(localePath)

            // 转换为 JSON
            const jsonString = JSON.stringify(localeModule, null, 2)

            // 写入 JSON 文件
            fs.writeFileSync(distJsonFile, jsonString, 'utf-8')
            console.log(`✅ 已生成语言文件: ${jsonFileName}`)

            // 删除临时文件
            fs.unlinkSync(tempJsFile)
          } catch (importError) {
            console.error(`❌ 导入模块失败: ${file}`, importError)
            throw importError
          }
        } catch (error) {
          console.error(`❌ 处理语言文件失败: ${file}`, error)

          // 尝试使用备用方案：复制 public/locales 中的文件
          const publicJsonFile = path.join(publicLocalesDir, jsonFileName)
          if (fs.existsSync(publicJsonFile)) {
            fs.copyFileSync(publicJsonFile, distJsonFile)
            console.log(`⚠️ 已从 public/locales 复制替代文件: ${jsonFileName}`)
          } else {
            // 如果没有备用文件，尝试硬编码基本语言对象
            if (file === 'en.ts') {
              const basicEn = {
                header: {
                  language: 'Switch to Chinese',
                  logout: 'Logout',
                  profile: 'Profile',
                  notifications: 'Notifications',
                  documentation: 'Documentation',
                  unread: '{count} unread messages'
                },
                sider: {
                  dashboard: 'Dashboard'
                }
              }
              fs.writeFileSync(distJsonFile, JSON.stringify(basicEn, null, 2), 'utf-8')
              console.log(`⚠️ 已创建基本英文语言文件: ${jsonFileName}`)
            } else if (file === 'zh-cn.ts') {
              const basicZh = {
                header: {
                  language: '切换为英文',
                  logout: '退出登录',
                  profile: '个人信息',
                  notifications: '消息通知',
                  documentation: '帮助文档',
                  unread: '{count}条未读消息'
                },
                sider: {
                  dashboard: '首页'
                }
              }
              fs.writeFileSync(distJsonFile, JSON.stringify(basicZh, null, 2), 'utf-8')
              console.log(`⚠️ 已创建基本中文语言文件: ${jsonFileName}`)
            }
          }
        }
      } else {
        // 直接复制非 TypeScript 文件
        fs.copyFileSync(srcFile, distFile)
        console.log(`📄 已复制文件: ${file}`)
      }
    }
  })

  // 最后步骤：执行验证
  console.log('🔍 验证生成的语言文件...')
  const jsonFiles = fs.readdirSync(distLocalesDir).filter(file => file.endsWith('.json'))

  let allValid = true
  jsonFiles.forEach(file => {
    const filePath = path.join(distLocalesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    if (isValidJson(content)) {
      console.log(`✅ 文件有效: ${file}`)
    } else {
      console.error(`❌ 文件无效: ${file}`)
      allValid = false
    }
  })

  if (allValid) {
    console.log('🎉 所有国际化资源处理完成且有效！')
  } else {
    console.error('⚠️ 部分语言文件无效，请检查输出目录')
  }
} catch (error) {
  console.error('❌ 处理国际化资源时出错:', error)
} 