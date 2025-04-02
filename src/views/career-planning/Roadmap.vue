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

          <el-tabs v-model="activeTab" class="roadmap-tabs">
            <el-tab-pane name="position" label="职位信息">
              <el-form :model="roadmapForm" label-position="top">
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
                  <el-input
                    v-model="roadmapForm.targetPosition"
                    placeholder="例如：技术总监"
                    clearable
                  >
                    <template #prefix>
                      <el-icon><Aim /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <el-divider content-position="center">职业信息</el-divider>

                <el-row :gutter="12">
                  <el-col :span="12">
                    <el-form-item label="工作经验" required>
                      <el-input-number
                        v-model="roadmapForm.yearsOfExperience"
                        :min="0"
                        :max="30"
                        :step="0.5"
                        :precision="1"
                        style="width: 100%"
                        controls-position="right"
                      />
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
              </el-form>
            </el-tab-pane>

            <el-tab-pane name="skills" label="技能与兴趣">
              <el-form :model="roadmapForm" label-position="top">
                <el-form-item label="技能特长" required>
                  <el-select
                    v-model="roadmapForm.skills"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    placeholder="请选择或输入您的技能"
                    style="width: 100%"
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

                <el-form-item label="兴趣方向">
                  <div class="interest-group">
                    <div
                      v-for="(interest, index) in interestOptions"
                      :key="index"
                      class="interest-item"
                      :class="{ selected: roadmapForm.interests.includes(interest.value) }"
                      @click="toggleInterest(interest.value)"
                    >
                      <el-icon><component :is="interest.icon" /></el-icon>
                      <span>{{ interest.label }}</span>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane name="industry" label="行业偏好">
              <el-form :model="roadmapForm" label-position="top">
                <el-form-item label="首选行业" required>
                  <div class="industry-selector">
                    <div
                      v-for="(industry, index) in industryOptions"
                      :key="index"
                      class="industry-item"
                      :class="{ active: roadmapForm.preferredIndustry === industry.value }"
                      @click="selectIndustry(industry.value)"
                    >
                      <div class="industry-icon">
                        <el-icon><component :is="industry.icon" /></el-icon>
                      </div>
                      <div class="industry-name">{{ industry.label }}</div>
                    </div>
                  </div>
                </el-form-item>

                <el-divider content-position="center">目标要求</el-divider>

                <el-form-item label="期望达成时间">
                  <el-slider
                    v-model="expectedYears"
                    :min="1"
                    :max="15"
                    :step="1"
                    show-stops
                    :format-tooltip="formatYears"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>

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

            <div class="roadmap-info">
              <div class="info-item">
                <div class="info-label">当前职位</div>
                <div class="info-value">{{ roadmapResult.currentLevel }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">目标职位</div>
                <div class="info-value highlight">{{ roadmapResult.targetPosition }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">预计用时</div>
                <div class="info-value">约 {{ roadmapResult.timelineYears }} 年</div>
              </div>
              <div class="info-item">
                <div class="info-label">阶段数</div>
                <div class="info-value">{{ roadmapResult.milestones.length }} 个阶段</div>
              </div>
            </div>

            <el-divider />

            <div class="roadmap-actions">
              <el-button type="success" @click="saveToPDF" class="action-button">
                <el-icon><Download /></el-icon>
                导出PDF
              </el-button>
              <el-button type="primary" @click="showShareDialog = true" class="action-button">
                <el-icon><Share /></el-icon>
                分享
              </el-button>
              <el-button @click="printRoadmap" class="action-button">
                <el-icon><Printer /></el-icon>
                打印
              </el-button>
            </div>
          </el-card>

          <el-card class="roadmap-highlight-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>关键任务提醒</span>
              </div>
            </template>

            <div class="tasks-reminder">
              <div
                v-for="(milestone, index) in roadmapResult.milestones"
                :key="index"
                class="task-item"
              >
                <div class="task-stage">阶段 {{ index + 1 }}</div>
                <div class="task-highlight">{{ getHighlightTask(milestone) }}</div>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>

      <!-- 右侧：路线图展示 -->
      <el-col :xs="24" :md="16" class="main-container">
        <div v-if="!roadmapResult" class="placeholder-container">
          <div class="placeholder-content">
            <el-empty description="填写左侧表单，生成您的个性化职业发展路线图">
              <template #image>
                <img
                  src="https://cdn.jsdelivr.net/gh/amariliscamargo/imgs@main/roadmap-placeholder.svg"
                  alt="路线图"
                  class="placeholder-image"
                />
              </template>
              <el-button type="primary" @click="activeTab = 'position'">开始规划</el-button>
            </el-empty>
          </div>
        </div>

        <div v-else class="roadmap-container" ref="roadmapContainerRef">
          <!-- 顶部控制栏 -->
          <div class="roadmap-controls">
            <div class="zoom-controls">
              <el-button-group>
                <el-button @click="zoomOut" :disabled="zoomLevel <= 0.5">
                  <el-icon><ZoomOut /></el-icon>
                </el-button>
                <el-button @click="resetZoom">
                  <el-icon><FullScreen /></el-icon>
                </el-button>
                <el-button @click="zoomIn" :disabled="zoomLevel >= 1.5">
                  <el-icon><ZoomIn /></el-icon>
                </el-button>
              </el-button-group>
            </div>

            <div class="view-controls">
              <el-radio-group v-model="viewMode" size="small">
                <el-radio-button label="timeline">时间线</el-radio-button>
                <el-radio-button label="skills">技能树</el-radio-button>
                <el-radio-button label="comparison">对比图</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 路线图内容 -->
          <div class="roadmap-content" :style="{ transform: `scale(${zoomLevel})` }">
            <!-- 时间线视图 -->
            <div v-if="viewMode === 'timeline'" class="timeline-view">
              <div class="timeline-header">
                <div class="timeline-start">
                  <div class="timeline-dot start"></div>
                  <div class="timeline-label">现在</div>
                </div>
                <div class="timeline-end">
                  <div class="timeline-dot end"></div>
                  <div class="timeline-label">{{ roadmapResult.timelineYears }} 年后</div>
                </div>
              </div>

              <el-timeline class="custom-timeline">
                <el-timeline-item
                  v-for="(milestone, index) in roadmapResult.milestones"
                  :key="index"
                  :type="getTimelineItemType(milestone.stage)"
                  :color="getTimelineItemColor(milestone.stage)"
                  :size="milestone.stage === 1 ? 'large' : 'normal'"
                  :hollow="milestone.stage === roadmapResult.milestones.length"
                  placement="top"
                >
                  <el-card
                    class="milestone-card"
                    shadow="hover"
                    :class="{ 'current-stage': milestone.stage === 1 }"
                  >
                    <template #header>
                      <div class="milestone-header">
                        <div class="milestone-title">
                          <span class="milestone-badge">{{ index + 1 }}</span>
                          {{ milestone.title }}
                        </div>
                        <div class="milestone-duration">{{ milestone.duration }}</div>
                      </div>
                    </template>

                    <div class="milestone-content">
                      <el-collapse>
                        <el-collapse-item title="关键任务" name="tasks">
                          <ul class="tasks-list">
                            <li v-for="(task, taskIndex) in milestone.tasks" :key="taskIndex">
                              {{ task }}
                            </li>
                          </ul>
                        </el-collapse-item>

                        <el-collapse-item title="需掌握的技能" name="skills">
                          <div class="skills-grid">
                            <div
                              v-for="(skill, skillIndex) in milestone.skillsToAcquire"
                              :key="skillIndex"
                              class="skill-item"
                            >
                              <el-tag :type="getTagType(skillIndex)" class="skill-tag">
                                {{ skill }}
                              </el-tag>
                              <div class="skill-resources">
                                <el-tooltip content="查看学习资源">
                                  <el-button
                                    type="primary"
                                    link
                                    size="small"
                                    @click="showSkillResources(skill)"
                                  >
                                    <el-icon><Reading /></el-icon>
                                  </el-button>
                                </el-tooltip>
                              </div>
                            </div>
                          </div>
                        </el-collapse-item>

                        <el-collapse-item title="阶段建议" name="advice">
                          <div class="stage-advice">
                            <p>{{ getStageAdvice(index) }}</p>
                            <div class="stage-metrics">
                              <div class="metric">
                                <span class="metric-label">难度</span>
                                <el-rate
                                  :model-value="getStageDifficulty(index)"
                                  disabled
                                  show-score
                                  score-template="{value}"
                                />
                              </div>
                              <div class="metric">
                                <span class="metric-label">重要性</span>
                                <el-progress
                                  :percentage="getStageImportance(index)"
                                  :color="getImportanceColor(getStageImportance(index))"
                                />
                              </div>
                            </div>
                          </div>
                        </el-collapse-item>
                      </el-collapse>

                      <div class="milestone-actions">
                        <el-button type="primary" text @click="addNoteToStage(index)">
                          <el-icon><EditPen /></el-icon>
                          添加笔记
                        </el-button>
                        <el-button
                          type="success"
                          text
                          @click="markAsCompleted(index)"
                          v-if="index === 0 && !isStageCompleted(index)"
                        >
                          <el-icon><Check /></el-icon>
                          标记完成
                        </el-button>
                        <el-button
                          type="warning"
                          text
                          @click="markAsIncomplete(index)"
                          v-if="isStageCompleted(index)"
                        >
                          <el-icon><Close /></el-icon>
                          取消完成
                        </el-button>
                      </div>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>

            <!-- 技能树视图 -->
            <div v-else-if="viewMode === 'skills'" class="skills-view">
              <div class="skills-map" ref="skillsMapRef"></div>
              <div class="skills-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #67c23a"></div>
                  <span>核心技能</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #409eff"></div>
                  <span>重要技能</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background-color: #909399"></div>
                  <span>辅助技能</span>
                </div>
              </div>
            </div>

            <!-- 对比图视图 -->
            <div v-else-if="viewMode === 'comparison'" class="comparison-view">
              <div class="comparison-header">
                <div class="start-position">
                  <h3>{{ roadmapResult.currentLevel }}</h3>
                  <div class="position-details">当前职位</div>
                </div>
                <div class="comparison-arrow">
                  <div class="arrow-line"></div>
                  <el-icon><ArrowRight /></el-icon>
                </div>
                <div class="target-position">
                  <h3>{{ roadmapResult.targetPosition }}</h3>
                  <div class="position-details">目标职位</div>
                </div>
              </div>

              <div class="comparison-content">
                <div class="comparison-chart" ref="comparisonChartRef"></div>

                <div class="gap-analysis">
                  <h3>差距分析</h3>
                  <ul class="gap-list">
                    <li v-for="(gap, index) in getGapAnalysis()" :key="index">
                      <el-icon><Warning /></el-icon>
                      {{ gap }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 发展建议 -->
          <el-card class="recommendations-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Star /></el-icon>
                <span>专家建议</span>
              </div>
            </template>

            <div class="recommendations-content">
              <el-carousel
                height="120px"
                indicator-position="outside"
                :autoplay="true"
                :interval="6000"
              >
                <el-carousel-item
                  v-for="(recommendation, index) in roadmapResult.recommendations"
                  :key="index"
                >
                  <div class="recommendation-item">
                    <el-icon><Star /></el-icon>
                    <p>{{ recommendation }}</p>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-card>

          <div class="roadmap-actions">
            <el-button type="primary" @click="goToCareerAnalysis">
              <el-icon><DataAnalysis /></el-icon>
              职业分析
            </el-button>
            <el-button type="success" @click="goToRecommendation">
              <el-icon><View /></el-icon>
              职业推荐
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 技能资源弹窗 -->
    <el-dialog v-model="showResourcesDialog" title="技能学习资源" width="600px">
      <div class="resources-dialog">
        <h3>{{ selectedSkill }} 学习资源</h3>

        <div class="resources-list">
          <div v-for="(resource, index) in getSkillResources()" :key="index" class="resource-item">
            <div class="resource-icon">
              <el-icon
                ><component
                  :is="
                    resource.type === 'video'
                      ? 'VideoCamera'
                      : resource.type === 'course'
                        ? 'Reading'
                        : 'Document'
                  "
              /></el-icon>
            </div>
            <div class="resource-info">
              <div class="resource-title">{{ resource.title }}</div>
              <div class="resource-description">{{ resource.description }}</div>
            </div>
            <div class="resource-actions">
              <el-button type="primary" size="small" @click="openResource(resource.url)">
                查看
                <el-icon><Link /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 添加笔记弹窗 -->
    <el-dialog v-model="showNoteDialog" title="阶段笔记" width="500px">
      <div class="note-dialog">
        <p class="note-stage-info">{{ getNoteStageInfo() }}</p>

        <el-form>
          <el-form-item>
            <el-input
              v-model="stageNote"
              type="textarea"
              :rows="5"
              placeholder="记录您对这个阶段的想法、目标或提醒..."
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showNoteDialog = false">取消</el-button>
          <el-button type="primary" @click="saveNote">保存笔记</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分享弹窗 -->
    <el-dialog v-model="showShareDialog" title="分享路线图" width="400px">
      <div class="share-dialog">
        <div class="share-options">
          <div class="share-option" @click="shareViaEmail">
            <el-icon><Message /></el-icon>
            <span>通过邮件分享</span>
          </div>
          <div class="share-option" @click="copyShareLink">
            <el-icon><Link /></el-icon>
            <span>复制链接</span>
          </div>
          <div class="share-option" @click="shareWithQRCode">
            <el-icon><PictureFilled /></el-icon>
            <span>生成二维码</span>
          </div>
        </div>

        <div v-if="showQRCode" class="qrcode-container">
          <img
            src="https://cdn.jsdelivr.net/gh/amariliscamargo/imgs@main/qrcode-placeholder.png"
            alt="QR Code"
            class="qrcode-image"
          />
          <el-button size="small" type="primary" @click="downloadQRCode">
            <el-icon><Download /></el-icon>
            下载二维码
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type {
  CareerRoadmapForm,
  CareerRoadmapResult,
  CareerSkill,
  CareerMilestone
} from '@/types/career'
import { getCareerSkills } from '@/api/career'
import { getProfessionRoadmap } from '@/api/ai'
import {
  Connection,
  QuestionFilled,
  User,
  Aim,
  RefreshLeft,
  Back,
  Download,
  Share,
  Printer,
  ZoomOut,
  ZoomIn,
  FullScreen,
  ArrowRight,
  Reading,
  Check,
  Close,
  EditPen,
  Star,
  DataAnalysis,
  View,
  Link,
  Message,
  PictureFilled,
  Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const generating = ref(false)
const allSkills = ref<CareerSkill[]>([])
const activeTab = ref('position')
const roadmapContainerRef = ref<HTMLElement | null>(null)
const skillsMapRef = ref<HTMLElement | null>(null)
const comparisonChartRef = ref<HTMLElement | null>(null)
let skillsChart: echarts.ECharts | null = null
let comparisonChart: echarts.ECharts | null = null

// 视图控制
const viewMode = ref('timeline')
const zoomLevel = ref(1)
const expectedYears = ref(5)
const completedStages = ref<number[]>([])
const stageNotes = ref<Record<number, string>>({})

// 弹窗控制
const showResourcesDialog = ref(false)
const showNoteDialog = ref(false)
const showShareDialog = ref(false)
const showQRCode = ref(false)
const selectedSkill = ref('')
const selectedStageIndex = ref(0)
const stageNote = ref('')

// 技能分类
const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const managementSkills = computed(() =>
  allSkills.value.filter(skill => skill.category === 'management')
)
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

// 兴趣选项
const interestOptions = [
  { label: '技术研究', value: 'tech_research', icon: 'Monitor' },
  { label: '产品设计', value: 'product_design', icon: 'Brush' },
  { label: '团队管理', value: 'team_management', icon: 'ChatLineRound' },
  { label: '项目管理', value: 'project_management', icon: 'SetUp' },
  { label: '业务分析', value: 'business_analysis', icon: 'DataAnalysis' },
  { label: '战略规划', value: 'strategic_planning', icon: 'Opportunity' },
  { label: '数据科学', value: 'data_science', icon: 'Monitor' },
  { label: '教学培训', value: 'teaching', icon: 'Reading' }
]

// 行业选项
const industryOptions = [
  { label: '互联网/科技', value: 'tech', icon: 'Monitor' },
  { label: '金融/银行', value: 'finance', icon: 'CreditCard' },
  { label: '医疗/健康', value: 'healthcare', icon: 'First' },
  { label: '教育', value: 'education', icon: 'School' },
  { label: '制造业', value: 'manufacturing', icon: 'SetUp' },
  { label: '零售/电商', value: 'retail', icon: 'ShoppingCart' },
  { label: '咨询/服务', value: 'consulting', icon: 'Collection' },
  { label: '政府/非盈利', value: 'government', icon: 'OfficeBuilding' }
]

// 表单数据
const roadmapForm = reactive<CareerRoadmapForm>({
  currentPosition: '',
  targetPosition: '',
  yearsOfExperience: 1,
  skills: [],
  interests: [],
  education: '',
  preferredIndustry: ''
})

// 路线图结果
const roadmapResult = ref<CareerRoadmapResult | null>(null)

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
  if (
    !roadmapForm.currentPosition ||
    !roadmapForm.targetPosition ||
    !roadmapForm.education ||
    !roadmapForm.preferredIndustry
  ) {
    ElMessage.warning('请填写必要的信息')
    return
  }

  generating.value = true
  try {
    const response = await getProfessionRoadmap(roadmapForm)
    roadmapResult.value = response.data

    // 重置视图状态
    viewMode.value = 'timeline'
    zoomLevel.value = 1
    completedStages.value = []
    stageNotes.value = {}

    ElMessage.success('路线图生成成功')

    // 初始化图表
    nextTick(() => {
      if (viewMode.value === 'skills') {
        initializeSkillsChart()
      } else if (viewMode.value === 'comparison') {
        initializeComparisonChart()
      }
    })
  } catch (error) {
    ElMessage.error('生成失败，请重试')
    console.error(error)
  } finally {
    generating.value = false
  }
}

// 重置表单
const resetForm = () => {
  roadmapForm.currentPosition = ''
  roadmapForm.targetPosition = ''
  roadmapForm.yearsOfExperience = 1
  roadmapForm.skills = []
  roadmapForm.interests = []
  roadmapForm.education = ''
  roadmapForm.preferredIndustry = ''
  roadmapResult.value = null
}

// 重新开始规划
const restartPlanning = () => {
  roadmapResult.value = null
  // 保留部分已填写的信息
  const currentPosition = roadmapForm.currentPosition
  const education = roadmapForm.education
  resetForm()
  roadmapForm.currentPosition = currentPosition
  roadmapForm.education = education
  activeTab.value = 'position'
}

// 切换兴趣
const toggleInterest = (value: string) => {
  const index = roadmapForm.interests.indexOf(value)
  if (index === -1) {
    roadmapForm.interests.push(value)
  } else {
    roadmapForm.interests.splice(index, 1)
  }
}

// 选择行业
const selectIndustry = (value: string) => {
  roadmapForm.preferredIndustry = value
}

// 格式化年份
const formatYears = (value: number) => {
  return `${value} 年`
}

// 时间线样式
const getTimelineItemType = (stage: number) => {
  const types = ['primary', 'success', 'warning', 'danger'] as const
  return types[(stage - 1) % types.length]
}

const getTimelineItemColor = (stage: number) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
  return colors[(stage - 1) % colors.length]
}

// 技能标签类型
const getTagType = (
  index: number
): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = [
    'success',
    'primary',
    'info',
    'warning',
    'danger'
  ]
  return types[index % types.length]
}

// 获取重要程度颜色
const getImportanceColor = (value: number) => {
  if (value >= 85) return '#67C23A'
  if (value >= 70) return '#409EFF'
  if (value >= 50) return '#E6A23C'
  return '#F56C6C'
}

// 获取阶段亮点任务
const getHighlightTask = (milestone: CareerMilestone) => {
  if (!milestone.tasks.length) return '无关键任务'
  return milestone.tasks[0]
}

// 获取阶段建议
const getStageAdvice = (index: number) => {
  const adviceMap = [
    '这是职业发展的起点阶段，专注于打好基础和积累核心技能是关键。参与实际项目，向资深同事学习，建立良好的职业习惯。',
    '在这个成长阶段，应当开始承担更多责任，提升专业深度，同时拓展技能广度。寻找导师指导，建立行业人脉网络。',
    '作为职业发展的关键阶段，需要在专业领域建立自己的影响力和声誉。参与具有挑战性的项目，培养领导力和团队协作能力。',
    '这是向管理岗位过渡的重要阶段，需要平衡技术专长与管理技能，提升战略思维和决策能力，为更高级别的职位做准备。'
  ]

  return adviceMap[index % adviceMap.length]
}

// 获取阶段难度
const getStageDifficulty = (index: number) => {
  const difficulties = [3, 3.5, 4, 4.5, 5]
  return difficulties[index % difficulties.length]
}

// 获取阶段重要性
const getStageImportance = (index: number) => {
  if (index === 0) return 90 // 第一阶段非常重要
  if (index === roadmapResult.value!.milestones.length - 1) return 85 // 最后阶段也很重要

  // 中间阶段根据位置递减重要性
  return 80 - (index - 1) * 5
}

// 阶段完成状态管理
const isStageCompleted = (index: number) => {
  return completedStages.value.includes(index)
}

const markAsCompleted = (index: number) => {
  if (!completedStages.value.includes(index)) {
    completedStages.value.push(index)
    ElMessage.success('已标记为完成')
  }
}

const markAsIncomplete = (index: number) => {
  const stageIndex = completedStages.value.indexOf(index)
  if (stageIndex !== -1) {
    completedStages.value.splice(stageIndex, 1)
    ElMessage.success('已取消完成标记')
  }
}

// 阶段笔记管理
const addNoteToStage = (index: number) => {
  selectedStageIndex.value = index
  stageNote.value = stageNotes.value[index] || ''
  showNoteDialog.value = true
}

const saveNote = () => {
  if (stageNote.value.trim()) {
    stageNotes.value[selectedStageIndex.value] = stageNote.value
    ElMessage.success('笔记已保存')
  } else {
    delete stageNotes.value[selectedStageIndex.value]
  }
  showNoteDialog.value = false
}

const getNoteStageInfo = () => {
  if (!roadmapResult.value) return ''
  const milestone = roadmapResult.value.milestones[selectedStageIndex.value]
  return `阶段 ${selectedStageIndex.value + 1}: ${milestone.title} (${milestone.duration})`
}

// 技能资源管理
const showSkillResources = (skill: string) => {
  selectedSkill.value = skill
  showResourcesDialog.value = true
}

const getSkillResources = () => {
  // 示例资源数据
  const skillResources = {
    系统设计: [
      {
        title: '系统设计入门与实践',
        description: '从基础概念到实际案例，系统地学习分布式系统设计原则',
        type: 'course',
        url: 'https://example.com/course/system-design'
      },
      {
        title: '高可用架构设计实战',
        description: '学习如何设计高性能、高可用的系统架构',
        type: 'video',
        url: 'https://example.com/video/high-availability'
      },
      {
        title: '《系统架构：复杂系统的产品设计与开发》',
        description: '经典书籍，讲解复杂系统的设计原则和方法',
        type: 'book',
        url: 'https://example.com/book/system-architecture'
      }
    ],
    代码审查: [
      {
        title: '有效的代码审查流程与实践',
        description: '学习如何进行高效、有建设性的代码审查',
        type: 'course',
        url: 'https://example.com/course/code-review'
      },
      {
        title: '常见代码审查模式与反模式',
        description: '分析常见的代码审查错误和最佳实践',
        type: 'video',
        url: 'https://example.com/video/code-review-patterns'
      }
    ],
    技术指导: [
      {
        title: '技术导师：如何指导和培养团队',
        description: '学习成为高效技术导师的方法和技巧',
        type: 'course',
        url: 'https://example.com/course/technical-mentoring'
      },
      {
        title: '《The Coaching Habit》',
        description: '提升指导能力的实用指南',
        type: 'book',
        url: 'https://example.com/book/coaching-habit'
      }
    ]
  }

  const defaultResources = [
    {
      title: `${selectedSkill.value} 基础与实践`,
      description: `学习 ${selectedSkill.value} 的核心概念和应用场景`,
      type: 'course',
      url: 'https://example.com'
    },
    {
      title: `${selectedSkill.value} 进阶课程`,
      description: '深入探讨高级主题和最佳实践',
      type: 'video',
      url: 'https://example.com'
    },
    {
      title: `${selectedSkill.value} 专业书籍推荐`,
      description: '行业专家推荐的必读书目',
      type: 'book',
      url: 'https://example.com'
    }
  ]

  // @ts-ignore
  return skillResources[selectedSkill.value] || defaultResources
}

const openResource = (url: string) => {
  ElMessage.success('正在跳转到学习资源')
  window.open(url, '_blank')
}

// 差距分析
const getGapAnalysis = () => {
  if (!roadmapResult.value) return []

  return [
    '技术深度：需要在核心技术领域建立专家级别的知识体系',
    '管理经验：需要积累项目和团队管理经验，培养领导力',
    '行业视野：需要建立更广泛的行业人脉和对商业的理解',
    '软技能：需要提升沟通能力、谈判技巧和跨部门协作能力'
  ]
}

// 导出与分享
const saveToPDF = () => {
  ElMessage.success('PDF文件已下载（模拟）')
  // 实际项目中可以使用html2canvas和jsPDF等库实现PDF导出功能
}

const printRoadmap = () => {
  ElMessage.success('正在准备打印...')
  window.print()
}

const shareViaEmail = () => {
  const subject = `职业发展路线图：${roadmapForm.currentPosition} 到 ${roadmapResult.value?.targetPosition}`
  const body = `我生成了一份从 ${roadmapForm.currentPosition} 到 ${roadmapResult.value?.targetPosition} 的职业发展路线图，预计用时 ${roadmapResult.value?.timelineYears} 年，一起来看看吧！`

  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  ElMessage.success('已打开邮件客户端')
}

const copyShareLink = () => {
  const text = `我的职业发展路线图：从 ${roadmapForm.currentPosition} 到 ${roadmapResult.value?.targetPosition}，路线图链接：https://example.com/roadmap/share/123456`

  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  })
}

