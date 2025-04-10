<template>
  <div class="career-analysis">
    <!-- 页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Aim /></el-icon>
        职业倾向分析
        <span class="beta-tag">Beta</span>
      </h1>
      <p class="page-description">
        基于你的专业、技能和兴趣，我们将为你分析最适合的职业方向和发展路径。
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
              <h2 class="step-title">你的基本情况</h2>
              <p class="step-description">
                请填写你的基本学习背景，这将帮助我们更准确地分析适合你的职业路径。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="学习阶段" required>
                  <el-select
                    v-model="analysisForm.currentStatus"
                    placeholder="请选择你的当前学习阶段"
                    class="full-width"
                  >
                    <el-option label="大一在读" value="freshman" />
                    <el-option label="大二在读" value="sophomore" />
                    <el-option label="大三在读" value="junior" />
                    <el-option label="大四在读" value="senior" />
                    <el-option label="研究生在读" value="graduate" />
                    <el-option label="应届毕业生" value="new_graduate" />
                  </el-select>
                </el-form-item>

                <el-form-item label="最高学历" required>
                  <el-select
                    v-model="analysisForm.education"
                    placeholder="请选择你的学历"
                    class="full-width"
                  >
                    <el-option label="大专在读" value="college_student" />
                    <el-option label="大专毕业" value="college" />
                    <el-option label="本科在读" value="bachelor_student" />
                    <el-option label="本科毕业" value="bachelor" />
                    <el-option label="硕士在读" value="master_student" />
                    <el-option label="硕士毕业" value="master" />
                    <el-option label="博士在读" value="phd_student" />
                    <el-option label="博士毕业" value="phd" />
                  </el-select>
                </el-form-item>

                <el-form-item label="专业方向" required>
                  <el-select
                    v-model="analysisForm.major"
                    placeholder="请选择你的专业方向"
                    class="full-width"
                  >
                    <el-option label="计算机/软件工程" value="cs" />
                    <el-option label="电子信息工程" value="ee" />
                    <el-option label="数学/统计学" value="math" />
                    <el-option label="物理/化学" value="physics" />
                    <el-option label="经济/金融" value="economics" />
                    <el-option label="管理学" value="management" />
                    <el-option label="文学/传媒" value="literature" />
                    <el-option label="艺术设计" value="design" />
                    <el-option label="医学/生物" value="medicine" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>

                <el-form-item label="实习/项目经验">
                  <el-radio-group v-model="analysisForm.experience" class="experience-radio-group">
                    <el-radio :label="0">无实习或项目经验</el-radio>
                    <el-radio :label="1">参与过课程项目</el-radio>
                    <el-radio :label="2">有相关实习经验</el-radio>
                    <el-radio :label="3">多段实习或项目经验</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>

            <!-- 步骤2：技能与兴趣 -->
            <div v-if="currentStep === 2" class="step-content">
              <h2 class="step-title">你的技能与兴趣</h2>
              <p class="step-description">
                选择你擅长的技能和感兴趣的领域，这将帮助我们找到最匹配的职业方向。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="专业技能" required>
                  <el-select
                    v-model="analysisForm.skills"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或添加你擅长的技能"
                    class="full-width"
                  >
                    <el-option-group label="职业证书">
                      <el-option label="英语四/六级" value="cet4_6" />
                      <el-option label="计算机等级证书" value="computer_cert" />
                      <el-option label="普通话证书" value="mandarin_cert" />
                      <el-option label="教师资格证" value="teacher_cert" />
                    </el-option-group>
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
                    placeholder="请选择或添加你感兴趣的领域"
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
                    class="submit-button glow-btn"
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
                <img src="@/assets/career-analysis.svg" alt="职业分析" class="preview-image" />
                <h3>探索适合你的职业方向</h3>
                <p>
                  填写完整的信息将帮助我们精准分析适合你的职业方向。我们的AI会分析你的学习背景、技能特点和兴趣偏好，推荐最匹配的职业选择并提供个性化发展建议。
                </p>

                <div class="preview-features">
                  <div class="preview-feature">
                    <div class="feature-icon">
                      <el-icon><DataAnalysis /></el-icon>
                    </div>
                    <div class="feature-text">
                      <h4>匹配度分析</h4>
                      <p>根据你的背景计算与各职业的匹配度</p>
                    </div>
                  </div>

                  <div class="preview-feature">
                    <div class="feature-icon">
                      <el-icon><Medal /></el-icon>
                    </div>
                    <div class="feature-text">
                      <h4>优势评估</h4>
                      <p>分析你的核心竞争力和优势领域</p>
                    </div>
                  </div>

                  <div class="preview-feature">
                    <div class="feature-icon">
                      <el-icon><List /></el-icon>
                    </div>
                    <div class="feature-text">
                      <h4>发展建议</h4>
                      <p>提供针对性的职业发展和技能提升建议</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <div v-else class="analysis-result">
            <!-- 结果摘要卡片 -->
            <el-card shadow="hover" class="result-card summary-card">
              <template #header>
                <div class="card-header">
                  <span>职业倾向分析</span>
                  <el-tag type="success" effect="dark" size="small">AI分析报告</el-tag>
                </div>
              </template>

              <div class="summary-content">
                <div class="summary-header">
                  <img src="@/assets/career-match.svg" alt="职业匹配" class="summary-icon" />
                  <div class="summary-text">
                    <h3>分析完成！发现3个高匹配职业</h3>
                    <p>
                      基于你的专业背景、技能特长和兴趣偏好，我们的AI分析系统找到了最适合你的职业方向。
                    </p>
                  </div>
                </div>

                <div class="match-stats">
                  <div class="match-stat">
                    <div class="match-title">职业匹配</div>
                    <div
                      class="match-value"
                      :style="{ color: getMatchColor(analysisResult.topCareers[0].matchScore) }"
                    >
                      {{ analysisResult.topCareers[0].matchScore }}%
                    </div>
                    <div class="match-label">最高匹配率</div>
                  </div>
                  <div class="match-stat">
                    <div class="match-title">薪资范围</div>
                    <div class="match-value">{{ analysisResult.topCareers[0].salary }}</div>
                    <div class="match-label">平均月薪</div>
                  </div>
                  <div class="match-stat">
                    <div class="match-title">职业前景</div>
                    <div class="match-value">{{ analysisResult.topCareers[0].growth }}</div>
                    <div class="match-label">增长趋势</div>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 职业推荐卡片 -->
            <el-card shadow="hover" class="result-card careers-card">
              <template #header>
                <div class="card-header">
                  <span>推荐职业方向</span>
                </div>
              </template>

              <div class="careers-container">
                <div
                  v-for="(career, index) in analysisResult.topCareers"
                  :key="index"
                  class="career-card"
                >
                  <div class="career-header">
                    <h3 class="career-title">{{ career.title }}</h3>
                    <div
                      class="match-badge"
                      :style="{ backgroundColor: getMatchColor(career.matchScore) }"
                    >
                      {{ career.matchScore }}%
                    </div>
                  </div>

                  <p class="career-description">{{ career.description }}</p>

                  <div class="career-details">
                    <div class="detail-item">
                      <span class="detail-label">薪资范围</span>
                      <span class="detail-value">{{ career.salary }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">增长趋势</span>
                      <span class="detail-value">{{ career.growth }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">入行门槛</span>
                      <span class="detail-value">{{ career.entryBarrier }}</span>
                    </div>
                  </div>

                  <div class="career-skills">
                    <h4>核心技能要求</h4>
                    <div class="skills-tags">
                      <el-tag
                        v-for="(skill, skillIndex) in career.keySkills"
                        :key="skillIndex"
                        :type="getTagType(skillIndex)"
                        class="skill-tag"
                        size="small"
                      >
                        {{ skill }}
                      </el-tag>
                    </div>
                  </div>

                  <div class="career-advice">
                    <h4>发展建议</h4>
                    <p>{{ career.advice }}</p>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 优势与建议卡片 -->
            <el-card shadow="hover" class="result-card advice-card">
              <template #header>
                <div class="card-header">
                  <span>优势分析与发展建议</span>
                </div>
              </template>

              <div class="advice-content">
                <div class="advice-section">
                  <div class="section-header">
                    <el-icon color="#52c41a" size="24"><Medal /></el-icon>
                    <h3>你的优势</h3>
                  </div>
                  <ul class="strength-list">
                    <li v-for="(strength, index) in analysisResult.strengths" :key="index">
                      {{ strength }}
                    </li>
                  </ul>
                </div>

                <div class="advice-section">
                  <div class="section-header">
                    <el-icon color="#faad14" size="24"><Lightning /></el-icon>
                    <h3>提升空间</h3>
                  </div>
                  <ul class="weakness-list">
                    <li v-for="(weakness, index) in analysisResult.weaknesses" :key="index">
                      {{ weakness }}
                    </li>
                  </ul>
                </div>

                <div class="advice-section">
                  <div class="section-header">
                    <el-icon color="#1677ff" size="24"><Star /></el-icon>
                    <h3>推荐提升的技能</h3>
                  </div>
                  <div class="skill-recommendations">
                    <div
                      v-for="(skill, index) in analysisResult.recommendedSkills"
                      :key="index"
                      class="skill-item"
                    >
                      <el-icon color="#1677ff"><Check /></el-icon>
                      <span>{{ skill }}</span>
                    </div>
                  </div>
                </div>

                <div class="advice-section">
                  <div class="section-header">
                    <el-icon color="#722ed1" size="24"><List /></el-icon>
                    <h3>发展建议</h3>
                  </div>
                  <div class="development-advice">
                    <div
                      v-for="(advice, index) in analysisResult.developmentAdvice"
                      :key="index"
                      class="advice-item"
                    >
                      <div class="advice-number">{{ index + 1 }}</div>
                      <div class="advice-text">{{ advice }}</div>
                    </div>
                  </div>
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
  Connection,
  DataAnalysis,
  Medal,
  List,
  Lightning
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
  experience: 0
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
  { label: '技术研发', value: 'tech_development' },
  { label: '产品设计', value: 'product_design' },
  { label: '数据分析', value: 'data_analysis' },
  { label: '市场营销', value: 'marketing' },
  { label: '用户体验', value: 'user_experience' },
  { label: '人工智能', value: 'artificial_intelligence' },
  { label: '游戏开发', value: 'game_development' },
  { label: '财务金融', value: 'finance' },
  { label: '教育培训', value: 'education' },
  { label: '医疗健康', value: 'healthcare' },
  { label: '艺术创作', value: 'art_creation' },
  { label: '内容创作', value: 'content_creation' }
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
const getMatchColor = (score: number) => {
  if (score >= 90) return '#52c41a'
  if (score >= 75) return '#1890ff'
  if (score >= 60) return '#faad14'
  return '#f5222d'
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

.preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.preview-image {
  width: 200px;
  height: 200px;
  margin-bottom: 24px;
}

.preview-features {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 24px;
}

.preview-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.feature-text {
  text-align: center;
}

.feature-text h4 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 8px 0;
}

.feature-text p {
  color: #606266;
  margin: 0;
}

/* 结果区域 */
.analysis-result {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-card {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
  position: relative;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #1677ff, #00b3ff);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 摘要卡片样式 */
.summary-card::before {
  background: linear-gradient(90deg, #52c41a, #1677ff);
}

.summary-content {
  padding: 8px 0;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.summary-icon {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.summary-text h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 8px 0;
}

.summary-text p {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.match-stats {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0 8px;
  border-top: 1px solid #f0f0f0;
}

.match-stat {
  flex: 1;
  text-align: center;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.match-stat:hover {
  transform: translateY(-4px);
  background-color: #e6f7ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.match-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.match-value {
  font-size: 24px;
  font-weight: bold;
  color: #1677ff;
  margin-bottom: 4px;
}

.match-label {
  font-size: 12px;
  color: #909399;
}

/* 职业卡片样式 */
.careers-card::before {
  background: linear-gradient(90deg, #1677ff, #00b3ff);
}

.careers-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 8px 0;
}

.career-card {
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.career-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #1677ff, #00b3ff);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.career-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.career-card:hover::after {
  transform: scaleX(1);
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.career-title {
  font-size: 18px;
  color: #303133;
  margin: 0;
}

.match-badge {
  padding: 4px 10px;
  border-radius: 16px;
  background-color: #52c41a;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.career-description {
  color: #606266;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.6;
}

.career-details {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 16px;
  gap: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  min-width: 80px;
}

.detail-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.detail-value {
  font-weight: bold;
  color: #303133;
}

.career-skills h4,
.career-advice h4 {
  font-size: 14px;
  color: #909399;
  margin: 0 0 8px 0;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.skill-tag {
  margin-right: 0;
}

.career-advice p {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* 建议卡片样式 */
.advice-card::before {
  background: linear-gradient(90deg, #722ed1, #2f54eb);
}

.advice-content {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.advice-section {
  margin-bottom: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 18px;
  color: #303133;
  margin: 0;
}

.strength-list,
.weakness-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.strength-list li,
.weakness-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 12px;
  color: #606266;
}

.strength-list li::before,
.weakness-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.strength-list li::before {
  background-color: #52c41a;
}

.weakness-list li::before {
  background-color: #faad14;
}

.skill-recommendations {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #f5f7fa;
  border-radius: 16px;
  color: #606266;
  font-size: 14px;
  transition: all 0.3s;
}

.skill-item:hover {
  background-color: #e6f7ff;
  transform: translateY(-2px);
}

.development-advice {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.advice-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.advice-item:hover {
  background-color: #e6f7ff;
  transform: translateY(-2px);
}

.advice-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #722ed1;
  color: white;
  font-weight: bold;
  flex-shrink: 0;
}

.advice-text {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .careers-container {
    grid-template-columns: 1fr;
  }

  .match-stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
