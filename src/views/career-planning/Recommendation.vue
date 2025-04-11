<template>
  <div class="career-recommendation">
    <!-- 页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><StarFilled /></el-icon>
        职业机会探索
        <span class="beta-tag">Beta</span>
      </h1>
      <p class="page-description">发掘适合你专业背景的热门职位，为你的职业之旅开启新可能。</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>
            <el-icon><Search /></el-icon> 职位搜索
          </span>
          <el-tooltip content="根据你的条件，探索适合的职位机会，发现潜在的实习与就业可能">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-form :model="searchForm" label-width="120px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="专业方向" required>
              <el-select
                v-model="searchForm.major"
                filterable
                placeholder="请选择或输入你的专业"
                style="width: 100%"
                @change="handleMajorChange"
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
          </el-col>

          <el-col :span="8">
            <el-form-item label="意向城市">
              <el-select
                v-model="searchForm.location"
                placeholder="请选择意向城市"
                style="width: 100%"
                @change="handleFilterChange"
              >
                <el-option label="不限" value="" />
                <el-option label="北京" value="北京" />
                <el-option label="上海" value="上海" />
                <el-option label="广州" value="广州" />
                <el-option label="深圳" value="深圳" />
                <el-option label="杭州" value="杭州" />
                <el-option label="成都" value="成都" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="期望类型">
              <el-select
                v-model="searchForm.jobType"
                placeholder="请选择职位类型"
                style="width: 100%"
                @change="handleFilterChange"
              >
                <el-option label="不限" value="" />
                <el-option label="实习" value="internship" />
                <el-option label="校招" value="campus" />
                <el-option label="社招" value="social" />
                <el-option label="兼职" value="parttime" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="searchJobs" :loading="loading" class="glow-btn">
                <el-icon><Search /></el-icon> 搜索职位
              </el-button>
              <el-button @click="resetForm">
                <el-icon><RefreshRight /></el-icon> 重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 职位推荐区域 -->
    <div v-if="recommendationResult" class="recommendation-section">
      <h2 class="section-title">
        <el-icon><Medal /></el-icon> 为你推荐的职位
        <span class="sub-title">基于你的专业背景，为你精选以下职位</span>
      </h2>

      <div class="job-list">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="job in recommendedJobs" :key="job.title">
            <el-card class="job-card" shadow="hover">
              <div class="job-header">
                <h3 class="job-title">{{ job.title }}</h3>
                <div
                  class="match-badge"
                  :style="{ backgroundColor: getMatchColor(job.matchScore) }"
                >
                  {{ job.matchScore }}% 匹配
                </div>
              </div>

              <p class="job-description">{{ job.description }}</p>

              <div class="job-details">
                <div class="job-detail">
                  <el-icon><Money /></el-icon> {{ job.averageSalary }}
                </div>
                <div class="job-detail">
                  <el-icon><TrendCharts /></el-icon> 职业前景: {{ job.growthProspect }}
                </div>
                <div class="job-detail">
                  <el-icon><MagicStick /></el-icon> 工作生活平衡: {{ job.workLifeBalance }}
                </div>
              </div>

              <div class="job-skills">
                <h4>所需技能</h4>
                <div class="skill-tags">
                  <el-tag
                    v-for="(skill, idx) in job.requiredSkills"
                    :key="idx"
                    :type="getTagType(idx)"
                    size="small"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </el-tag>
                </div>
              </div>

              <div class="job-links">
                <h4>查看招聘信息</h4>
                <div class="platform-links">
                  <a
                    v-for="link in job.jobLinks"
                    :key="link.platform"
                    :href="link.url"
                    target="_blank"
                    class="platform-link"
                  >
                    <img :src="link.logo" :alt="link.platform" class="platform-logo" />
                    <span>{{ link.platform }}</span>
                  </a>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 热门职位区域 -->
    <div class="hot-jobs-section">
      <h2 class="section-title">
        <el-icon><StarFilled /></el-icon> 热门实习与校招
        <span class="sub-title">精选知名企业最新职位</span>
      </h2>

      <el-tabs v-model="activeTab" class="job-tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="技术" name="tech"></el-tab-pane>
        <el-tab-pane label="产品" name="product"></el-tab-pane>
        <el-tab-pane label="设计" name="design"></el-tab-pane>
        <el-tab-pane label="运营" name="operation"></el-tab-pane>
        <el-tab-pane label="市场" name="marketing"></el-tab-pane>
      </el-tabs>

      <div class="job-lists">
        <el-row :gutter="20" v-if="filteredHotJobs.length > 0">
          <el-col :xs="24" :sm="12" v-for="job in filteredHotJobs" :key="job.id">
            <el-card class="hot-job-card" shadow="hover">
              <div class="company-info">
                <img :src="job.companyLogo" :alt="job.company" class="company-logo" />
                <div>
                  <h3 class="job-name">{{ job.title }}</h3>
                  <p class="company-name">{{ job.company }}</p>
                </div>
              </div>

              <div class="job-info">
                <div class="info-item">
                  <el-icon><Money /></el-icon> {{ job.salary }}
                </div>
                <div class="info-item">
                  <el-icon><Location /></el-icon> {{ job.location }}
                </div>
                <div class="info-item">
                  <el-icon><Reading /></el-icon> {{ job.education }}
                </div>
                <div class="info-item">
                  <el-icon><Stopwatch /></el-icon> {{ job.experience }}
                </div>
              </div>

              <div class="job-tags">
                <el-tag
                  v-for="(tag, index) in job.tags"
                  :key="index"
                  :type="getTagType(index)"
                  size="small"
                  class="job-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <div class="job-actions">
                <el-button type="primary" size="small" @click="viewJobDetails(job)">
                  查看详情
                </el-button>
                <el-button size="small" @click="applyForJob(job)"> 立即申请 </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else class="empty-jobs">
          <img src="@/assets/empty-search.svg" alt="暂无数据" class="empty-image" />
          <p>暂无相关职位，请调整筛选条件</p>
        </div>
      </div>
    </div>

    <!-- 招聘日历 -->
    <div class="recruitment-calendar">
      <h2 class="section-title">
        <el-icon><Calendar /></el-icon> 招聘日历
        <span class="sub-title">近期校园招聘会和宣讲会信息</span>
      </h2>

      <el-card shadow="hover" class="calendar-card">
        <el-calendar v-model="calendarValue">
          <template #dateCell="{ data }">
            <div class="calendar-cell">
              <p>{{ data.day.split('-').slice(2).join('-') }}</p>
              <div v-if="hasEvent(data.day)" class="calendar-events">
                <div
                  v-for="(event, index) in getEvents(data.day)"
                  :key="index"
                  class="calendar-event-dot"
                  :style="{ backgroundColor: event.color }"
                ></div>
              </div>
            </div>
          </template>
        </el-calendar>

        <div class="upcoming-events">
          <h3 class="events-title">近期招聘活动</h3>
          <div class="events-list">
            <div v-for="(event, index) in upcomingEvents" :key="index" class="event-item">
              <div class="event-date">
                <div class="event-month">{{ event.month }}</div>
                <div class="event-day">{{ event.day }}</div>
              </div>
              <div class="event-content">
                <h4 class="event-title">{{ event.title }}</h4>
                <p class="event-info">
                  <el-icon><Location /></el-icon> {{ event.location }}
                </p>
                <p class="event-info">
                  <el-icon><Clock /></el-icon> {{ event.time }}
                </p>
                <div class="event-tags">
                  <el-tag
                    size="small"
                    effect="plain"
                    :type="event.type === '校招' ? 'primary' : 'success'"
                  >
                    {{ event.type }}
                  </el-tag>
                  <el-tag size="small" effect="plain" type="info">{{ event.company }}</el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import {
  StarFilled,
  QuestionFilled,
  Medal,
  Search,
  RefreshRight,
  Money,
  TrendCharts,
  MagicStick,
  Location,
  Reading,
  Stopwatch,
  Calendar,
  Clock
} from '@element-plus/icons-vue'
import type {
  CareerRecommendationForm,
  CareerRecommendationResult,
  CareerRecommendation,
  HotJob
} from '@/types/career'
import { getCommonPositions } from '@/api/career'
import { getProfessionRecommendation } from '@/api/ai'