const shareWithQRCode = () => {
  showQRCode.value = true
}

const downloadQRCode = () => {
  ElMessage.success('二维码已下载')
  // 实际项目中可以实现真正的下载功能
}

// 缩放控制
const zoomIn = () => {
  zoomLevel.value = Math.min(1.5, zoomLevel.value + 0.1)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(0.5, zoomLevel.value - 0.1)
}

const resetZoom = () => {
  zoomLevel.value = 1
}

// 技能树图表初始化
const initializeSkillsChart = () => {
  nextTick(() => {
    if (skillsMapRef.value && roadmapResult.value) {
      if (skillsChart) {
        skillsChart.dispose()
      }

      skillsChart = echarts.init(skillsMapRef.value)
      updateSkillsChart()

      window.addEventListener('resize', () => {
        if (skillsChart) {
          skillsChart.resize()
        }
      })
    }
  })
}

// 更新技能树图表
const updateSkillsChart = () => {
  if (!skillsChart || !roadmapResult.value) return

  // 收集所有技能
  const allSkillsNeeded: string[] = []
  roadmapResult.value.milestones.forEach(milestone => {
    milestone.skillsToAcquire.forEach(skill => {
      if (!allSkillsNeeded.includes(skill)) {
        allSkillsNeeded.push(skill)
      }
    })
  })

  // 构建图表数据
  const nodes: any[] = []
  const links: any[] = []

  // 添加中心节点
  nodes.push({
    name: roadmapResult.value.targetPosition,
    symbolSize: 70,
    itemStyle: {
      color: '#F56C6C'
    },
    category: 0
  })

  // 添加一级节点（主要技能类别）
  const categories = ['技术技能', '管理技能', '软技能', '领域知识']
  categories.forEach(category => {
    nodes.push({
      name: category,
      symbolSize: 50,
      itemStyle: {
        color: '#409EFF'
      },
      category: 1
    })

    links.push({
      source: roadmapResult.value!.targetPosition,
      target: category,
      lineStyle: {
        width: 3
      }
    })
  })

  // 添加技能节点
  allSkillsNeeded.forEach(skill => {
    // 确定技能属于哪个类别
    let category
    if (
      skill.includes('设计') ||
      skill.includes('架构') ||
      skill.includes('开发') ||
      skill.includes('编程')
    ) {
      category = '技术技能'
    } else if (skill.includes('管理') || skill.includes('领导') || skill.includes('团队')) {
      category = '管理技能'
    } else if (skill.includes('沟通') || skill.includes('协作') || skill.includes('表达')) {
      category = '软技能'
    } else {
      category = '领域知识'
    }

    nodes.push({
      name: skill,
      symbolSize: 35,
      itemStyle: {
        color: '#67C23A'
      },
      category: 2
    })

    links.push({
      source: category,
      target: skill,
      lineStyle: {
        width: 2
      }
    })
  })

  // 设置图表选项
  const option: any = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['目标职位', '技能类别', '具体技能']
    },
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: '技能树',
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        categories: [{ name: '目标职位' }, { name: '技能类别' }, { name: '具体技能' }],
        roam: true,
        label: {
          show: true,
          position: 'right'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5
          }
        },
        force: {
          repulsion: 300
        }
      }
    ]
  }

  skillsChart.setOption(option)
}

