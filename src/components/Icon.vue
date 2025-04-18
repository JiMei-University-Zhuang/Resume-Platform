<template>
  <div class="icon" :style="{ fontSize: iconSize }">
    <i :class="iconClass"></i>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  name: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default'
})

const iconSize = computed(() => {
  if (props.size === 'default') return '1em'
  if (props.size === 'small') return '0.875em'
  if (props.size === 'large') return '1.5em'
  if (props.size === 'xlarge') return '2em'

  // 如果是数字，加上px单位
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }

  // 否则直接返回
  return props.size
})

const iconClass = computed(() => {
  // 基本图标映射
  const iconMap: Record<string, string> = {
    // 职业相关图标
    briefcase: 'fas fa-briefcase',
    code: 'fas fa-code',
    'chart-line': 'fas fa-chart-line',
    globe: 'fas fa-globe',
    'graduation-cap': 'fas fa-graduation-cap',
    microscope: 'fas fa-microscope',
    hammer: 'fas fa-hammer',
    stethoscope: 'fas fa-stethoscope',
    'balance-scale': 'fas fa-balance-scale',
    palette: 'fas fa-palette',
    database: 'fas fa-database',
    brain: 'fas fa-brain',
    robot: 'fas fa-robot',
    'laptop-code': 'fas fa-laptop-code',
    'network-wired': 'fas fa-network-wired',
    'chalkboard-teacher': 'fas fa-chalkboard-teacher',
    'hand-holding-medical': 'fas fa-hand-holding-medical',
    architecture: 'fas fa-drafting-compass',
    finance: 'fas fa-chart-bar',
    marketing: 'fas fa-bullhorn',

    // UI控制图标
    refresh: 'fas fa-sync-alt',
    zoomIn: 'fas fa-search-plus',
    zoomOut: 'fas fa-search-minus',
    close: 'fas fa-times',
    plus: 'fas fa-plus',
    minus: 'fas fa-minus',
    check: 'fas fa-check',
    info: 'fas fa-info-circle',
    question: 'fas fa-question-circle',
    cog: 'fas fa-cog',
    gear: 'fas fa-cog',
    settings: 'fas fa-cog',
    menu: 'fas fa-bars',
    search: 'fas fa-search',
    filter: 'fas fa-filter',
    sort: 'fas fa-sort',
    save: 'fas fa-save',
    user: 'fas fa-user',
    home: 'fas fa-home',
    edit: 'fas fa-edit',
    trash: 'fas fa-trash',
    download: 'fas fa-download',
    upload: 'fas fa-upload',
    link: 'fas fa-link',
    unlink: 'fas fa-unlink',

    // 方向图标
    'arrow-up': 'fas fa-arrow-up',
    'arrow-down': 'fas fa-arrow-down',
    'arrow-left': 'fas fa-arrow-left',
    'arrow-right': 'fas fa-arrow-right',
    'arrow-up-right': 'fas fa-arrow-up-right',
    'arrow-up-left': 'fas fa-arrow-up-left',
    'arrow-down-right': 'fas fa-arrow-down-right',
    'arrow-down-left': 'fas fa-arrow-down-left',
    'chevron-up': 'fas fa-chevron-up',
    'chevron-down': 'fas fa-chevron-down',
    'chevron-left': 'fas fa-chevron-left',
    'chevron-right': 'fas fa-chevron-right',

    // 交流图标
    message: 'fas fa-comment',
    'message-circle': 'fas fa-comment-dots',
    mail: 'fas fa-envelope',
    notification: 'fas fa-bell',
    share: 'fas fa-share-alt',

    // 数据图标
    'pie-chart': 'fas fa-chart-pie',
    'bar-chart': 'fas fa-chart-bar',
    'line-chart': 'fas fa-chart-line',
    'trending-up': 'fas fa-chart-line',
    'trending-down': 'fas fa-chart-line fa-flip-vertical',
    percent: 'fas fa-percentage',
    'dollar-sign': 'fas fa-dollar-sign',
    star: 'fas fa-star',
    calendar: 'fas fa-calendar',
    clock: 'fas fa-clock',
    location: 'fas fa-map-marker-alt',

    // 状态图标
    'alert-circle': 'fas fa-exclamation-circle',
    'alert-triangle': 'fas fa-exclamation-triangle',
    'check-circle': 'fas fa-check-circle',
    'x-circle': 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    success: 'fas fa-check-circle',
    loading: 'fas fa-spinner fa-spin'
  }

  // 返回匹配的图标类，如果没找到则返回问号图标
  return iconMap[props.name] || 'fas fa-question-circle'
})
</script>

<style scoped>
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;
}

.icon i {
  font-size: inherit;
}
</style>
