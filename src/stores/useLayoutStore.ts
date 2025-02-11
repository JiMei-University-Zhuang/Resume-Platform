import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    collapsed: false,
    isDark: false
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.className = this.isDark ? 'dark' : ''
    }
  }
}) 