const loading = ref(false)
const activeTab = ref('all')
const commonPositions = ref<string[]>([])
const recommendationResult = ref<CareerRecommendationResult | null>(null)
const calendarValue = ref(new Date())

// 搜索表单
const searchForm = reactive({
  major: '',
  location: '',
  jobType: ''
})

// 配置引导步骤
const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: '.page-header',
      popover: {
        title: '欢迎使用职业推荐',
        description: '这里为您提供专业的职业机会探索和推荐服务',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '.search-card',
      popover: {
        title: '职位搜索',
        description: '根据您的专业背景、意向城市和职位类型，为您匹配最适合的职位',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '.recommendation-section',
      popover: {
        title: '个性化推荐',
        description: '基于您的专业背景，系统会智能推荐最匹配的职位，并显示匹配度',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.hot-jobs-section',
      popover: {
        title: '热门职位',
        description: '浏览最新的实习和校招职位信息，可以按照不同类别筛选',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.recruitment-calendar',
      popover: {
        title: '招聘日历',
        description: '查看近期的校园招聘会和宣讲会信息，不要错过重要的招聘活动',
        side: 'left',
        align: 'start'
      }
    },
    { 
      popover: { 
        title: '开始探索', 
        description: '现在，让我们开始寻找适合您的理想职位吧！' 
      } 
    }
  ]
})

