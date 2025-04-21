<template>
  <div class="personalized-plan">
    <div class="plan-header">
      <div class="title-section">
        <div class="icon-wrapper">
          <IconCustomize :size="20" />
        </div>
        <h2>个性化学习路径</h2>
      </div>
      <div class="actions">
        <button class="refresh-btn" @click="generatePlan" :disabled="isGenerating">
          <IconRefresh :size="16" :class="{ spinning: isGenerating }" />
          {{ isGenerating ? '生成中...' : '重新生成' }}
        </button>
      </div>
    </div>

    <div v-if="isGenerating" class="generating-indicator">
      <div class="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="generating-text">正在为您生成个性化学习建议...</div>
    </div>

    <div v-else-if="!personalizedPlan || personalizedPlan.steps.length === 0" class="empty-plan">
      <div class="empty-icon">
        <IconLightbulb :size="32" />
      </div>
      <div class="empty-text">
        <p>点击"重新生成"按钮，AI将根据您的技能和职业需求生成个性化学习路径。</p>
      </div>
    </div>

    <div v-else class="plan-content">
      <div class="plan-intro">
        <p>{{ personalizedPlan.intro }}</p>
        <div class="skill-gap">
          <h3>
            <span class="icon"><IconTarget :size="16" /></span>
            技能差距分析
          </h3>
          <div class="skill-gap-chart">
            <div class="skills-needed">
              <h4>需要掌握</h4>
              <div class="skill-tags">
                <div v-for="skill in missingSkills" :key="skill" class="skill-tag missing">
                  {{ skill }}
                </div>
              </div>
            </div>
            <div class="skills-owned">
              <h4>已掌握</h4>
              <div class="skill-tags">
                <div v-for="skill in matchedSkills" :key="skill" class="skill-tag owned">
                  {{ skill }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="learning-steps">
        <h3>
          <span class="icon"><IconRoadmap :size="16" /></span>
          学习步骤
        </h3>
        <div class="steps-timeline">
          <div v-for="(step, index) in personalizedPlan.steps" :key="index" class="step-item">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-duration">{{ step.duration }}</div>
              <div class="step-description">{{ step.description }}</div>
              <div class="step-resources">
                <div class="resources-title">推荐资源:</div>
                <div class="resource-list">
                  <div
                    v-for="(resource, rIndex) in step.resources"
                    :key="rIndex"
                    class="resource-item"
                  >
                    <div class="resource-type">{{ resource.type }}</div>
                    <div class="resource-name">{{ resource.name }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-footer">
        <div class="note">
          <span class="icon"><IconInfo :size="16" /></span>
          注: 此学习路径基于您的技能背景和职业目标自动生成，可根据个人情况适当调整。
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import IconCustomize from '@/components/icons/IconCustomize.vue'
import IconRefresh from '@/components/icons/IconRefresh.vue'
import IconLightbulb from '@/components/icons/IconLightbulb.vue'
import IconTarget from '@/components/icons/IconTarget.vue'
import IconRoadmap from '@/components/icons/IconRoadmap.vue'
import IconInfo from '@/components/icons/IconInfo.vue'

const props = defineProps({
  careerName: {
    type: String,
    default: ''
  },
  userSkills: {
    type: Array as () => string[],
    default: () => []
  },
  careerSkills: {
    type: Array as () => string[],
    default: () => []
  }
})

interface LearningResource {
  type: string
  name: string
}

interface LearningStep {
  title: string
  duration: string
  description: string
  resources: LearningResource[]
}

interface PersonalizedPlan {
  intro: string
  steps: LearningStep[]
}

const isGenerating = ref(false)
const personalizedPlan = ref<PersonalizedPlan | null>(null)

// 计算技能匹配和缺失
const matchedSkills = computed(() => {
  if (!props.userSkills.length || !props.careerSkills.length) return []
  return props.careerSkills.filter(skill => props.userSkills.includes(skill))
})

const missingSkills = computed(() => {
  if (!props.careerSkills.length) return []
  return props.careerSkills.filter(skill => !props.userSkills.includes(skill))
})

// 监听职业变化，重新生成计划
watch(
  () => props.careerName,
  newVal => {
    if (newVal) {
      generatePlan()
    } else {
      personalizedPlan.value = null
    }
  },
  { immediate: true }
)

// 生成个性化学习计划
async function generatePlan() {
  if (!props.careerName || isGenerating.value) return

  isGenerating.value = true

  try {
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 根据用户技能和职业技能差距生成学习计划
    const skillGapPercentage =
      props.careerSkills.length > 0
        ? (missingSkills.value.length / props.careerSkills.length) * 100
        : 0

    // 根据技能差距生成不同的学习计划
    if (skillGapPercentage > 70) {
      // 大差距，需要从基础开始
      personalizedPlan.value = generateBasicPlan()
    } else if (skillGapPercentage > 30) {
      // 中等差距，针对性学习
      personalizedPlan.value = generateIntermediatePlan()
    } else {
      // 小差距，专注于提升和深化
      personalizedPlan.value = generateAdvancedPlan()
    }
  } catch (error) {
    console.error('生成学习计划失败:', error)
  } finally {
    isGenerating.value = false
  }
}

// 生成基础学习计划
function generateBasicPlan(): PersonalizedPlan {
  return {
    intro: `基于您的技能背景和${props.careerName}职业要求，您需要从基础开始系统性学习。以下是为您定制的学习路径，帮助您逐步掌握必要技能。`,
    steps: [
      {
        title: '掌握核心基础',
        duration: '2-3个月',
        description: `开始学习${props.careerName}的基础知识和核心概念，建立坚实的理论基础。`,
        resources: [
          { type: '在线课程', name: '入门基础课程系列' },
          { type: '电子书', name: '零基础入门指南' },
          { type: '实践项目', name: '基础概念实操练习' }
        ]
      },
      {
        title: '专项技能学习',
        duration: '3-4个月',
        description: `针对性学习${missingSkills.value.slice(0, 3).join('、')}等核心技能，通过项目实践巩固。`,
        resources: [
          { type: '在线教程', name: '技术专项训练营' },
          { type: '社区资源', name: '实战项目代码库' },
          { type: '视频课程', name: '从入门到精通系列' }
        ]
      },
      {
        title: '项目实战',
        duration: '2-3个月',
        description: '将所学知识应用到实际项目中，培养解决问题的能力和团队协作经验。',
        resources: [
          { type: '项目案例', name: '综合应用项目' },
          { type: '社区活动', name: '开源项目参与' },
          { type: '学习小组', name: '技术交流与协作' }
        ]
      },
      {
        title: '持续学习与成长',
        duration: '长期',
        description: '建立持续学习的习惯，关注行业动态，不断扩展知识面和提升技能深度。',
        resources: [
          { type: '进阶课程', name: '高级技术专题' },
          { type: '技术博客', name: '行业前沿解读' },
          { type: '专业社区', name: '持续交流与学习' }
        ]
      }
    ]
  }
}

// 生成中级学习计划
function generateIntermediatePlan(): PersonalizedPlan {
  return {
    intro: `您已经具备了部分${props.careerName}所需的技能，需要针对性地补充关键技能并深化现有知识。以下是为您量身定制的学习路径。`,
    steps: [
      {
        title: '技能差距补充',
        duration: '2-3个月',
        description: `集中学习${missingSkills.value.slice(0, 3).join('、')}等您尚未掌握的关键技能。`,
        resources: [
          { type: '专题课程', name: '快速掌握核心技能' },
          { type: '实战项目', name: '技能应用实践' },
          { type: '技术文档', name: '深度学习指南' }
        ]
      },
      {
        title: '知识整合与应用',
        duration: '2-3个月',
        description: '将新掌握的技能与已有技能整合，通过综合项目提升实际应用能力。',
        resources: [
          { type: '项目挑战', name: '综合能力提升项目' },
          { type: '案例分析', name: '行业最佳实践' },
          { type: '模拟场景', name: '真实工作环境模拟' }
        ]
      },
      {
        title: '专业化深入',
        duration: '3-4个月',
        description: `在${props.careerName}领域选择专业方向，深入学习相关技术和最佳实践。`,
        resources: [
          { type: '高级课程', name: '专业方向深度课程' },
          { type: '技术社区', name: '专家经验分享' },
          { type: '开源贡献', name: '实际项目参与' }
        ]
      }
    ]
  }
}

// 生成高级学习计划
function generateAdvancedPlan(): PersonalizedPlan {
  return {
    intro: `您已经掌握了${props.careerName}的大部分技能，只需要进一步提升和完善。以下是帮助您成为专业人士的学习路径。`,
    steps: [
      {
        title: '技能精进',
        duration: '1-2个月',
        description: `深入掌握${missingSkills.value.join('、')}等剩余技能，完善技术栈。`,
        resources: [
          { type: '专家课程', name: '高级技术专题' },
          { type: '技术论文', name: '前沿研究解读' },
          { type: '实战项目', name: '挑战性问题解决' }
        ]
      },
      {
        title: '系统架构与设计',
        duration: '2-3个月',
        description: `学习${props.careerName}领域的系统设计原则、架构模式和最佳实践。`,
        resources: [
          { type: '设计课程', name: '系统架构设计' },
          { type: '案例研究', name: '成功架构分析' },
          { type: '设计挑战', name: '架构设计实践' }
        ]
      },
      {
        title: '领导力与影响力',
        duration: '持续发展',
        description: '培养技术领导力，提升沟通协作能力，扩大行业影响力。',
        resources: [
          { type: '领导力课程', name: '技术团队管理' },
          { type: '演讲分享', name: '技术分享与演讲' },
          { type: '社区建设', name: '技术社区贡献' }
        ]
      }
    ]
  }
}
</script>

<style lang="scss" scoped>
.personalized-plan {
  background: rgba(15, 23, 42, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(99, 179, 237, 0.2);
  padding: 20px;
  margin-top: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);

  .plan-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title-section {
      display: flex;
      align-items: center;

      .icon-wrapper {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          rgba(66, 153, 225, 0.2) 0%,
          rgba(99, 179, 237, 0.3) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        color: #63b3ed;
      }

      h2 {
        font-size: 20px;
        color: #fff;
        text-shadow: 0 0 10px rgba(99, 179, 237, 0.3);
        margin: 0;
      }
    }

    .actions {
      .refresh-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(99, 179, 237, 0.1);
        border: 1px solid rgba(99, 179, 237, 0.3);
        padding: 8px 14px;
        color: #edf2f7;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background: rgba(99, 179, 237, 0.2);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }

  .generating-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;

    .loading-dots {
      display: flex;
      gap: 6px;
      margin-bottom: 16px;

      span {
        width: 12px;
        height: 12px;
        background-color: rgba(99, 179, 237, 0.7);
        border-radius: 50%;
        display: inline-block;
        animation: dots 1.4s infinite ease-in-out both;

        &:nth-child(1) {
          animation-delay: -0.32s;
        }

        &:nth-child(2) {
          animation-delay: -0.16s;
        }
      }

      @keyframes dots {
        0%,
        80%,
        100% {
          transform: scale(0);
        }
        40% {
          transform: scale(1);
        }
      }
    }

    .generating-text {
      color: #a0aec0;
      font-size: 16px;
    }
  }

  .empty-plan {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;

    .empty-icon {
      margin-bottom: 16px;
      color: rgba(99, 179, 237, 0.7);
    }

    .empty-text {
      text-align: center;
      max-width: 400px;

      p {
        color: #a0aec0;
        font-size: 15px;
        line-height: 1.5;
      }
    }
  }

  .plan-content {
    .plan-intro {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      p {
        color: #e2e8f0;
        line-height: 1.6;
        margin-bottom: 20px;
      }

      .skill-gap {
        background: rgba(15, 23, 42, 0.5);
        border-radius: 6px;
        padding: 16px;
        border: 1px solid rgba(99, 179, 237, 0.1);

        h3 {
          font-size: 16px;
          color: #fff;
          margin-top: 0;
          margin-bottom: 16px;
          display: flex;
          align-items: center;

          .icon {
            margin-right: 8px;
            color: #63b3ed;
          }
        }

        .skill-gap-chart {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;

          h4 {
            font-size: 14px;
            color: #cbd5e0;
            margin-top: 0;
            margin-bottom: 12px;
            font-weight: 500;
          }

          .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .skill-tag {
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 13px;

              &.missing {
                background: rgba(245, 101, 101, 0.1);
                border: 1px solid rgba(245, 101, 101, 0.3);
                color: #fc8181;
              }

              &.owned {
                background: rgba(72, 187, 120, 0.1);
                border: 1px solid rgba(72, 187, 120, 0.3);
                color: #68d391;
              }
            }
          }
        }
      }
    }

    .learning-steps {
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        color: #fff;
        margin-top: 0;
        margin-bottom: 16px;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 8px;
          color: #63b3ed;
        }
      }

      .steps-timeline {
        position: relative;

        &:before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          height: 100%;
          width: 2px;
          background: rgba(99, 179, 237, 0.2);
        }

        .step-item {
          position: relative;
          padding-left: 40px;
          margin-bottom: 30px;

          &:last-child {
            margin-bottom: 0;
          }

          .step-number {
            position: absolute;
            left: 0;
            top: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3182ce 0%, #63b3ed 100%);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            z-index: 2;
          }

          .step-content {
            background: rgba(26, 32, 44, 0.4);
            border-radius: 6px;
            padding: 16px;
            border: 1px solid rgba(99, 179, 237, 0.1);

            .step-title {
              font-size: 16px;
              font-weight: 600;
              color: #fff;
              margin-bottom: 4px;
            }

            .step-duration {
              font-size: 13px;
              color: #a0aec0;
              margin-bottom: 12px;
            }

            .step-description {
              color: #e2e8f0;
              font-size: 14px;
              line-height: 1.5;
              margin-bottom: 16px;
            }

            .step-resources {
              .resources-title {
                font-size: 14px;
                color: #cbd5e0;
                margin-bottom: 8px;
              }

              .resource-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;

                .resource-item {
                  background: rgba(15, 23, 42, 0.5);
                  border-radius: 4px;
                  padding: 8px 12px;

                  .resource-type {
                    font-size: 12px;
                    color: #63b3ed;
                    margin-bottom: 4px;
                  }

                  .resource-name {
                    font-size: 13px;
                    color: #e2e8f0;
                  }
                }
              }
            }
          }
        }
      }
    }

    .plan-footer {
      .note {
        display: flex;
        align-items: center;
        background: rgba(237, 137, 54, 0.1);
        border: 1px solid rgba(237, 137, 54, 0.2);
        border-radius: 6px;
        padding: 12px 16px;
        font-size: 14px;
        color: #ed8936;

        .icon {
          margin-right: 10px;
          flex-shrink: 0;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .personalized-plan {
    padding: 16px;

    .plan-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .actions {
        width: 100%;

        .refresh-btn {
          width: 100%;
          justify-content: center;
        }
      }
    }

    .plan-content {
      .skill-gap-chart {
        grid-template-columns: 1fr !important;
      }
    }
  }
}
</style>