// 对比图表初始化
const initializeComparisonChart = () => {
  nextTick(() => {
    if (comparisonChartRef.value && roadmapResult.value) {
      if (comparisonChart) {
        comparisonChart.dispose()
      }

      comparisonChart = echarts.init(comparisonChartRef.value)
      updateComparisonChart()

      window.addEventListener('resize', () => {
        if (comparisonChart) {
          comparisonChart.resize()
        }
      })
    }
  })
}

// 更新对比图表
const updateComparisonChart = () => {
  if (!comparisonChart || !roadmapResult.value) return

  // 构建对比数据
  const categories = ['技术能力', '管理能力', '沟通协作', '专业知识', '行业视野', '领导力']
  const currentValues = [60, 40, 70, 65, 50, 30]
  const targetValues = [85, 80, 90, 85, 75, 85]

  // 设置图表选项
  const option: any = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['当前水平', '目标水平']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      max: 100
    },
    yAxis: {
      type: 'category',
      data: categories
    },
    series: [
      {
        name: '当前水平',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        data: currentValues
      },
      {
        name: '目标水平',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          position: 'right'
        },
        emphasis: {
          focus: 'series'
        },
        data: targetValues
      }
    ]
  }

  comparisonChart.setOption(option)
}

// 页面跳转
const goToCareerAnalysis = () => {
  router.push('/career-planning/analysis')
}

