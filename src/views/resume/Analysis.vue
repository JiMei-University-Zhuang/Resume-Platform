<template>
  <div class="resume-analysis">
    <!-- 页面标题和描述 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon><DataAnalysis /></el-icon> 简历匹配分析
        </h1>
        <p class="page-description">
          上传您的简历并选择目标岗位，AI将为您分析匹配度，给出专业优化建议，助您提升竞争力
        </p>
      </div>
    </div>

    <!-- 上传区域 -->
    <el-card class="upload-card" shadow="hover">
      <div class="upload-container">
        <el-row :gutter="30">
          <el-col :xs="24" :md="12">
            <div class="upload-section">
              <h3 class="section-title">
                <el-icon><UploadFilled /></el-icon>
                上传简历
              </h3>
              <el-upload
                class="upload-box"
                drag
                action="#"
                :auto-upload="false"
                :on-change="handleFileChange"
                accept=".pdf,.doc,.docx"
              >
                <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
                <div class="el-upload__text">将简历文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                  <div class="el-upload__tip">
                    <el-icon><InfoFilled /></el-icon>
                    支持 PDF、Word 格式文件，建议文件大小不超过 10MB
                  </div>
                </template>
              </el-upload>
            </div>
          </el-col>
          <el-col :xs="24" :md="12">
            <div class="selection-section">
              <h3 class="section-title">
                <el-icon><Opportunity /></el-icon>
                选择目标岗位
              </h3>
              <div class="job-selection">
                <el-select
                  v-model="selectedJobCategory"
                  placeholder="选择岗位类别"
                  class="w-100 mb-15"
                >
                  <el-option
                    v-for="category in jobCategories"
                    :key="category.value"
                    :label="category.label"
                    :value="category.value"
                  ></el-option>
                </el-select>

                <el-select
                  v-model="selectedJob"
                  placeholder="选择具体岗位"
                  class="w-100 mb-15"
                  :disabled="!selectedJobCategory"
                >
                  <el-option
                    v-for="job in filteredJobs"
                    :key="job.id"
                    :label="job.title"
                    :value="job.id.toString()"
                  ></el-option>
                </el-select>

                <div v-if="selectedJobDetail" class="job-detail">
                  <h4>{{ selectedJobDetail.title }}</h4>
                  <div class="company-name">{{ selectedJobDetail.company }}</div>
                  <div class="job-tags">
                    <el-tag
                      size="small"
                      effect="dark"
                      v-for="skill in selectedJobDetail.requiredSkills"
                      :key="skill"
                      >{{ skill }}</el-tag
                    >
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="action-bar">
          <el-button
            type="primary"
            :icon="TrendCharts"
            size="large"
            @click="startAnalysis"
            :loading="analyzing"
            :disabled="!canAnalyze"
          >
            开始分析匹配度
          </el-button>
          <div class="help-text" v-if="!canAnalyze">
            <el-icon><InfoFilled /></el-icon>
            请先上传简历并选择目标岗位
          </div>
        </div>
      </div>
    </el-card>

    <!-- 分析结果 -->
    <div class="results-section" v-if="analysisResult">
      <h2 class="results-title">
        <el-icon><DataAnalysis /></el-icon> 简历匹配分析结果
        <span class="results-subtitle">详细的岗位匹配评估和个性化优化建议</span>
      </h2>

      <el-row :gutter="24">
        <!-- 左侧：总体匹配度 -->
        <el-col :xs="24" :lg="8">
          <el-card class="analysis-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon><TrendCharts /></el-icon>
                  <span>岗位匹配度</span>
                </div>
                <el-tag :type="getScoreType(analysisResult.matchScore)" effect="dark">
                  {{ analysisResult.matchScore }}%
                </el-tag>
              </div>
            </template>
            <div class="score-details">
              <div class="overall-score-chart">
                <el-progress
                  type="dashboard"
                  :percentage="analysisResult.matchScore"
                  :color="getProgressColor(analysisResult.matchScore)"
                  :stroke-width="15"
                  status="success"
                  :width="180"
                ></el-progress>
                <p class="match-conclusion">{{ getMatchConclusion(analysisResult.matchScore) }}</p>
              </div>
              <div class="score-breakdown">
                <h4 class="breakdown-title">匹配度细分</h4>
                <div
                  class="score-item"
                  v-for="(score, key) in analysisResult.scoreDetails"
                  :key="key"
                >
                  <div class="score-header">
                    <span class="score-label">{{ score.label }}</span>
                    <span class="score-value">{{ score.value }}%</span>
                  </div>
                  <el-progress
                    :percentage="score.value"
                    :color="getProgressColor(score.value)"
                    :stroke-width="10"
                  ></el-progress>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 中间：岗位要求对比 -->
        <el-col :xs="24" :lg="8">
          <el-card class="analysis-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon><Connection /></el-icon>
                  <span>岗位要求对比</span>
                </div>
                <el-tooltip content="绿色表示匹配，黄色表示部分匹配，红色表示缺失" placement="top">
                  <el-icon><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
            <div class="requirement-comparison">
              <el-tabs type="border-card">
                <el-tab-pane label="技能要求">
                  <div class="requirement-list">
                    <div
                      v-for="(req, index) in analysisResult.requirementComparison.skills"
                      :key="index"
                      class="requirement-item"
                      :class="getRequirementClass(req.status)"
                    >
                      <el-icon>
                        <Check v-if="req.status === 'match'" />
                        <Warning v-else-if="req.status === 'partial'" />
                        <CircleCloseFilled v-else />
                      </el-icon>
                      <span>{{ req.name }}</span>
                      <el-tag size="small" :type="getRequirementTagType(req.status) as any">
                        {{ getRequirementLabel(req.status) }}
                      </el-tag>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="教育背景">
                  <div class="requirement-list">
                    <div
                      v-for="(req, index) in analysisResult.requirementComparison.education"
                      :key="index"
                      class="requirement-item"
                      :class="getRequirementClass(req.status)"
                    >
                      <el-icon>
                        <Check v-if="req.status === 'match'" />
                        <Warning v-else-if="req.status === 'partial'" />
                        <CircleCloseFilled v-else />
                      </el-icon>
                      <span>{{ req.name }}</span>
                      <el-tag size="small" :type="getRequirementTagType(req.status) as any">
                        {{ getRequirementLabel(req.status) }}
                      </el-tag>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="工作经验">
                  <div class="requirement-list">
                    <div
                      v-for="(req, index) in analysisResult.requirementComparison.experience"
                      :key="index"
                      class="requirement-item"
                      :class="getRequirementClass(req.status)"
                    >
                      <el-icon>
                        <Check v-if="req.status === 'match'" />
                        <Warning v-else-if="req.status === 'partial'" />
                        <CircleCloseFilled v-else />
                      </el-icon>
                      <span>{{ req.name }}</span>
                      <el-tag size="small" :type="getRequirementTagType(req.status) as any">
                        {{ getRequirementLabel(req.status) }}
                      </el-tag>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：针对性优化建议 -->
        <el-col :xs="24" :lg="8">
          <el-card class="analysis-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="header-left">
                  <el-icon><Star /></el-icon>
                  <span>针对性优化建议</span>
                </div>
                <el-button type="primary" text @click="applyAllSuggestions">
                  <el-icon><Check /></el-icon> 一键应用建议
                </el-button>
              </div>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="(suggestion, index) in analysisResult.suggestions"
                :key="index"
                :type="suggestion.type as any"
                :color="getSuggestionColor(suggestion.priority)"
                :size="suggestion.priority === 'high' ? 'large' : 'normal'"
                :hollow="suggestion.priority !== 'high'"
              >
                <div class="suggestion-item">
                  <h4>{{ suggestion.title }}</h4>
                  <p>{{ suggestion.content }}</p>
                  <el-button size="small" type="primary" @click="applySuggestion(suggestion)">
                    <el-icon><ArrowUp /></el-icon> 应用建议
                  </el-button>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- AI 建议对话框 -->
    <el-dialog v-model="aiDialogVisible" title="针对岗位的优化建议" width="60%">
      <div class="ai-suggestions">
        <div class="before-after-comparison">
          <div class="original-content">
            <div class="content-header">
              <el-icon><Document /></el-icon>
              <h4>当前简历内容</h4>
            </div>
            <div class="content-body">
              <p>{{ currentSuggestion?.original }}</p>
            </div>
          </div>

          <div class="arrow-indicator">
            <el-icon :size="24"><ArrowDown /></el-icon>
          </div>

          <div class="suggested-content">
            <div class="content-header">
              <el-icon><Star /></el-icon>
              <h4>针对岗位的优化建议</h4>
            </div>
            <div class="content-body highlight">
              <p>{{ currentSuggestion?.suggested }}</p>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="aiDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmApplySuggestion">
            <el-icon><Check /></el-icon> 应用建议
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  UploadFilled,
  InfoFilled,
  Check,
  Warning,
  CircleCloseFilled,
  Connection,
  Opportunity,
  Star,
  ArrowUp,
  ArrowDown,
  TrendCharts,
  Document,
  DataAnalysis
} from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles } from 'element-plus'