// 获取常见职位列表并启动引导
onMounted(async () => {
  try {
    commonPositions.value = await getCommonPositions()
    
    // 检查是否首次访问
    const hasSeenRecommendationGuide = localStorage.getItem('hasSeenRecommendationGuide')
    if (!hasSeenRecommendationGuide) {
      nextTick(() => {
        setTimeout(() => {
          driverObj.drive()
          localStorage.setItem('hasSeenRecommendationGuide', 'true')
        }, 500)
      })
    }
  } catch (error) {
    ElMessage.error('获取职位列表失败')
  }
})

// 根据当前职位自动获取推荐
const handleMajorChange = async () => {
  if (searchForm.major) {
    await searchJobs()
  }
}

// 筛选变化时重新搜索
const handleFilterChange = async () => {
  if (searchForm.major) {
    await searchJobs()
  }
}

// 搜索职位
const searchJobs = async () => {
  if (!searchForm.major) {
    ElMessage.warning('请选择专业方向')
    return
  }

  loading.value = true
  try {
    const form: CareerRecommendationForm = {
      skills: [],
      interests: [],
      education: '',
      experience: 0,
      currentPosition: searchForm.major,
      preferredLocation: searchForm.location || undefined,
      // 薪资范围通过搜索条件传递，后端可根据此调整推荐结果
      preferredIndustry: searchForm.jobType ? 'jobType:' + searchForm.jobType : undefined
    }

    const response = await getProfessionRecommendation(form)
    recommendationResult.value = response.data
    ElMessage.success('推荐获取成功')
  } catch (error) {
    ElMessage.error('获取推荐失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  searchForm.major = ''
  searchForm.location = ''
  searchForm.jobType = ''
  recommendationResult.value = null
}

// 获取推荐职位列表
const recommendedJobs = computed<CareerRecommendation[]>(() => {
  if (!recommendationResult.value) return []
  return recommendationResult.value.topRecommendations
})

// 根据标签类型过滤热门职位
const filteredHotJobs = computed<HotJob[]>(() => {
  if (!recommendationResult.value?.hotJobs) return []

  const hotJobs = recommendationResult.value.hotJobs

  // 根据标签过滤
  if (activeTab.value === 'all') {
    return hotJobs
  }

  // 这里使用简单的标题匹配来筛选职位类别
  // 实际项目中应该在后端添加职位类别字段或使用更精确的匹配
  const jobTypeMap: Record<string, string[]> = {
    tech: ['开发', '工程师', '算法', '技术', 'Java', '前端', '后端', '全栈', '数据'],
    product: ['产品', '经理'],
    design: ['设计', 'UI', 'UX'],
    operation: ['运营', '市场', '营销'],
    marketing: ['市场', '营销']
  }

  const keywords = jobTypeMap[activeTab.value] || []
  return hotJobs.filter(job => keywords.some(keyword => job.title.includes(keyword)))
})

// 获取技能标签类型
const getTagType = (
  index: number
): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = [
    'success',
    'warning',
    'info',
    'primary',
    'danger'
  ]
  return types[index % types.length]
}

// 获取匹配颜色
const getMatchColor = (matchScore: number): string => {
  if (matchScore >= 80) return '#67c23a'
  if (matchScore >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 查看职位详情
const viewJobDetails = (job: CareerRecommendation | HotJob) => {
  // 实现查看职位详情的逻辑
  console.log('查看职位详情:', job)
}

// 申请职位
const applyForJob = (job: CareerRecommendation | HotJob) => {
  // 实现申请职位的逻辑
  console.log('申请职位:', job)
}

// 获取近期招聘活动列表
const upcomingEvents = computed(() => {
  const now = new Date()
  const events = recruitmentEvents.value
    .filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map(event => {
      const date = new Date(event.date)
      const months = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
      return {
        ...event,
        month: months[date.getMonth()],
        day: date.getDate()
      }
    })

  return events
})

// 日历事件数据
const recruitmentEvents = ref([
  {
    date: '2023-12-05',
    title: '腾讯2024校园招聘宣讲会',
    location: '计算机科学与技术学院报告厅',
    time: '14:30-16:30',
    company: '腾讯',
    type: '校招',
    color: '#1677ff'
  },
  {
    date: '2023-12-08',
    title: '字节跳动实习生招聘',
    location: '就业指导中心1号厅',
    time: '10:00-12:00',
    company: '字节跳动',
    type: '实习',
    color: '#52c41a'
  },
  {
    date: '2023-12-12',
    title: '阿里巴巴技术岗位专场',
    location: '线上直播',
    time: '19:00-21:00',
    company: '阿里巴巴',
    type: '校招',
    color: '#1677ff'
  },
  {
    date: '2023-12-15',
    title: '华为产品经理招聘',
    location: '经管学院报告厅',
    time: '15:00-17:00',
    company: '华为',
    type: '校招',
    color: '#1677ff'
  },
  {
    date: '2023-12-20',
    title: '百度AI开发实习生招聘',
    location: '就业指导中心2号厅',
    time: '14:00-16:00',
    company: '百度',
    type: '实习',
    color: '#52c41a'
  }
])

// 日历相关函数
const hasEvent = (day: string): boolean => {
  return recruitmentEvents.value.some(event => event.date === day)
}

const getEvents = (day: string) => {
  return recruitmentEvents.value.filter(event => event.date === day)
}
</script>

<style scoped>
.career-recommendation {
  padding: 20px;
}

.search-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0 20px;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 10px;
  font-size: 1.5rem;
  position: relative;
}

.section-title .el-icon {
  color: #409eff;
}

.sub-title {
  font-size: 0.9rem;
  color: #909399;
  font-weight: normal;
  margin-left: 10px;
}

/* 职位推荐卡片样式 */
.job-list {
  margin-bottom: 30px;
}

.job-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.job-title {
  font-size: 1.2rem;
  margin: 0;
  color: #303133;
}

.job-description {
  font-size: 0.9rem;
  color: #606266;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.job-details {
  margin-bottom: 15px;
}

.job-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #606266;
}

.job-detail .el-icon {
  color: #409eff;
}

.job-skills h4,
.job-links h4 {
  font-size: 0.9rem;
  color: #303133;
  margin: 10px 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.platform-links {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.platform-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #409eff;
  background-color: #ecf5ff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: all 0.3s;
}

.platform-link:hover {
  background-color: #409eff;
  color: white;
}

.platform-logo {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* 空职位提示区域 */
.empty-jobs-container {
  margin: 40px 0;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-jobs-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
}

.empty-jobs-description {
  font-size: 16px;
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.6;
}

.empty-jobs-hint {
  font-size: 14px;
  color: #909399;
}

/* 热门职位区域样式 */
.job-tabs {
  margin-bottom: 20px;
}

.hot-job-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.hot-job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.company-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.company-logo {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 6px;
}

.job-name {
  font-size: 1.1rem;
  margin: 0 0 5px 0;
  color: #303133;
}

.company-name {
  font-size: 0.9rem;
  color: #606266;
  margin: 0;
}

.job-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #606266;
}

.info-item .el-icon {
  color: #409eff;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.job-tag {
  margin-right: 0;
}

.job-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
}

.platform-buttons {
  display: flex;
  gap: 10px;
}

.platform-button {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #409eff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid #409eff;
  transition: all 0.3s;
}

.platform-button:hover {
  background-color: #409eff;
  color: white;
}

/* 行业趋势区域样式 */
.trends-section {
  margin-top: 40px;
  margin-bottom: 30px;
}

.trend-card {
  height: 100%;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.trend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.trend-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #303133;
}

.growth-rate {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.trend-description {
  font-size: 0.9rem;
  color: #606266;
  line-height: 1.6;
}

/* 职业建议区域样式 */
.advice-section {
  margin-bottom: 30px;
}

.advice-card {
  transition: all 0.3s;
}

.advice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.advice-content {
  font-size: 1rem;
  color: #606266;
  line-height: 1.8;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .job-info {
    grid-template-columns: 1fr;
  }

  .platform-buttons {
    flex-direction: column;
    width: 100%;
  }

  .job-links {
    flex-direction: column;
  }

  .platform-link {
    width: 100%;
  }
}

/* 招聘日历样式 */
.recruitment-calendar {
  margin-top: 40px;
  margin-bottom: 30px;
}

.calendar-card {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.calendar-cell {
  position: relative;
}

.calendar-cell p {
  margin: 0;
  text-align: center;
}

.calendar-events {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 4px;
}

.calendar-event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
}

.upcoming-events {
  margin-top: 20px;
}

.events-title {
  font-size: 1.2rem;
  color: #303133;
  margin-bottom: 10px;
}

.events-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event-month {
  font-size: 0.9rem;
  color: #606266;
}

.event-day {
  font-size: 1.2rem;
  color: #303133;
}

.event-content {
  flex: 1;
}

.event-title {
  font-size: 1rem;
  color: #303133;
  margin-bottom: 5px;
}

.event-info {
  font-size: 0.9rem;
  color: #606266;
}

.event-tags {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.empty-jobs {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin-bottom: 20px;
}
</style>
