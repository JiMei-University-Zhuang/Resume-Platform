/**
 * 用于处理国际化资源的 Vite 插件
 * 该插件确保在生产构建时，语言文件被正确处理并复制到 dist 目录
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * i18n 资源处理插件
 * 将语言文件从 src/locales 复制到 dist/locales
 */
export default function i18nResourcesPlugin() {
  return {
    name: 'vite-plugin-i18n-resources',
    
    // 在构建完成后执行
    closeBundle() {
      console.log('🔄 开始处理国际化资源...')
      
      // 源文件目录
      const srcLocalesDir = path.resolve(__dirname, 'src/locales')
      // 目标目录
      const distLocalesDir = path.resolve(__dirname, 'dist/locales')
      
      // 检查源目录是否存在
      if (!fs.existsSync(srcLocalesDir)) {
        console.error(`❌ 源目录不存在: ${srcLocalesDir}`)
        return
      }
      
      // 确保目标目录存在
      if (!fs.existsSync(distLocalesDir)) {
        fs.mkdirSync(distLocalesDir, { recursive: true })
        console.log(`📁 创建目标目录: ${distLocalesDir}`)
      }
      
      try {
        // 读取源目录下的所有文件
        const files = fs.readdirSync(srcLocalesDir)
        
        if (files.length === 0) {
          console.warn(`⚠️ 源目录为空: ${srcLocalesDir}`)
          return
        }
        
        console.log(`📋 找到 ${files.length} 个语言文件，开始处理...`)
        
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
                  // 尝试使用 Function 构造器解析 JSON
                  // 这比 JSON.parse 更灵活，可以处理不严格的 JSON 格式
                  const jsonObj = Function(`return ${jsonContent}`)()
                  
                  // 写入 JSON 文件
                  fs.writeFileSync(distJsonFile, JSON.stringify(jsonObj, null, 2), 'utf-8')
                  console.log(`✅ 已生成语言文件: ${jsonFileName}`)
                } catch (evalError) {
                  console.error(`❌ 处理语言文件失败: ${file}`, evalError)
                  
                  // 备选方案：直接复制 TS 文件
                  fs.copyFileSync(srcFile, distFile)
                  console.log(`⚠️ 已复制原始语言文件: ${file}`)
                }
              } else {
                console.error(`❌ 在文件 ${file} 中未找到导出对象`)
                
                // 直接复制原文件
                fs.copyFileSync(srcFile, distFile)
                console.log(`⚠️ 已复制原始语言文件: ${file}`)
              }
            } else {
              // 直接复制非 TypeScript 文件
              fs.copyFileSync(srcFile, distFile)
              console.log(`📄 已复制文件: ${file}`)
            }
          }
        })
        
        console.log('🎉 国际化资源处理完成！')
      } catch (error) {
        console.error('❌ 处理国际化资源时出错:', error)
      }
    }
  }
} 