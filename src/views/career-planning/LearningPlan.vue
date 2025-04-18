<template>
  <div class="learning-plan-container">
    <h1 class="page-title">个人学习计划</h1>

    <div class="plan-header">
      <div class="selected-career" v-if="selectedCareer">
        <h2>{{ selectedCareer.title }} 学习规划</h2>
        <div class="career-match">匹配度: {{ selectedCareer.matchScore }}%</div>
      </div>
      <div class="no-career" v-else>
        <div class="placeholder-message">
          请先从<router-link to="/career-planning/map">职业星图</router-link>选择一个职业
        </div>
      </div>
    </div>

    <div class="plan-content" v-if="selectedCareer">
      <div class="plan-section">
        <h3>关键学习目标</h3>
        <div class="key-objectives">
          <div class="objective-item" v-for="(objective, index) in learningObjectives" :key="index">
            <div class="objective-icon">{{ index + 1 }}</div>
            <div class="objective-details">
              <div class="objective-title">{{ objective.title }}</div>
              <div class="objective-description">{{ objective.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-section">
        <h3>技能提升路径</h3>
        <div class="skill-path">
          <div class="timeline">
            <div
              class="timeline-item"
              v-for="(phase, index) in learningPath"
              :key="index"
              :class="{ active: index === currentPhase }"
            >
              <div class="timeline-phase">{{ phase.phase }}</div>
              <div class="timeline-content">
                <div class="phase-title">{{ phase.title }}</div>
                <div class="phase-duration">{{ phase.duration }}</div>
                <div class="phase-skills">
                  <div class="skill-tag" v-for="skill in phase.skills" :key="skill">
                    {{ skill }}
                  </div>
                </div>
                <div class="phase-description">{{ phase.description }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="plan-section">
        <h3>推荐学习资源</h3>
        <div class="resources-list">
          <div class="resource-item" v-for="(resource, index) in learningResources" :key="index">
            <div class="resource-type">{{ resource.type }}</div>
            <div class="resource-details">
              <div class="resource-title">{{ resource.title }}</div>
              <div class="resource-info">{{ resource.info }}</div>
            </div>
            <div class="resource-difficulty">{{ resource.difficulty }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Career } from './utils/careerMapData'

const route = useRoute()
const selectedCareer = ref<Career | null>(null)
const currentPhase = ref(0)

// 模拟数据 - 实际应用中应从API获取
const learningObjectives = ref([
  {
    title: '掌握核心技术栈',
    description: '深入学习前端框架（如Vue、React）和后端技术（如Node.js、数据库）'
  },
  {
    title: '构建项目作品集',
    description: '完成2-3个全栈项目，展示技术能力和解决问题的能力'
  },
  {
    title: '参与开源项目',
    description: '为开源社区贡献代码，提升协作能力和代码质量'
  }
])

const learningPath = ref([
  {
    phase: '1',
    title: '基础夯实',
    duration: '2-3个月',
    skills: ['HTML/CSS', 'JavaScript', '计算机基础'],
    description: '巩固编程基础知识，了解Web开发核心概念'
  },
  {
    phase: '2',
    title: '框架学习',
    duration: '3-4个月',
    skills: ['Vue.js', 'React', 'Node.js'],
    description: '掌握主流前端框架和基本后端开发技能'
  },
  {
    phase: '3',
    title: '项目实战',
    duration: '4-6个月',
    skills: ['数据库', 'API设计', '项目架构'],
    description: '通过实际项目应用所学知识，解决实际问题'
  },
  {
    phase: '4',
    title: '高级提升',
    duration: '持续学习',
    skills: ['性能优化', '设计模式', '微服务'],
    description: '深入高级主题，保持技术更新，拓展技术广度'
  }
])

const learningResources = ref([
  {
    type: '在线课程',
    title: 'Web全栈开发实战',
    info: '覆盖前后端开发的完整课程，包含实战项目',
    difficulty: '中级'
  },
  {
    type: '技术书籍',
    title: 'JavaScript高级程序设计',
    info: 'JavaScript必读经典，深入理解语言核心',
    difficulty: '中高级'
  },
  {
    type: '实践项目',
    title: '个人博客系统',
    info: '从零构建一个完整的博客系统，包含用户管理、内容管理等功能',
    difficulty: '入门-中级'
  },
  {
    type: '技术社区',
    title: 'GitHub开源项目',
    info: '参与受欢迎的开源项目，提交PR，与其他开发者协作',
    difficulty: '中高级'
  }
])

onMounted(() => {
  const careerId = route.query.careerId

  if (careerId) {
    // 修复类型转换问题，明确指定Career类型的所有必要字段
    selectedCareer.value = {
      id: careerId.toString(),
      name: '全栈工程师',
      title: '全栈工程师',
      matchScore: 92,
      trend: 15,
      salaryRange: '15k-30k',
      requiredSkills: [],
      description: '全栈工程师能够处理前端和后端开发，拥有全面的技术视野',
      skills: [],
      position: { x: 0, y: 0 }
    } as Career
  }
})
</script>

<style scoped>
.learning-plan-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(23, 28, 49, 0.5) 0%, rgba(23, 28, 49, 0.3) 100%);
  min-height: calc(100vh - 100px);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.page-title {
  font-size: 32px;
  margin-bottom: 32px;
  text-align: center;
  font-weight: 700;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #5e9eff, #83a4ff, #9f7bff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(89, 131, 255, 0.3);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #5e9eff, #9f7bff);
  border-radius: 3px;
}

.plan-header {
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(32, 41, 75, 0.8), rgba(39, 55, 107, 0.6));
  border-radius: 14px;
  border: 1px solid rgba(89, 131, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.plan-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3498db, #5983ff, #7a61ff);
  border-radius: 3px 3px 0 0;
}

.selected-career h2 {
  font-size: 28px;
  margin-bottom: 12px;
  color: #ffffff;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.career-match {
  font-size: 18px;
  color: #4cd964;
  font-weight: 500;
  display: inline-block;
  padding: 5px 12px;
  background: rgba(76, 217, 100, 0.15);
  border-radius: 20px;
  border: 1px solid rgba(76, 217, 100, 0.3);
}

.no-career {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.placeholder-message {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.placeholder-message a {
  color: #5e9eff;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(94, 158, 255, 0.1);
}

.placeholder-message a:hover {
  color: #ffffff;
  background: rgba(94, 158, 255, 0.3);
  text-decoration: none;
}

.plan-section {
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(32, 41, 75, 0.6), rgba(39, 55, 107, 0.4));
  border-radius: 14px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.plan-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(89, 131, 255, 0.2);
}

.plan-section h3 {
  font-size: 22px;
  margin-bottom: 24px;
  color: #ffffff;
  position: relative;
  padding-left: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  display: inline-block;
}

.plan-section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 24px;
  background: linear-gradient(to bottom, #3498db, #5983ff);
  border-radius: 3px;
}

/* Key Objectives Styles */
.key-objectives {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.objective-item {
  display: flex;
  gap: 18px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.15), rgba(89, 131, 255, 0.08));
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s;
  border: 1px solid rgba(89, 131, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.objective-item:hover {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(89, 131, 255, 0.12));
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(89, 131, 255, 0.3);
}

.objective-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(89, 131, 255, 0.4);
}

.objective-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.95);
}

