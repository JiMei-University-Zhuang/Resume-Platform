/**
 * 该脚本用于手动复制语言文件到 dist 目录
 * 可以在构建后单独运行，或者添加到 npm 脚本中
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

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
        
        // 提取导出对象的内容（简单处理）
        const match = content.match(/export\s+default\s+({[\s\S]*?});?\s*$/)
        if (match && match[1]) {
          let jsonContent = match[1]
            // 移除注释
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // 处理键名，确保使用双引号
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
            // 将单引号替换为双引号
            .replace(/'/g, '"')
            // 处理 es6 模板字符串，转换为普通字符串
            .replace(/`([^`]*)`/g, '"$1"')
          
          try {
            // 尝试解析为 JSON 对象
            const jsonObj = Function(`return ${jsonContent}`)()
            // 将对象转换为 JSON 字符串
            const jsonString = JSON.stringify(jsonObj, null, 2)
            
            // 验证生成的 JSON 字符串
            if (isValidJson(jsonString)) {
              // 写入 JSON 文件
              fs.writeFileSync(distJsonFile, jsonString, 'utf-8')
              console.log(`✅ 已生成语言文件: ${jsonFileName}`)
            } else {
              throw new Error('生成的 JSON 字符串无效')
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
                    profile: 'Profile'
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
                    profile: '个人信息'
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
          console.error(`❌ 在文件 ${file} 中未找到导出对象`)
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