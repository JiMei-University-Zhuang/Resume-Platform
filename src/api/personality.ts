import request from '@/utils/request'
import type { TestAnswers, PersonalityReport } from '@/types/personality'

export async function analyzePersonalityWithAI(
    answers: TestAnswers
): Promise<PersonalityReport> {
    const response = await request({
        url: '/personality/analyze',
        method: 'post',
        data: {
            mbtiAnswers: answers.mbtiAnswers,
            bigFiveAnswers: answers.bigFiveAnswers,
            openAnswers: answers.openAnswers
        }
    })
    return response.data
}
