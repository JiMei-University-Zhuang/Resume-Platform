import { defineStore } from 'pinia'

interface AppState {
    collapsed: boolean
    isDark: boolean
}

export const useAppStore = defineStore('app', {
    state: (): AppState => ({
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