// 类型定义
interface RequirementItem {
  name: string
  status: 'match' | 'partial' | 'missing'
}

interface RequirementComparison {
  skills: RequirementItem[]
  education: RequirementItem[]
  experience: RequirementItem[]
}

interface Suggestion {
  type: string
  priority: string
  title: string
  content: string
  original?: string
  suggested?: string
}

interface AnalysisResult {
  matchScore: number
  scoreDetails: Record<string, { label: string; value: number }>
  requirementComparison: RequirementComparison
  suggestions: Suggestion[]
}

// Refs
const analyzing = ref(false)
const analysisResult = ref<AnalysisResult | null>(null)
const aiDialogVisible = ref(false)
const currentSuggestion = ref<Suggestion | null>(null)
const selectedJobCategory = ref('')
const selectedJob = ref<string>('')
const uploadedFile = ref<File | null>(null)

// 岗位数据
const jobCategories = [
  { label: '技术开发', value: 'tech' },
  { label: '设计创意', value: 'design' },
  { label: '产品运营', value: 'product' },
  { label: '市场营销', value: 'marketing' },
  { label: '人力资源', value: 'hr' }
]

const jobList = [
  {
    id: 1,
    title: '前端开发工程师',
    company: '腾讯科技',
    category: 'tech',
    requiredSkills: ['JavaScript', 'Vue.js', 'React', 'HTML5', 'CSS3', 'Webpack']
  },
  {
    id: 2,
    title: '后端开发工程师',
    company: '阿里巴巴',
    category: 'tech',
    requiredSkills: ['Java', 'Spring Boot', 'MySQL', 'Redis', '微服务']
  },
  {
    id: 3,
    title: 'UI 设计师',
    company: '字节跳动',
    category: 'design',
    requiredSkills: ['Figma', 'Sketch', 'Adobe XD', '视觉设计', '用户界面设计']
  },
  {
    id: 4,
    title: '产品经理',
    company: '百度',
    category: 'product',
    requiredSkills: ['需求分析', '产品规划', '原型设计', '用户研究', '数据分析']
  },
  {
    id: 5,
    title: '市场专员',
    company: '京东',
    category: 'marketing',
    requiredSkills: ['市场策划', '营销推广', '内容创作', '数据分析', '社媒运营']
  }
]