const goToRecommendation = () => {
  router.push('/career-planning/recommendation')
}

// 监听视图模式变化
watch(viewMode, newMode => {
  nextTick(() => {
    if (newMode === 'skills') {
      initializeSkillsChart()
    } else if (newMode === 'comparison') {
      initializeComparisonChart()
    }
  })
})
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
  position: relative;
}

/* 表单卡片 */
.form-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  position: sticky;
  top: 20px;
}

.roadmap-tabs {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 提交按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 兴趣选择 */
.interest-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.interest-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.interest-item:hover {
  border-color: #c6e2ff;
  background-color: #f0f9ff;
}

.interest-item.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

/* 行业选择器 */
.industry-selector {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.industry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.industry-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.08);
}

.industry-item.active {
  border-color: #409eff;
  background-color: #ecf5ff;
  color: #409eff;
}

.industry-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.industry-name {
  font-size: 14px;
}

/* 占位内容 */
.placeholder-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}

.placeholder-content {
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.placeholder-image {
  width: 100%;
  max-width: 300px;
  margin-bottom: 24px;
}

/* 路线图信息卡片 */
.roadmap-info-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  background-color: #fff;
}

.roadmap-info {
  padding: 8px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed #ebeef5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: #909399;
}

.info-value {
  font-weight: bold;
  color: #303133;
}

