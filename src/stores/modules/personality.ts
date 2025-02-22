import { defineStore } from 'pinia'
import type { PersonalityReport, TestAnswers } from '@/types/personality'
import { analyzePersonalityWithAI } from '@/api/personality'

interface PersonalityState {
  report: PersonalityReport | null
  loading: boolean
}

export const usePersonalityStore = defineStore('personality', {
  state: (): PersonalityState => ({
    report: null,
    loading: false
  }),

  actions: {
    async analyzePersonality(answers: TestAnswers) {
      this.loading = true
      try {
        const report = await analyzePersonalityWithAI(answers)
        this.report = report
        return report
      } finally {
        this.loading = false
      }
    },

    clearReport() {
      this.report = null
    }
  }
})