// Computed
const filteredJobs = computed(() => {
  if (!selectedJobCategory.value) return []
  return jobList.filter(job => job.category === selectedJobCategory.value)
})

const selectedJobDetail = computed(() => {
  if (!selectedJob.value) return null
  return jobList.find(job => job.id.toString() === selectedJob.value) || null
})

const canAnalyze = computed(() => {
  return uploadedFile.value && selectedJob.value
})

// Methods
const handleFileChange = (uploadFile: UploadFile, _uploadFiles: UploadFiles) => {
  if (uploadFile.raw) {
    uploadedFile.value = uploadFile.raw
  }
}

const startAnalysis = async () => {
  if (!canAnalyze.value) {
    ElMessage.warning('请先上传简历并选择目标岗位')
    return
  }

  analyzing.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 根据选择的岗位生成模拟匹配分析结果
    const job = selectedJobDetail.value

    if (job) {
      // 生成模拟分析结果数据
      analysisResult.value = {
        matchScore: Math.floor(Math.random() * 30) + 60, // 生成60-90之间的随机值
        scoreDetails: {
          skills: { label: '技能匹配度', value: Math.floor(Math.random() * 40) + 60 },
          education: { label: '教育背景匹配度', value: Math.floor(Math.random() * 30) + 70 },
          experience: { label: '工作经验匹配度', value: Math.floor(Math.random() * 35) + 65 }
        },
        requirementComparison: {
          skills: job.requiredSkills.map(skill => {
            const random = Math.random()
            const status = random > 0.6 ? 'match' : random > 0.3 ? 'partial' : 'missing'
            return { name: skill, status }
          }),
          education: [
            { name: '本科及以上学历', status: Math.random() > 0.5 ? 'match' : 'partial' },
            { name: '计算机相关专业', status: Math.random() > 0.7 ? 'match' : 'missing' }
          ],
          experience: [
            { name: '3年以上相关工作经验', status: Math.random() > 0.6 ? 'match' : 'partial' },
            { name: '有大型项目经验', status: Math.random() > 0.5 ? 'match' : 'missing' }
          ]
        },
        suggestions: [
          {
            type: 'warning',
            priority: 'high',
            title: `强化 ${job.requiredSkills[0]} 技能描述`,
            content: `岗位特别看重 ${job.requiredSkills[0]} 能力，建议在简历中突出相关项目经验`,
            original: `熟悉 ${job.requiredSkills[0]}`,
            suggested: `精通 ${job.requiredSkills[0]}，曾使用${job.requiredSkills[0]}开发过企业级应用，提升系统性能30%`
          },
          {
            type: 'info',
            priority: 'medium',
            title: '添加与岗位相关的关键词',
            content: `建议在简历中增加 ${job.requiredSkills.slice(1, 3).join('、')} 等关键词以提高匹配度`,
            original: '熟悉前端开发技术',
            suggested: `熟悉前端开发技术，包括 ${job.requiredSkills.join('、')} 等核心技能`
          }
        ]
      }
    }
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}