.info-value.highlight {
  color: #409eff;
}

.roadmap-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 关键任务提醒卡片 */
.roadmap-highlight-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
  background-color: #fff;
}

.tasks-reminder {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-item {
  padding: 10px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border-left: 3px solid #409eff;
}

.task-stage {
  font-size: 14px;
  color: #909399;
  margin-bottom: 6px;
}

.task-highlight {
  color: #303133;
  font-weight: bold;
}

/* 路线图容器 */
.roadmap-container {
  margin-bottom: 24px;
}

.roadmap-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  background-color: #fff;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.roadmap-content {
  transition: transform 0.3s ease;
  transform-origin: top left;
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

/* 时间线视图 */
.timeline-view {
  position: relative;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: #606266;
}

.timeline-start,
.timeline-end {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.timeline-dot.start {
  background-color: #409eff;
}

.timeline-dot.end {
  background-color: #67c23a;
}

.timeline-label {
  font-size: 14px;
}

/* 自定义时间线 */
.custom-timeline {
  margin-top: 40px;
}

.milestone-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.milestone-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.milestone-card.current-stage {
  border-left: 4px solid #409eff;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.milestone-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: bold;
}

.milestone-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #409eff;
  color: white;
  font-size: 14px;
}

.milestone-duration {
  font-size: 14px;
  color: #909399;
  background-color: #f2f6fc;
  padding: 4px 8px;
  border-radius: 4px;
}

.milestone-content {
  padding: 8px 0;
}

.tasks-list {
  padding-left: 20px;
  margin: 10px 0;
}

.tasks-list li {
  margin-bottom: 8px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-tag {
  border-radius: 4px;
  padding: 6px 10px;
}

.stage-advice {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 10px 0;
}

.stage-metrics {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
}

.metric {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metric-label {
  width: 60px;
  color: #606266;
}

.milestone-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
  padding-top: 10px;
  border-top: 1px dashed #ebeef5;
}

/* 技能树视图 */
.skills-view {
  position: relative;
  min-height: 500px;
}

.skills-map {
  width: 100%;
  height: 500px;
}

.skills-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

/* 对比图视图 */
.comparison-view {
  padding: 10px;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.start-position,
.target-position {
  text-align: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f7fa;
  width: 200px;
}

.start-position h3,
.target-position h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.start-position {
  border-left: 4px solid #409eff;
}

.target-position {
  border-left: 4px solid #67c23a;
}

.position-details {
  font-size: 14px;
  color: #909399;
}

.comparison-arrow {
  display: flex;
  align-items: center;
  color: #409eff;
  position: relative;
  flex: 1;
  max-width: 100px;
}

.arrow-line {
  height: 2px;
  background-color: #409eff;
  flex: 1;
}

.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comparison-chart {
  width: 100%;
  height: 350px;
}

.gap-analysis {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #e6a23c;
}

.gap-analysis h3 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 18px;
}

.gap-list {
  padding-left: 10px;
  margin: 0;
  list-style-type: none;
}

.gap-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  color: #606266;
}

.gap-list li .el-icon {
  color: #e6a23c;
  margin-top: 4px;
}

/* 推荐卡片 */
.recommendations-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
}

