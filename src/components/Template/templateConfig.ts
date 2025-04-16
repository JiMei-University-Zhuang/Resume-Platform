const modules = import.meta.glob('./*.vue')

export const templateConfig = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const name = path.replace('./', '').replace('.vue', '').toLowerCase() // 确保模板名称小写
    return [name, module]
  })
)

export const templateList = [
  { id: 1, name: '模板1' },
  { id: 2, name: '模板2' },
  { id: 3, name: '模板3' },
  { id: 4, name: '模板4' },
  { id: 5, name: '模板5' },
  { id: 6, name: '模板6' },
  { id: 7, name: '模板7' },
  { id: 8, name: '模板8' },
  { id: 9, name: '模板9' },
  { id: 10, name: '模板10' },
  { id: 11, name: '现代蓝色模板' },
  { id: 12, name: '简约黑白模板' },
  { id: 13, name: '清新卡片模板' },
  { id: 14, name: '专业技术模板' }
]
