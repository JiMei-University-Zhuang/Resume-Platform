import type { Question, OpenQuestion } from '@/types/personality'

export const mbtiQuestions: Question[] = [
    {
        id: 'E1',
        question: '在社交场合中，你通常会：',
        options: [
            { value: 'E', label: '主动与他人交谈，享受社交' },
            { value: 'I', label: '倾向于观察和倾听，保持安静' }
        ]
    },
    {
        id: 'S1',
        question: '在处理问题时，你更倾向于：',
        options: [
            { value: 'S', label: '关注具体细节和实际经验' },
            { value: 'N', label: '思考整体概念和未来可能性' }
        ]
    },
    {
        id: 'T1',
        question: '做决定时，你通常会：',
        options: [
            { value: 'T', label: '依据逻辑和客观分析' },
            { value: 'F', label: '考虑他人感受和价值观' }
        ]
    },
    {
        id: 'J1',
        question: '你更喜欢：',
        options: [
            { value: 'J', label: '按计划行事，提前安排' },
            { value: 'P', label: '保持灵活，随机应变' }
        ]
    }
    // 添加更多 MBTI 问题...
]

export const bigFiveQuestions: Question[] = [
    {
        id: 'O1',
        question: '我经常尝试新事物和新体验',
        options: [
            { value: '5', label: '非常同意' },
            { value: '4', label: '比较同意' },
            { value: '3', label: '一般' },
            { value: '2', label: '比较不同意' },
            { value: '1', label: '非常不同意' }
        ]
    },
    {
        id: 'C1',
        question: '我做事有条理，喜欢把事情安排得井井有条',
        options: [
            { value: '5', label: '非常同意' },
            { value: '4', label: '比较同意' },
            { value: '3', label: '一般' },
            { value: '2', label: '比较不同意' },
            { value: '1', label: '非常不同意' }
        ]
    },
    {
        id: 'E1',
        question: '我喜欢与人交往，经常参加社交活动',
        options: [
            { value: '5', label: '非常同意' },
            { value: '4', label: '比较同意' },
            { value: '3', label: '一般' },
            { value: '2', label: '比较不同意' },
            { value: '1', label: '非常不同意' }
        ]
    }
    // 添加更多大五人格问题...
]

export const openQuestions: OpenQuestion[] = [
    {
        id: 'OQ1',
        question: '描述一个你最近遇到的挑战，以及你是如何处理的？',
        placeholder: '请详细描述情况、你的想法和行动...'
    },
    {
        id: 'OQ2',
        question: '在理想的工作环境中，什么因素对你来说最重要？为什么？',
        placeholder: '考虑团队氛围、工作方式、发展机会等方面...'
    },
    {
        id: 'OQ3',
        question: '你认为自己最大的优势和需要改进的地方是什么？',
        placeholder: '从个人特质、专业能力等方面进行分析...'
    }
]