.recommendations-content {
  padding: 8px 0;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  height: 100%;
  padding: 0 20px;
}

.recommendation-item .el-icon {
  color: #e6a23c;
  font-size: 18px;
  margin-top: 4px;
}

.recommendation-item p {
  flex: 1;
  margin: 0;
  line-height: 1.6;
  color: #606266;
}

/* 资源弹窗 */
.resources-dialog h3 {
  margin-top: 0;
  color: #303133;
  font-size: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.resources-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.resource-item:hover {
  background-color: #f0f7ff;
}

.resource-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: #409eff;
  color: white;
  border-radius: 8px;
}

.resource-info {
  flex: 1;
}

.resource-title {
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.resource-description {
  font-size: 14px;
  color: #606266;
}

/* 分享弹窗 */
.share-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-option:hover {
  background-color: #ecf5ff;
  transform: translateY(-5px);
}

.share-option .el-icon {
  font-size: 24px;
  color: #409eff;
}

.qrcode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  margin-bottom: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .career-roadmap {
    padding: 16px;
  }

  .sidebar-container {
    margin-bottom: 24px;
  }

  .industry-selector {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .roadmap-controls {
    flex-direction: column;
    gap: 12px;
  }

  .comparison-header {
    flex-direction: column;
    gap: 16px;
  }

  .start-position,
  .target-position {
    width: 100%;
  }

  .comparison-arrow {
    display: none;
  }

  .share-options {
    grid-template-columns: 1fr;
  }
}
</style>
