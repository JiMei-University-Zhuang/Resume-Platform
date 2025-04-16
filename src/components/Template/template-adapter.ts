/**
 * 简历模板适配器
 * 用于增强模板样式和功能，确保所有模板都能正确显示、支持打印和PDF导出
 */

import { nextTick } from 'vue'

interface TemplateClass {
  [key: string]: string
}

// 模板样式映射
const templateClasses: TemplateClass = {
  muban1: '',
  muban2: 'section[data-section="personal"]',
  muban3: 'business-style',
  muban4: 'creative-header',
  muban5: 'academic-resume',
  muban6: 'marketing-style',
  muban7: 'medical-style',
  muban8: 'education-style',
  muban9: 'engineering-style',
  muban10: 'finance-style',
  muban11: 'modern-blue-resume',
  muban12: 'minimal-bw-resume',
  muban13: 'fresh-card-resume',
  muban14: 'tech-professional-resume'
}

/**
 * 增强简历模板展示效果
 * @param templateKey 模板键名
 * @param element 模板DOM元素
 */
export const enhanceTemplate = async (templateKey: string, element: HTMLElement): Promise<void> => {
  if (!element) return

  const templateName = templateKey.toLowerCase()

  // 添加通用类
  element.classList.add('resume-enhanced')

  // 等待DOM渲染完成
  await nextTick()

  // 针对特定模板进行样式适配
  switch (templateName) {
    case 'muban1':
      enhanceMuban1(element)
      break
    case 'muban2':
      enhanceMuban2(element)
      break
    case 'muban3':
      enhanceMuban3(element)
      break
    case 'muban4':
      enhanceMuban4(element)
      break
    case 'muban11':
      enhanceMuban11(element)
      break
    case 'muban12':
      enhanceMuban12(element)
      break
    case 'muban13':
      enhanceMuban13(element)
      break
    case 'muban14':
      enhanceMuban14(element)
      break
    default:
      // 通用增强
      enhanceCommon(element, templateName)
  }

  // 确保联系信息在一行显示
  ensureContactInfoInline(element)
}

/**
 * 增强Muban1模板
 */
const enhanceMuban1 = (element: HTMLElement): void => {
  // 找到个人信息部分
  const personalSection = element.querySelector('.personal-info')
  if (personalSection) {
    // 确保所有个人信息项目在一行显示
    const infoItems = personalSection.querySelectorAll('.info-column p')
    infoItems.forEach(item => {
      item.classList.add('info-item')
    })
  }
}

/**
 * 增强Muban2模板
 */
const enhanceMuban2 = (element: HTMLElement): void => {
  // 找到联系信息部分
  const contactItems = element.querySelectorAll('.contact-info div')
  contactItems.forEach(item => {
    item.classList.add('contact-item')
  })
}

/**
 * 增强Muban3模板 - 商务风格
 */
const enhanceMuban3 = (element: HTMLElement): void => {
  // 为头部添加商务风格类
  const header = element.querySelector('.resume-header')
  if (header) {
    header.classList.add('business-style')
  }

  // 将联系信息转换为一行显示
  const contactInfo = element.querySelector('.contact-info')
  if (contactInfo) {
    contactInfo.classList.add('contact-row')
    const contactItems = contactInfo.querySelectorAll('p')
    contactItems.forEach(item => {
      item.classList.add('contact-item')
    })
  }
}

/**
 * 增强Muban4模板 - 创意风格
 */
const enhanceMuban4 = (element: HTMLElement): void => {
  // 为头部添加创意风格类
  const header = element.querySelector('.resume-header')
  if (header) {
    header.classList.add('creative-header')
  }

  // 为所有区块添加创意风格类
  const sections = element.querySelectorAll('.section')
  sections.forEach(section => {
    section.classList.add('creative-section')
  })
}

/**
 * 通用模板增强
 */
const enhanceCommon = (element: HTMLElement, templateName: string): void => {
  // 为模板添加对应的标识类
  if (templateClasses[templateName]) {
    const className = templateClasses[templateName]
    const targetElement = element.querySelector(className) || element
    targetElement.classList.add(templateName)
  }

  // 美化所有区块标题
  const sectionTitles = element.querySelectorAll('.section-title, h2')
  sectionTitles.forEach(title => {
    title.classList.add('enhanced-section-title')
  })
}

/**
 * 确保联系信息在一行显示
 */
const ensureContactInfoInline = (element: HTMLElement): void => {
  // 查找可能包含联系信息的容器
  const containers = [
    '.contact-info',
    '.personal-info',
    '.info-row',
    '.resume-header div',
    '.personal-section div'
  ]

  containers.forEach(selector => {
    const container = element.querySelector(selector)
    if (!container) return

    // 查找可能的联系信息项
    const infoItems = container.querySelectorAll('p, div:not(.row):not(.col)')
    if (infoItems.length >= 2) {
      container.classList.add('info-row')
      infoItems.forEach(item => {
        if (
          item.textContent?.includes('：') ||
          item.textContent?.includes(':') ||
          item.textContent?.includes('邮箱') ||
          item.textContent?.includes('电话') ||
          item.textContent?.includes('联系')
        ) {
          item.classList.add('info-item')
        }
      })
    }
  })
}

/**
 * 增强Muban11模板 - 现代蓝色模板
 */
const enhanceMuban11 = (element: HTMLElement): void => {
  // 确保卡片式布局中的标题保持一致样式
  const sectionTitles = element.querySelectorAll('.section-title')
  sectionTitles.forEach(title => {
    title.classList.add('modern-section-title')
  })

  // 确保技能项正确显示
  const skillItems = element.querySelectorAll('.skill-item')
  skillItems.forEach(item => {
    item.classList.add('modern-skill-item')
  })
}

/**
 * 增强Muban12模板 - 简约黑白模板
 */
const enhanceMuban12 = (element: HTMLElement): void => {
  // 为技能标签添加一致的间距
  const skillTags = element.querySelectorAll('.skill-tag')
  skillTags.forEach(tag => {
    tag.classList.add('minimal-skill-tag')
  })

  // 增强标题分割线效果
  const sectionTitles = element.querySelectorAll('.resume-section h2')
  sectionTitles.forEach(title => {
    title.classList.add('minimal-section-title')
  })
}

/**
 * 增强Muban13模板 - 清新卡片模板
 */
const enhanceMuban13 = (element: HTMLElement): void => {
  // 优化卡片阴影效果
  const cards = element.querySelectorAll('.card')
  cards.forEach(card => {
    card.classList.add('enhanced-card')
  })

  // 确保时间线元素对齐
  const timelineItems = element.querySelectorAll('.timeline-item')
  timelineItems.forEach(item => {
    item.classList.add('aligned-timeline-item')
  })
}

/**
 * 增强Muban14模板 - 专业技术模板
 */
const enhanceMuban14 = (element: HTMLElement): void => {
  // 优化侧边栏渐变效果
  const sidebar = element.querySelector('.resume-sidebar')
  if (sidebar) {
    sidebar.classList.add('enhanced-sidebar')
  }

  // 增强技能胶囊效果
  const skillPills = element.querySelectorAll('.skill-pill')
  skillPills.forEach(pill => {
    pill.classList.add('tech-skill-pill')
  })

  // 增强时间线可视效果
  const timelineEntries = element.querySelectorAll('.timeline-entry, .experience-item')
  timelineEntries.forEach(entry => {
    entry.classList.add('enhanced-timeline-entry')
  })
}

export default {
  enhanceTemplate
}
