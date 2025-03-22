export type FilterType = 'all' | 'fresh' | 'tech' | 'business'

export type TagType = 'success' | 'warning' | 'info' | 'primary' | 'danger'

export interface Template {
  id: number
  name: string
  description: string
  preview: string
  tags: string[]
  scenes: string[]
  features: string[]
}

export const getTagType = (tag: string): TagType => {
  switch (tag) {
    case '应届生': return 'success'
    case '技术类': return 'primary'
    case '商务类': return 'warning'
    case '创意类': return 'danger'
    default: return 'info'
  }
} 