<template>
  <div class="career-roadmap">
    <!-- 页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Connection /></el-icon>
        职业发展规划
      </h1>
      <p class="page-description">
        基于您的目标和当前状态，量身定制个性化的职业发展路线图，指引您的职业成长之路。
      </p>
    </div>

    <el-row :gutter="24" class="main-content">
      <!-- 左侧：目标设定与配置 -->
      <el-col :xs="24" :md="8" class="sidebar-container">
        <el-card v-if="!roadmapResult" class="form-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>设定您的职业目标</span>
              <el-tooltip content="填写您的基本信息和目标职位，我们将为您生成详细的职业发展路线图">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>

          <el-form :model="roadmapForm" label-position="top">
            <!-- 核心信息 -->
            <el-form-item label="当前职位" required>
              <el-input
                v-model="roadmapForm.currentPosition"
                placeholder="例如：初级前端工程师"
                clearable
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="目标职位" required>
              <el-input v-model="roadmapForm.targetPosition" placeholder="例如：技术总监" clearable>
                <template #prefix>
                  <el-icon><Aim /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-divider content-position="center">基本信息</el-divider>

            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="工作经验" required>
                  <el-select
                    v-model="roadmapForm.yearsOfExperience"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option :label="'应届毕业/无经验'" :value="0" />
                    <el-option :label="'1年以下'" :value="1" />
                    <el-option :label="'1-3年'" :value="2" />
                    <el-option :label="'3-5年'" :value="4" />
                    <el-option :label="'5-10年'" :value="7" />
                    <el-option :label="'10年以上'" :value="12" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学历背景" required>
                  <el-select
                    v-model="roadmapForm.education"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option label="高中/中专" value="high_school" />
                    <el-option label="大专" value="college" />
                    <el-option label="本科" value="bachelor" />
                    <el-option label="硕士" value="master" />
                    <el-option label="博士" value="phd" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="技能特长 (最多选择5项)" required>
              <el-select
                v-model="roadmapForm.skills"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择或输入您的技能"
                style="width: 100%"
                :max-collapse-tags="3"
                :max="5"
              >
                <el-option-group label="技术技能">
                  <el-option
                    v-for="skill in techSkills"
                    :key="skill.id"
                    :label="skill.name"
                    :value="skill.name"
                  />
                </el-option-group>
                <el-option-group label="管理技能">
                  <el-option
                    v-for="skill in managementSkills"
                    :key="skill.id"
                    :label="skill.name"
                    :value="skill.name"
                  />
                </el-option-group>
                <el-option-group label="软技能">
                  <el-option
                    v-for="skill in softSkills"
                    :key="skill.id"
                    :label="skill.name"
                    :value="skill.name"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item label="行业偏好" required>
              <el-select
                v-model="roadmapForm.preferredIndustry"
                placeholder="请选择您感兴趣的行业"
                style="width: 100%"
              >
                <el-option
                  v-for="industry in industryOptions"
                  :key="industry.value"
                  :label="industry.label"
                  :value="industry.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="期望达成时间">
              <el-radio-group v-model="expectedYears" class="time-radio-group">
                <el-radio :label="2">短期 (1-2年)</el-radio>
                <el-radio :label="5">中期 (3-5年)</el-radio>
                <el-radio :label="10">长期 (5年以上)</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>

          <div class="form-actions">
            <el-button @click="resetForm" plain>
              <el-icon><RefreshLeft /></el-icon>
              重置
            </el-button>
            <el-button type="primary" @click="generateRoadmap" :loading="generating">
              <el-icon><Connection /></el-icon>
              生成路线图
            </el-button>
          </div>
        </el-card>

        <!-- 路线图生成后的工具栏 -->
        <div v-else>
          <el-card class="roadmap-info-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>路线图信息</span>
                <el-button size="small" type="primary" @click="restartPlanning">
                  <el-icon><Back /></el-icon>
                  重新规划
                </el-button>
              </div>
            </template>

            <div class="plan-overview">
              <div class="plan-stat">
                <div class="stat-value">{{ roadmapResult.currentLevel }}</div>
                <div class="stat-label">当前阶段</div>
              </div>
              <div class="plan-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
              <div class="plan-stat">
                <div class="stat-value">{{ roadmapResult.targetPosition }}</div>
                <div class="stat-label">目标职位</div>
              </div>
              <div class="plan-arrow">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="plan-stat">
                <div class="stat-value">{{ roadmapResult.timelineYears }}年</div>
                <div class="stat-label">预计时间</div>
              </div>
            </div>

            <el-divider>关键建议</el-divider>
            <div class="key-recommendations">
              <div
                v-for="(recommendation, index) in roadmapResult.recommendations.slice(0, 2)"
                :key="index"
                class="recommendation-item"
              >
                <el-icon color="#409EFF"><Star /></el-icon>
                <span>{{ recommendation }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <!-- 主要内容区域 -->
      <el-col :xs="24" :md="16">
        <transition name="fade">
          <!-- 未生成路线图时显示的引导内容 -->
          <div v-if="!roadmapResult" class="empty-roadmap">
            <el-card shadow="hover" class="intro-card">
              <div class="intro-content">
                <img src="@/assets/career-path.svg" alt="职业发展" class="intro-image" />
                <h2>规划您的职业发展之路</h2>
                <p>
                  请在左侧表单中填写您的当前职位、目标职位、技能和偏好，我们将为您生成个性化的职业发展路线图，帮助您实现职业目标。
                </p>
                <div class="intro-features">
                  <div class="feature-item">
                    <el-icon><Aim /></el-icon>
                    <span>明确目标阶段</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><List /></el-icon>
                    <span>详细发展步骤</span>
                  </div>
                  <div class="feature-item">
                    <el-icon><Star /></el-icon>
                    <span>个性化建议</span>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 路线图展示区域 -->
          <div v-else class="roadmap-result">
            <el-card shadow="hover" class="roadmap-timeline-card">
              <template #header>
                <div class="card-header">
                  <span>职业发展路线图</span>
                </div>
              </template>

              <div class="roadmap-timeline">
                <el-timeline>
                  <el-timeline-item
                    v-for="(milestone, index) in roadmapResult.milestones"
                    :key="index"
                    :type="getTimelineItemType(index)"
                    :hollow="index === roadmapResult.milestones.length - 1"
                    :timestamp="milestone.duration"
                    placement="top"
                  >
                    <el-card class="timeline-card">
                      <h3 class="milestone-title">
                        <span>{{ milestone.title }}</span>
                        <el-tag :type="getTimelineItemType(index)" size="small">
                          阶段 {{ milestone.stage }}
                        </el-tag>
                      </h3>
                      <div class="milestone-content">
                        <div class="milestone-tasks">
                          <h4>关键任务</h4>
                          <ul>
                            <li v-for="(task, taskIndex) in milestone.tasks" :key="taskIndex">
                              {{ task }}
                            </li>
                          </ul>
                        </div>
                        <div class="milestone-skills">
                          <h4>需掌握的技能</h4>
                          <div class="skill-tags">
                            <el-tag
                              v-for="(skill, skillIndex) in milestone.skillsToAcquire"
                              :key="skillIndex"
                              :type="getTagType(skillIndex)"
                              class="skill-tag"
                            >
                              {{ skill }}
                            </el-tag>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>
            </el-card>

            <el-card shadow="hover" class="recommendations-card">
              <template #header>
                <div class="card-header">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>职业发展建议</span>
                </div>
              </template>
              <div class="recommendations-list">
                <div
                  v-for="(recommendation, index) in roadmapResult.recommendations"
                  :key="index"
                  class="recommendation-item"
                >
                  <div class="recommendation-number">{{ index + 1 }}</div>
                  <div class="recommendation-text">{{ recommendation }}</div>
                </div>
              </div>
            </el-card>
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { CareerRoadmapForm, CareerRoadmapResult, CareerSkill } from '@/types/career'
import { getCareerSkills } from '@/api/career'
import { getProfessionRoadmap } from '@/api/ai'
import {
  Connection,
  Aim,
  QuestionFilled,
  User,
  RefreshLeft,
  Back,
  ArrowRight,
  Timer,
  Star,
  ChatDotRound,
  List
} from '@element-plus/icons-vue'

// 表单活动标签页
// 简化版不再需要多标签页
// const activeTab = ref('position')

// 期望完成时间（年）
const expectedYears = ref(5)

// 技能和行业数据
const allSkills = ref<CareerSkill[]>([])
const generating = ref(false)
const roadmapResult = ref<CareerRoadmapResult | null>(null)

// 表单数据
const roadmapForm = reactive<CareerRoadmapForm>({
  currentPosition: '',
  targetPosition: '',
  yearsOfExperience: 2,
  skills: [],
  interests: [],
  education: '',
  preferredIndustry: ''
})

// 技能分类
const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const managementSkills = computed(() =>
  allSkills.value.filter(skill => skill.category === 'management')
)
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

// 行业选项
const industryOptions = [
  { label: '互联网/IT', value: 'internet' },
  { label: '金融/银行', value: 'finance' },
  { label: '教育培训', value: 'education' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '房地产/建筑', value: 'real_estate' },
  { label: '制造业', value: 'manufacturing' },
  { label: '零售/电商', value: 'retail' },
  { label: '文化/媒体', value: 'media' },
  { label: '咨询/服务', value: 'consulting' }
]

// 获取时间线项目类型
const getTimelineItemType = (
  index: number
): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const types: ('primary' | 'success' | 'warning' | 'danger' | 'info')[] = [
    'primary',
    'success',
    'warning',
    'info'
  ]
  return types[index % types.length]
}

