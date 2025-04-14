// src/stores/examStore.ts
import { defineStore } from 'pinia'

export const useExamStore = defineStore('exam', {
  state: () => ({
    isInExam: false
  }),
  actions: {
    setExamStatus(status: boolean) {
      this.isInExam = status
      console.log(`Setting exam status to: ${status}`)
    }
  }
})
