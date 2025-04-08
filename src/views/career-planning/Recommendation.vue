<template>
  <div class="career-recommendation">
    <!-- 搜索和筛选区域 -->
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>
            <el-icon><StarFilled /></el-icon> 职业推荐
          </span>
          <el-tooltip content="根据您的条件，推荐匹配度最高的职位，点击可直接跳转到招聘平台">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-form :model="searchForm" label-width="120px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="当前职位" required>
              <el-select
                v-model="searchForm.currentPosition"
                filterable
                allow-create
                placeholder="请选择或输入您当前的职位"
                style="width: 100%"
                @change="handlePositionChange"
              >
                <el-option
                  v-for="position in commonPositions"
                  :key="position"
                  :label="position"
                  :value="position"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="工作地点">
              <el-select
                v-model="searchForm.location"
                placeholder="请选择工作地点"
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
            <el-form-item label="期望薪资">
              <el-select
                v-model="searchForm.salary"
                placeholder="请选择期望薪资"
                style="width: 100%"
                @change="handleFilterChange"
              >
                <el-option label="不限" value="" />
                <el-option label="10k以下" value="0-10k" />
                <el-option label="10k-20k" value="10k-20k" />
                <el-option label="20k-30k" value="20k-30k" />
                <el-option label="30k-50k" value="30k-50k" />
                <el-option label="50k以上" value="50k+" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="searchJobs" :loading="loading">
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
        <el-icon><Medal /></el-icon> 为您推荐的职位
        <span class="sub-title">基于您的职业背景，为您精选以下职位</span>
      </h2>

      <div class="job-list">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="job in recommendedJobs" :key="job.title">
            <el-card class="job-card" shadow="hover">
              <div class="job-header">
                <h3 class="job-title">{{ job.title }}</h3>
                <el-tag type="success" effect="dark" size="small">
                  {{ job.matchScore }}% 匹配
                </el-tag>
              </div>

              <p class="job-description">{{ job.description }}</p>

              <div class="job-details">
                <div class="job-detail">
                  <el-icon><Money /></el-icon> {{ job.averageSalary }}
                </div>
                <div class="job-detail">
                  <el-icon><TrendCharts /></el-icon> 发展前景: {{ job.growthProspect }}
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
                <h4>去这里应聘</h4>
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
        <el-icon><StarFilled /></el-icon> 热门职位推荐
        <span class="sub-title">精选热门企业最新职位</span>
      </h2>

      <el-tabs v-model="activeTab" class="job-tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="技术" name="tech"></el-tab-pane>
        <el-tab-pane label="产品" name="product"></el-tab-pane>
        <el-tab-pane label="设计" name="design"></el-tab-pane>
        <el-tab-pane label="运营" name="operation"></el-tab-pane>
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
                  :type="getHotJobTagType(index)"
                  effect="plain"
                  size="small"
                  class="job-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <div class="job-actions">
                <div class="platform-buttons">
                  <a
                    v-for="link in job.jobLinks"
                    :key="link.platform"
                    :href="link.url"
                    target="_blank"
                    class="platform-button"
                  >
                    {{ link.platform }}
                    <el-icon><Right /></el-icon>
                  </a>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 无职位提示 -->
        <el-empty
          v-else
          description="暂无热门职位推荐"
          :image-size="200"
          class="empty-jobs-container"
        >
          <template #image>
            <img src="@/assets/empty-jobs.svg" alt="暂无职位" class="empty-jobs-image" />
          </template>
          <template #description>
            <p class="empty-jobs-description">
              暂无符合条件的热门职位
              <br />
              <span class="empty-jobs-hint">请尝试切换其他职位类别或修改搜索条件</span>
            </p>
          </template>
          <el-button type="primary" @click="activeTab = 'all'"> 查看全部职位 </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 行业趋势区域 -->
    <div v-if="recommendationResult?.industryTrends?.length" class="trends-section">
      <h2 class="section-title">
        <el-icon><DataAnalysis /></el-icon> 行业趋势分析
        <span class="sub-title">了解行业发展趋势，把握职业机会</span>
      </h2>

      <el-row :gutter="20">
        <el-col
          :xs="24"
          :md="8"
          v-for="(trend, index) in recommendationResult.industryTrends"
          :key="index"
        >
          <el-card class="trend-card" shadow="hover">
            <div class="trend-header">
              <h3>{{ trend.industry }}</h3>
              <div class="growth-rate">增长率: {{ trend.growthRate }}</div>
            </div>
            <p class="trend-description">{{ trend.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 职业建议区域 -->
    <div v-if="recommendationResult?.careerAdvice" class="advice-section">
      <el-card class="advice-card">
        <template #header>
          <div class="card-header">
            <el-icon><ChatLineRound /></el-icon> 职业发展建议
          </div>
        </template>
        <p class="advice-content">{{ recommendationResult.careerAdvice }}</p>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  StarFilled,
  QuestionFilled,
  Medal,
  Search,
  RefreshRight,
  Money,
  TrendCharts,
  MagicStick,
  DataAnalysis,
  Location,
  Reading,
  Stopwatch,
  ChatLineRound,
  Right
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

// 搜索表单
const searchForm = reactive({
  currentPosition: '',
  location: '',
  salary: ''
})

// 获取常见职位列表
onMounted(async () => {
  try {
    commonPositions.value = await getCommonPositions()
  } catch (error) {
    ElMessage.error('获取职位列表失败')
  }
})

// 根据当前职位自动获取推荐
const handlePositionChange = async () => {
  if (searchForm.currentPosition) {
    await searchJobs()
  }
}

// 筛选变化时重新搜索
const handleFilterChange = async () => {
  if (searchForm.currentPosition) {
    await searchJobs()
  }
}

// 搜索职位
const searchJobs = async () => {
  if (!searchForm.currentPosition) {
    ElMessage.warning('请选择当前职位')
    return
  }

  loading.value = true
  try {
    const form: CareerRecommendationForm = {
      skills: [],
      interests: [],
      education: '',
      experience: 0,
      currentPosition: searchForm.currentPosition,
      preferredLocation: searchForm.location || undefined,
      // 薪资范围通过搜索条件传递，后端可根据此调整推荐结果
      preferredIndustry: searchForm.salary ? 'salary:' + searchForm.salary : undefined
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
  searchForm.currentPosition = ''
  searchForm.location = ''
  searchForm.salary = ''
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
    operation: ['运营', '市场', '营销']
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

// 获取热门职位标签类型
const getHotJobTagType = (
  index: number
): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = [
    'success',
    'info',
    'warning'
  ]
  return types[index % types.length]
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
</style>