// 获取标签类型
const getTagType = (index: number): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
  const types: ('primary' | 'success' | 'warning' | 'danger' | 'info')[] = [
    'success',
    'primary',
    'info',
    'warning'
  ]
  return types[index % types.length]
}

// 加载技能列表
onMounted(async () => {
  try {
    allSkills.value = await getCareerSkills()
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  }
})

// 生成路线图
const generateRoadmap = async () => {
  // 表单验证
  if (!roadmapForm.currentPosition) {
    ElMessage.warning('请填写当前职位')
    return
  }
  if (!roadmapForm.targetPosition) {
    ElMessage.warning('请填写目标职位')
    return
  }
  if (roadmapForm.skills.length === 0) {
    ElMessage.warning('请至少选择一项技能')
    return
  }

  generating.value = true
  try {
    // 调用接口生成路线图
    const response = await getProfessionRoadmap(roadmapForm)
    roadmapResult.value = response.data
    ElMessage.success('路线图生成成功')
  } catch (error) {
    ElMessage.error('生成路线图失败，请重试')
  } finally {
    generating.value = false
  }
}

// 重置表单
const resetForm = () => {
  roadmapForm.currentPosition = ''
  roadmapForm.targetPosition = ''
  roadmapForm.yearsOfExperience = 2
  roadmapForm.skills = []
  roadmapForm.interests = []
  roadmapForm.education = ''
  roadmapForm.preferredIndustry = ''
  expectedYears.value = 5
  // activeTab.value = 'position' // 不再需要
}