const getScoreType = (score: number) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getProgressColor = (value: number) => {
  if (value >= 80) return '#67C23A'
  if (value >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getMatchConclusion = (score: number) => {
  if (score >= 80) return '非常适合，建议立即投递'
  if (score >= 60) return '基本匹配，有改进空间'
  return '匹配度低，建议提升相关能力'
}

const getSuggestionColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return '#F56C6C'
    case 'medium':
      return '#E6A23C'
    default:
      return '#909399'
  }
}

const getRequirementClass = (status: string) => {
  return `requirement-${status}`
}

const getRequirementTagType = (
  status: string
): 'success' | 'warning' | 'danger' | 'info' | 'primary' => {
  switch (status) {
    case 'match':
      return 'success'
    case 'partial':
      return 'warning'
    default:
      return 'danger'
  }
}

const getRequirementLabel = (status: string) => {
  switch (status) {
    case 'match':
      return '已具备'
    case 'partial':
      return '部分具备'
    default:
      return '缺失'
  }
}

const applySuggestion = (suggestion: Suggestion) => {
  currentSuggestion.value = suggestion
  aiDialogVisible.value = true
}

const confirmApplySuggestion = () => {
  ElMessage.success('已应用优化建议，点击导出可获取优化后的简历')
  aiDialogVisible.value = false
}