.objective-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

/* Timeline Styles */
.timeline {
  position: relative;
  padding-left: 40px;
  margin-top: 15px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, rgba(89, 131, 255, 0.7), rgba(89, 131, 255, 0.1));
  border-radius: 1px;
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-phase {
  position: absolute;
  left: -40px;
  top: 0;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #29323c, #485563);
  border: 2px solid #5983ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  z-index: 1;
  box-shadow:
    0 0 0 5px rgba(89, 131, 255, 0.1),
    0 4px 10px rgba(0, 0, 0, 0.2);
}

.timeline-content {
  background: linear-gradient(135deg, rgba(40, 50, 85, 0.6), rgba(52, 65, 107, 0.4));
  border-radius: 14px;
  padding: 20px;
  margin-left: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(89, 131, 255, 0.15);
  transition: all 0.3s ease;
}

.timeline-content:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: translateX(4px);
}

.phase-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ffffff;
}

.phase-duration {
  font-size: 15px;
  color: rgba(224, 224, 255, 0.8);
  margin-bottom: 14px;
  display: inline-block;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.phase-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}

.skill-tag {
  background: linear-gradient(135deg, rgba(89, 131, 255, 0.2), rgba(89, 131, 255, 0.3));
  border: 1px solid rgba(89, 131, 255, 0.4);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(89, 131, 255, 0.2);
  transition: all 0.2s ease;
}

.skill-tag:hover {
  background: linear-gradient(135deg, rgba(89, 131, 255, 0.3), rgba(89, 131, 255, 0.4));
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(89, 131, 255, 0.3);
}

.phase-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
}

/* Active timeline item */
.timeline-item.active .timeline-phase {
  background: linear-gradient(135deg, #3498db, #5983ff);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow:
    0 0 15px rgba(89, 131, 255, 0.6),
    0 0 0 8px rgba(89, 131, 255, 0.2);
}

.timeline-item.active .timeline-content {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(89, 131, 255, 0.1));
  border: 1px solid rgba(89, 131, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Resources Styles */
.resources-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.resource-item {
  display: flex;
  background: linear-gradient(135deg, rgba(40, 50, 85, 0.6), rgba(52, 65, 107, 0.4));
  border-radius: 14px;
  padding: 20px;
  transition: all 0.3s;
  border: 1px solid rgba(89, 131, 255, 0.15);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.resource-item:hover {
  background: linear-gradient(135deg, rgba(40, 50, 85, 0.7), rgba(52, 65, 107, 0.5));
  transform: translateX(6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(89, 131, 255, 0.25);
}

.resource-type {
  min-width: 110px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  border-radius: 30px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  text-align: center;
  align-self: flex-start;
  box-shadow: 0 4px 10px rgba(89, 131, 255, 0.3);
}

.resource-details {
  flex-grow: 1;
  margin: 0 20px;
}

.resource-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #ffffff;
}

.resource-info {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.resource-difficulty {
  align-self: center;
  font-size: 14px;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.9);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .key-objectives {
    grid-template-columns: 1fr;
  }

  .plan-section {
    padding: 20px;
  }

  .timeline {
    padding-left: 30px;
  }

  .timeline-phase {
    left: -30px;
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .resource-item {
    flex-direction: column;
    gap: 15px;
  }

  .resource-type {
    align-self: flex-start;
  }

  .resource-details {
    margin: 0;
  }

  .resource-difficulty {
    align-self: flex-start;
  }
}
</style>
