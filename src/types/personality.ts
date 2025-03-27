export interface Question {
    id: string
    question: string
    options: {
        value: string
        label: string
    }[]
}

export interface OpenQuestion {
    id: string
    question: string
    placeholder: string
}

export interface TestAnswers {
    mbtiAnswers: string[]
    bigFiveAnswers: string[]
    openAnswers: string[]
}

export interface MBTITrait {
    name: string
    value: number
}

export interface BigFiveDimension {
    name: string
    value: number
    description: string
}

export interface AIInsight {
    title: string
    content: string
}

export interface CareerSuggestion {
    career: string
    match: number
    reason: string
}

export interface PersonalityReport {
    mbti: {
        type: string
        description: string
        traits: MBTITrait[]
    }
    bigFive: BigFiveDimension[]
    aiInsights: AIInsight[]
    careerSuggestions: CareerSuggestion[]
}