const applyAllSuggestions = () => {
  ElMessage.success('已应用全部优化建议，点击导出可获取优化后的简历')
}
</script>

<style scoped>
.resume-analysis {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 24px;
  background: linear-gradient(to right, #1a365d, #3182ce);
  border-radius: 8px;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 28px;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title .el-icon {
  font-size: 28px;
}

.page-description {
  font-size: 16px;
  margin: 8px 0 0 0;
  opacity: 0.9;
  max-width: 700px;
}

/* 上传卡片区域 */
.upload-card {
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.upload-container {
  padding: 10px;
}

.section-title {
  font-size: 18px;
  margin-bottom: 20px;
  color: #1a365d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-section,
.selection-section {
  padding: 10px;
  height: 100%;
}

.upload-box {
  width: 100%;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #3182ce;
}

.el-upload__tip {
  color: #718096;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  font-size: 13px;
}

.w-100 {
  width: 100%;
}

.mb-15 {
  margin-bottom: 15px;
}

.job-detail {
  margin-top: 20px;
  padding: 15px;
  background: rgba(49, 130, 206, 0.05);
  border-left: 3px solid #3182ce;
  border-radius: 4px;
}

.job-detail h4 {
  margin: 0 0 5px 0;
  color: #2d3748;
  font-size: 16px;
}

.company-name {
  color: #718096;
  margin-bottom: 10px;
  font-size: 14px;
}

.job-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

.action-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  flex-direction: column;
  gap: 12px;
}

.help-text {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #718096;
  font-size: 14px;
}

/* 结果区域样式 */
.results-section {
  margin-top: 40px;
}

.results-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
  color: #2d3748;
  font-size: 24px;
  position: relative;
}

.results-subtitle {
  font-size: 16px;
  font-weight: normal;
  color: #718096;
  margin-left: 10px;
}

.analysis-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  margin-bottom: 20px;
}

.analysis-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #2d3748;
}

.overall-score-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0 25px;
}

.match-conclusion {
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
  color: #2d3748;
  font-size: 16px;
}

.score-breakdown {
  padding: 0 10px;
}

.breakdown-title {
  margin: 0 0 15px 0;
  color: #4a5568;
  font-size: 16px;
  font-weight: 600;
  border-left: 3px solid #3182ce;
  padding-left: 10px;
}

.score-details {
  padding: 10px 0;
}

.score-item {
  margin-bottom: 20px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.score-label {
  color: #4a5568;
  font-size: 14px;
}

.score-value {
  font-weight: bold;
  color: #2d3748;
}

.requirement-comparison {
  height: calc(100% - 60px);
}

.requirement-list {
  padding: 10px 0;
  max-height: 350px;
  overflow-y: auto;
}

.requirement-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  background-color: white;
}

.requirement-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.requirement-item .el-icon {
  margin-right: 10px;
  font-size: 18px;
}

.requirement-item span {
  flex: 1;
  color: #2d3748;
}

.requirement-match {
  border-left: 4px solid #48bb78;
}

.requirement-partial {
  border-left: 4px solid #ed8936;
}

.requirement-missing {
  border-left: 4px solid #f56565;
}

.suggestion-item {
  padding: 5px 0;
}

.suggestion-item h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
}

.suggestion-item p {
  margin: 0 0 12px 0;
  color: #4a5568;
  line-height: 1.5;
}

/* 对话框样式 */
.ai-suggestions {
  padding: 10px;
}

.before-after-comparison {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.content-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #2d3748;
}

.content-header h4 {
  margin: 0;
  font-size: 16px;
}

.content-body {
  background-color: #f8fafc;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.content-body p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.arrow-indicator {
  display: flex;
  justify-content: center;
  color: #3182ce;
}

.highlight {
  background-color: #ebf8ff;
  border-color: #bee3f8;
  border-left: 3px solid #3182ce;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 22px;
  }

  .page-description {
    font-size: 14px;
  }

  .action-bar {
    margin-top: 20px;
  }

  .section-title {
    font-size: 16px;
  }
}
</style>