// 重新开始规划
const restartPlanning = () => {
  roadmapResult.value = null
}
</script>

<style scoped>
.career-roadmap {
  padding: 20px 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dcdfe6;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  color: #606266;
  font-size: 16px;
  margin: 8px 0 0 0;
}

/* 主要内容区域 */
.main-content {
  margin-top: 24px;
}

/* 表单卡片 */
.form-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 表单操作区 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

/* 期望达成时间单选按钮组 */
.time-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-radio-group .el-radio {
  margin-right: 0;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.time-radio-group .el-radio:hover {
  background-color: #f5f7fa;
}

.time-radio-group .el-radio.is-checked {
  background-color: #ecf5ff;
}

/* 路线图信息卡片 */
.roadmap-info-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  border-top: 3px solid #409eff;
}

.plan-overview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.plan-stat {
  text-align: center;
  flex: 1;
}

.plan-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #909399;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.key-recommendations {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

/* 引导区域 */
.empty-roadmap {
  height: 100%;
}

.intro-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
  height: 100%;
}

.intro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
}

.intro-image {
  width: 200px;
  margin-bottom: 24px;
}

.intro-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.intro-content p {
  color: #606266;
  margin-bottom: 24px;
  max-width: 600px;
}

.intro-features {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f7fa;
  min-width: 120px;
  transition: all 0.3s;
}

.feature-item:hover {
  background-color: #ecf5ff;
  transform: translateY(-4px);
}

.feature-item .el-icon {
  font-size: 24px;
  color: #409eff;
}

/* 路线图结果区域 */
.roadmap-result {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.roadmap-timeline-card,
.recommendations-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05) !important;
}

.roadmap-timeline {
  padding: 16px 0;
}

.timeline-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
  border-radius: 8px;
}

.milestone-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  color: #303133;
}

.milestone-content {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.milestone-tasks,
.milestone-skills {
  flex: 1;
  min-width: 200px;
}

.milestone-tasks h4,
.milestone-skills h4 {
  font-size: 14px;
  color: #909399;
  margin-bottom: 12px;
}

.milestone-tasks ul {
  padding-left: 16px;
  margin: 0;
}

.milestone-tasks li {
  margin-bottom: 8px;
  color: #606266;
}

.milestone-tasks li:last-child {
  margin-bottom: 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  margin-right: 0;
}

/* 建议卡片 */
.recommendations-card .card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommendations-list .recommendation-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: #f5f7fa;
  transition: all 0.3s;
}

.recommendations-list .recommendation-item:hover {
  background-color: #ecf5ff;
}

.recommendation-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.recommendation-text {
  flex: 1;
  color: #606266;
  line-height: 1.6;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .career-roadmap {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .sidebar-container {
    margin-bottom: 24px;
  }

  .milestone-content {
    flex-direction: column;
  }
}
</style>
