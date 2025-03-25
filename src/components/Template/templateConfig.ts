const modules = import.meta.glob('./*.vue')

export const templateConfig = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const name = path.replace('./', '').replace('.vue', '').toLowerCase() // 确保模板名称小写
    return [name, module]
  })
)