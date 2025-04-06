<template>
  <div class="career-analysis">
    <!-- 页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Aim /></el-icon>
        职业倾向分析
      </h1>
      <p class="page-description">
        基于您的背景、技能和兴趣，我们将为您分析最适合的职业方向和发展路径。
      </p>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="24" class="analysis-container">
      <!-- 左侧：简化后的表单 -->
      <el-col :xs="24" :md="10">
        <div class="form-container">
          <div class="step-indicator">
            <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-label">基本信息</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 1 }"></div>
            <div class="step" :class="{ active: currentStep >= 2 }">
              <div class="step-number">2</div>
              <div class="step-label">技能与兴趣</div>
            </div>
          </div>

          <el-card class="step-card" shadow="hover">
            <!-- 步骤1：基本信息 -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="step-title">您的基本情况</h2>
              <p class="step-description">
                请填写您的基本背景信息，这将帮助我们更准确地分析适合您的职业路径。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="最高学历" required>
                  <el-select
                    v-model="analysisForm.education"
                    placeholder="请选择您的学历"
                    class="full-width"
                  >
                    <el-option label="高中/中专" value="high_school" />
                    <el-option label="大专" value="college" />
                    <el-option label="本科" value="bachelor" />
                    <el-option label="硕士" value="master" />
                    <el-option label="博士" value="phd" />
                  </el-select>
                </el-form-item>

                <el-form-item label="专业方向" required>
                  <el-input
                    v-model="analysisForm.major"
                    placeholder="例如：计算机科学、市场营销、心理学..."
                    clearable
                  />
                </el-form-item>

                <el-form-item label="工作年限">
                  <el-radio-group
                    v-model="analysisForm.workExperience"
                    class="experience-radio-group"
                  >
                    <el-radio :label="0">应届毕业生/无工作经验</el-radio>
                    <el-radio :label="1">1年以下</el-radio>
                    <el-radio :label="2">1-3年</el-radio>
                    <el-radio :label="4">3-5年</el-radio>
                    <el-radio :label="7">5-10年</el-radio>
                    <el-radio :label="12">10年以上</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>

            <!-- 步骤2：技能与兴趣 -->
            <div v-if="currentStep === 2" class="step-content">
              <h2 class="step-title">您的技能与兴趣</h2>
              <p class="step-description">
                选择您擅长的技能和感兴趣的领域，这将帮助我们找到最匹配的职业方向。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="专业技能" required>
                  <el-select
                    v-model="analysisForm.skills"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或添加您擅长的技能"
                    class="full-width"
                  >
                    <el-option-group label="技术类">
                      <el-option
                        v-for="skill in techSkills"
                        :key="skill.id"
                        :label="skill.name"
                        :value="skill.name"
                      />
                    </el-option-group>
                    <el-option-group label="设计类">
                      <el-option
                        v-for="skill in designSkills"
                        :key="skill.id"
                        :label="skill.name"
                        :value="skill.name"
                      />
                    </el-option-group>
                    <el-option-group label="管理类">
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

                <el-form-item label="兴趣方向" required>
                  <el-select
                    v-model="analysisForm.interests"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或添加您感兴趣的领域"
                    class="full-width"
                  >
                    <el-option
                      v-for="interest in interestOptions"
                      :key="interest.value"
                      :label="interest.label"
                      :value="interest.value"
                    />
                  </el-select>
                </el-form-item>

                <div class="form-action">
                  <el-button
                    type="primary"
                    size="large"
                    @click="submitAnalysis"
                    :loading="analyzing"
                    class="submit-button"
                  >
                    开始职业分析
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </el-form>
            </div>

            <!-- 步骤导航按钮 -->
            <div class="step-navigation">
              <el-button
                v-if="currentStep > 1"
                @click="currentStep--"
                class="nav-button prev-button"
              >
                <el-icon><ArrowLeft /></el-icon>
                上一步
              </el-button>
              <el-button
                v-if="currentStep < 2"
                @click="nextStep"
                type="primary"
                class="nav-button next-button"
              >
                下一步
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </div>
      </el-col>

      <!-- 右侧：分析结果展示 -->
      <el-col :xs="24" :md="14">
        <transition name="fade">
          <div v-if="!analysisResult" class="preview-container">
            <el-card shadow="hover" class="preview-card">
              <template #header>
                <div class="preview-header">
                  <span>职业分析说明</span>
                </div>
              </template>

              <div class="preview-content">
                <div class="preview-empty">
                  <el-empty description="完成表单后，您将获得详细的职业分析结果">
                    <el-button type="primary" @click="currentStep = 1">开始填写</el-button>
                  </el-empty>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 分析结果展示 -->
          <div v-else class="result-container">
            <el-card class="result-summary-card" shadow="hover">
              <div class="result-summary">
                <div class="result-header">
                  <div class="result-title">
                    <h2>
                      您最适合的职业：<span class="highlight">{{
                        analysisResult.recommendedCareer
                      }}</span>
                    </h2>
                  </div>
                  <div class="match-score-container">
                    <el-progress
                      type="dashboard"
                      :percentage="analysisResult.suitabilityScore"
                      :color="getScoreColor(analysisResult.suitabilityScore)"
                      :stroke-width="15"
                    />
                    <div class="score-label">匹配度</div>
                  </div>
                </div>

                <div class="result-advantages">
                  <h3>
                    <el-icon><Star /></el-icon> 职业优势
                  </h3>
                  <p>{{ analysisResult.advantages }}</p>
                </div>
              </div>
            </el-card>

            <!-- 优劣势分析 -->
            <el-row :gutter="20" class="strength-weakness-row">
              <el-col :xs="24" :md="12">
                <el-card class="strength-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                      <span>您的优势</span>
                    </div>
                  </template>
                  <ul class="strength-list">
                    <li v-for="(strength, index) in analysisResult.strengths" :key="index">
                      <el-icon color="#67C23A"><Check /></el-icon>
                      <span>{{ strength }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-card class="weakness-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon color="#F56C6C"><InfoFilled /></el-icon>
                      <span>提升空间</span>
                    </div>
                  </template>
                  <ul class="weakness-list">
                    <li v-for="(weakness, index) in analysisResult.weaknesses" :key="index">
                      <el-icon color="#F56C6C"><Warning /></el-icon>
                      <span>{{ weakness }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>
            </el-row>

            <!-- 相关职业推荐 -->
            <el-card class="related-careers-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>其他适合您的职业</span>
                </div>
              </template>
              <div class="related-careers-container">
                <div
                  v-for="(career, index) in analysisResult.relatedCareers"
                  :key="index"
                  class="related-career-item"
                  @click="goToRecommendationWithCareer(career)"
                >
                  <div class="career-info">
                    <h3>{{ career }}</h3>
                    <div class="career-match">
                      <el-progress
                        :percentage="getRelatedCareerMatch(index)"
                        :stroke-width="8"
                        :show-text="false"
                      />
                      <span>匹配度 {{ getRelatedCareerMatch(index) }}%</span>
                    </div>
                  </div>
                  <el-button type="primary" text>
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-card>

            <!-- 发展建议 -->
            <el-card class="suggestions-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><ChatLineRound /></el-icon>
                  <span>个性化发展建议</span>
                </div>
              </template>
              <div class="suggestions-content">
                <p>{{ analysisResult.suggestions }}</p>
                <div class="action-buttons">
                  <el-button type="primary" @click="goToRoadmap">
                    <el-icon><Connection /></el-icon>
                    制定职业发展规划
                  </el-button>
                  <el-button type="success" @click="goToRecommendation">
                    <el-icon><View /></el-icon>
                    探索更多职业选择
                  </el-button>
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
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { CareerAnalysisForm, CareerAnalysisResult, CareerSkill } from '@/types/career'
import { getCareerSkills } from '@/api/career'
import { getProfessionAnalysis } from '@/api/ai'
import {
  Aim,
  InfoFilled,
  CircleCheckFilled,
  ArrowLeft,
  ArrowRight,
  Star,
  Check,
  Warning,
  View,
  ChatLineRound,
  Connection
} from '@element-plus/icons-vue'

const router = useRouter()
const analyzing = ref(false)
const allSkills = ref<CareerSkill[]>([])
const currentStep = ref(1)

// 表单数据
const analysisForm = reactive<CareerAnalysisForm>({
  education: '',
  major: '',
  skills: [],
  interests: [],
  workExperience: 0
})

// 分析结果
const analysisResult = ref<CareerAnalysisResult | null>(null)

// 步骤2：技能分类
const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const designSkills = computed(() => allSkills.value.filter(skill => skill.category === 'design'))
const managementSkills = computed(() =>
  allSkills.value.filter(skill => skill.category === 'management')
)
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

// 步骤2：兴趣选项
const interestOptions = [
  { label: '技术研究', value: 'tech_research' },
  { label: '创意设计', value: 'creative_design' },
  { label: '数据分析', value: 'data_analysis' },
  { label: '人际沟通', value: 'communication' },
  { label: '团队协作', value: 'teamwork' },
  { label: '写作', value: 'writing' },
  { label: '策略规划', value: 'strategy' },
  { label: '教学培训', value: 'teaching' },
  { label: '财务管理', value: 'financial' },
  { label: '项目管理', value: 'project_management' }
]

// 加载技能列表
onMounted(async () => {
  try {
    allSkills.value = await getCareerSkills()
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  }
})

// 步骤控制
const nextStep = () => {
  // 进行简单验证
  if (currentStep.value === 1) {
    if (!analysisForm.education || !analysisForm.major) {
      ElMessage.warning('请填写完整的教育背景信息')
      return
    }
  }
  currentStep.value++
}

// 提交分析
const submitAnalysis = async () => {
  if (!analysisForm.education || !analysisForm.major || analysisForm.skills.length === 0) {
    ElMessage.warning('请填写必要的信息（教育背景、专业方向和技能特长）')
    return
  }

  analyzing.value = true
  try {
    // 实际项目中，这里请求后端API
    const response = await getProfessionAnalysis(analysisForm)
    analysisResult.value = response.data
    ElMessage.success('分析完成')
  } catch (error) {
    ElMessage.error('分析失败，请重试')
    console.error(error)
  } finally {
    analyzing.value = false
  }
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 70) return '#409EFF'
  return '#F56C6C'
}

// 获取相关职业匹配度
const getRelatedCareerMatch = (index: number) => {
  if (!analysisResult.value) return 0
  const baseScore = analysisResult.value.suitabilityScore
  return Math.max(50, baseScore - (index + 1) * 5)
}

// 页面跳转
const goToRoadmap = () => {
  router.push('/career-planning/roadmap')
}

const goToRecommendationWithCareer = (career: string) => {
  router.push({
    path: '/career-planning/recommendation',
    query: { career }
  })
}

const goToRecommendation = () => {
  router.push('/career-planning/recommendation')
}
</script>

<style scoped>
.career-analysis {
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

/* 主容器样式 */
.analysis-container {
  margin-top: 24px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 12px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #dcdfe6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #409eff;
  transform: scale(1.1);
}

.step.completed .step-number {
  background-color: #67c23a;
}

.step-label {
  font-size: 14px;
  color: #909399;
  transition: all 0.3s ease;
}

.step.active .step-label {
  color: #409eff;
  font-weight: bold;
}

.step.completed .step-label {
  color: #67c23a;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #dcdfe6;
  position: relative;
  z-index: 1;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #67c23a;
}

/* 表单卡片 */
.step-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.step-content {
  padding: 16px 8px;
}

.step-title {
  font-size: 20px;
  color: #303133;
  margin: 0 0 8px 0;
}

.step-description {
  color: #606266;
  margin-bottom: 24px;
}

.full-width {
  width: 100%;
}

/* 步骤导航 */
.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

/* 工作年限单选按钮组样式 */
.experience-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.experience-radio-group .el-radio {
  margin-right: 0;
  padding: 8px 12px;
  border-radius: 4px;
  transition: all 0.3s;
}

.experience-radio-group .el-radio:hover {
  background-color: #f5f7fa;
}

.experience-radio-group .el-radio.is-checked {
  background-color: #ecf5ff;
}

/* 提交按钮 */
.form-action {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.submit-button {
  padding: 12px 24px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 预览区域 */
.preview-container {
  height: 100%;
}

.preview-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

/* 结果区域 */
.result-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-summary-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #409eff;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-title h2 {
  font-size: 20px;
  color: #303133;
  margin: 0 0 12px 0;
}

.result-title .highlight {
  color: #409eff;
  font-weight: bold;
}

.match-score-container {
  text-align: center;
}

.score-label {
  margin-top: 8px;
  color: #606266;
}

.result-advantages {
  background-color: #f0f9eb;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
}

.result-advantages h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67c23a;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.result-advantages p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

/* 优劣势分析 */
.strength-weakness-row {
  margin-bottom: 0;
}

.strength-card,
.weakness-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.strength-card {
  border-top: 3px solid #67c23a;
}

.weakness-card {
  border-top: 3px solid #f56c6c;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-list,
.weakness-list {
  padding-left: 0;
  list-style-type: none;
}

.strength-list li,
.weakness-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.strength-list li:last-child,
.weakness-list li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* 相关职业 */
.related-careers-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.related-careers-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.related-career-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-career-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #c6e2ff;
}

.career-info {
  flex: 1;
}

.career-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.career-match {
  display: flex;
  align-items: center;
  gap: 8px;
}

.career-match span {
  font-size: 14px;
  color: #606266;
}

/* 发展建议 */
.suggestions-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.suggestions-content {
  color: #606266;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.action-buttons .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .career-analysis {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .result-header {
    flex-direction: column;
    gap: 20px;
  }

  .related-careers-container {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
