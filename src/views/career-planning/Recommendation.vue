<template>
  <div class="career-recommendation">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><StarFilled /></el-icon> 职业推荐</span>
              <el-tooltip content="基于您的背景、技能和兴趣，推荐最适合您的职业选择">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>

          <el-form :model="recommendationForm" label-width="120px" label-position="top">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="教育背景" required>
                  <el-select v-model="recommendationForm.education" placeholder="请选择您的最高学历" style="width: 100%">
                    <el-option label="高中" value="high_school" />
                    <el-option label="专科" value="college" />
                    <el-option label="本科" value="bachelor" />
                    <el-option label="硕士" value="master" />
                    <el-option label="博士" value="phd" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="工作经验" required>
                  <el-input-number 
                    v-model="recommendationForm.experience" 
                    :min="0" 
                    :precision="0" 
                    style="width: 100%"
                    placeholder="请输入您的工作年限" 
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="技能特长" required>
              <el-select
                v-model="recommendationForm.skills"
                multiple
                filterable
                allow-create
                placeholder="请选择或输入您的技能特长"
                style="width: 100%"
              >
                <el-option-group label="技术">
                  <el-option v-for="skill in techSkills" :key="skill.id" :label="skill.name" :value="skill.name" />
                </el-option-group>
                <el-option-group label="设计">
                  <el-option v-for="skill in designSkills" :key="skill.id" :label="skill.name" :value="skill.name" />
                </el-option-group>
                <el-option-group label="管理">
                  <el-option v-for="skill in managementSkills" :key="skill.id" :label="skill.name" :value="skill.name" />
                </el-option-group>
                <el-option-group label="软技能">
                  <el-option v-for="skill in softSkills" :key="skill.id" :label="skill.name" :value="skill.name" />
                </el-option-group>
              </el-select>
            </el-form-item>

            <el-form-item label="兴趣方向">
              <el-select
                v-model="recommendationForm.interests"
                multiple
                filterable
                allow-create
                placeholder="请选择或输入您感兴趣的方向"
                style="width: 100%"
              >
                <el-option label="技术研究" value="tech_research" />
                <el-option label="产品设计" value="product_design" />
                <el-option label="团队管理" value="team_management" />
                <el-option label="项目管理" value="project_management" />
                <el-option label="业务分析" value="business_analysis" />
                <el-option label="战略规划" value="strategic_planning" />
                <el-option label="数据科学" value="data_science" />
              </el-select>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="8">
                <el-form-item label="工作方式偏好">
                  <el-select v-model="recommendationForm.preferredWorkStyle" placeholder="请选择工作方式" style="width: 100%">
                    <el-option label="办公室全职" value="office" />
                    <el-option label="远程工作" value="remote" />
                    <el-option label="混合模式" value="hybrid" />
                    <el-option label="自由职业" value="freelance" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-form-item label="行业偏好">
                  <el-select v-model="recommendationForm.preferredIndustry" placeholder="请选择行业" style="width: 100%">
                    <el-option label="互联网/科技" value="tech" />
                    <el-option label="金融/银行" value="finance" />
                    <el-option label="医疗/健康" value="healthcare" />
                    <el-option label="教育" value="education" />
                    <el-option label="制造业" value="manufacturing" />
                    <el-option label="零售/电商" value="retail" />
                    <el-option label="咨询/服务" value="consulting" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="8">
                <el-form-item label="地区偏好">
                  <el-select v-model="recommendationForm.preferredLocation" placeholder="请选择地区" style="width: 100%">
                    <el-option label="北京" value="beijing" />
                    <el-option label="上海" value="shanghai" />
                    <el-option label="广州" value="guangzhou" />
                    <el-option label="深圳" value="shenzhen" />
                    <el-option label="杭州" value="hangzhou" />
                    <el-option label="成都" value="chengdu" />
                    <el-option label="不限" value="any" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button type="primary" @click="getRecommendations" :loading="loading">
                获取职业推荐
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="recommendationResult" class="result-section">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><Medal /></el-icon> 最佳职业推荐</span>
            </div>
          </template>
          
          <el-tabs type="border-card">
            <el-tab-pane 
              v-for="(career, index) in recommendationResult.topRecommendations" 
              :key="index"
              :label="career.title + ' (' + career.matchScore + '%'"
            >
              <div class="career-detail">
                <div class="career-header">
                  <h2 class="career-title">{{ career.title }}</h2>
                  <div class="match-score">
                    <el-progress 
                      type="circle" 
                      :percentage="career.matchScore" 
                      :status="getScoreStatus(career.matchScore)"
                    />
                    <div class="score-label">匹配度</div>
                  </div>
                </div>
                
                <div class="career-description">
                  <p>{{ career.description }}</p>
                </div>
                
                <el-divider />
                
                <div class="career-metrics">
                  <div class="metric-item">
                    <h4>平均薪资范围</h4>
                    <div class="metric-value salary">{{ career.averageSalary }}</div>
                  </div>
                  <div class="metric-item">
                    <h4>发展前景</h4>
                    <div class="metric-value">{{ career.growthProspect }}</div>
                  </div>
                  <div class="metric-item">
                    <h4>工作生活平衡</h4>
                    <div class="metric-value">{{ career.workLifeBalance }}</div>
                  </div>
                </div>
                
                <el-divider />
                
                <div class="required-skills">
                  <h3>所需技能</h3>
                  <div class="skill-tags">
                    <el-tag
                      v-for="(skill, idx) in career.requiredSkills"
                      :key="idx"
                      :type="getTagType(idx)"
                      class="skill-tag"
                    >
                      {{ skill }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          
          <div class="industry-trends" v-if="recommendationResult.industryTrends.length > 0">
            <h3>行业趋势分析</h3>
            <el-row :gutter="20">
              <el-col 
                v-for="(trend, index) in recommendationResult.industryTrends" 
                :key="index"
                :xs="24" 
                :md="8"
              >
                <div class="trend-card">
                  <div class="trend-header">
                    <h4>{{ trend.industry }}</h4>
                    <div class="growth-rate">增长率: {{ trend.growthRate }}</div>
                  </div>
                  <p>{{ trend.description }}</p>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <div class="career-advice" v-if="recommendationResult.careerAdvice">
            <h3>职业发展建议</h3>
            <div class="advice-content">
              {{ recommendationResult.careerAdvice }}
            </div>
          </div>
          
          <div class="action-buttons">
            <el-button type="primary" @click="goToRoadmap">制定职业规划</el-button>
            <el-button type="success" @click="goToCareerAnalysis">职业分析</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { 
  CareerRecommendationForm,
  CareerRecommendationResult,
  CareerSkill
} from '@/types/career'
import { getCareerRecommendations, getCareerSkills } from '@/api/career'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const allSkills = ref<CareerSkill[]>([])

const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const designSkills = computed(() => allSkills.value.filter(skill => skill.category === 'design'))
const managementSkills = computed(() => allSkills.value.filter(skill => skill.category === 'management'))
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

const recommendationForm = reactive<CareerRecommendationForm>({
  skills: [],
  interests: [],
  education: '',
  experience: 0,
  preferredWorkStyle: undefined,
  preferredIndustry: undefined,
  preferredLocation: undefined
})

const recommendationResult = ref<CareerRecommendationResult | null>(null)

onMounted(async () => {
  try {
    allSkills.value = await getCareerSkills()
    
    // 如果URL有职业参数，自动添加到技能中
    const careerParam = route.query.career as string
    if (careerParam) {
      recommendationForm.skills.push(careerParam)
      ElMessage.info(`已将 ${careerParam} 添加到您的技能中`)
    }
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  }
})

const getRecommendations = async () => {
  if (!recommendationForm.education || recommendationForm.skills.length === 0) {
    ElMessage.warning('请填写必要的信息（教育背景和技能特长）')
    return
  }

  loading.value = true
  try {
    recommendationResult.value = await getCareerRecommendations(recommendationForm)
    ElMessage.success('推荐获取成功')
    
    // 滚动到结果区域
    setTimeout(() => {
      const resultElement = document.querySelector('.result-section')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  } catch (error) {
    ElMessage.error('获取推荐失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  recommendationForm.education = ''
  recommendationForm.experience = 0
  recommendationForm.skills = []
  recommendationForm.interests = []
  recommendationForm.preferredWorkStyle = undefined
  recommendationForm.preferredIndustry = undefined
  recommendationForm.preferredLocation = undefined
  recommendationResult.value = null
}

const getScoreStatus = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 70) return ''
  return 'exception'
}

const getTagType = (index: number): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = 
    ['success', 'warning', 'info', 'primary', 'danger']
  return types[index % types.length]
}

const goToRoadmap = () => {
  router.push('/career-planning/roadmap')
}

const goToCareerAnalysis = () => {
  router.push('/career-planning/analysis')
}
</script>

<style scoped>
.career-recommendation {
  padding: 20px;
}

.form-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-section {
  margin-top: 30px;
}

.career-detail {
  padding: 15px;
}

.career-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.career-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.match-score {
  text-align: center;
}

.score-label {
  margin-top: 5px;
  font-size: 14px;
  color: #606266;
}

.career-description {
  font-size: 16px;
  line-height: 1.6;
  color: #606266;
  margin-bottom: 20px;
}

.career-metrics {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.metric-item {
  text-align: center;
  flex: 1;
}

.metric-item h4 {
  margin: 0 0 8px 0;
  color: #909399;
  font-size: 14px;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.metric-value.salary {
  color: #67C23A;
}

.required-skills {
  margin: 20px 0;
}

.required-skills h3 {
  margin-top: 0;
  color: #409EFF;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.skill-tag {
  margin-right: 0;
}

.industry-trends {
  margin: 30px 0;
}

.industry-trends h3 {
  margin-bottom: 20px;
  color: #409EFF;
}

.trend-card {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 15px;
  height: 100%;
  margin-bottom: 20px;
}

.trend-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.trend-header h4 {
  margin: 0;
  color: #303133;
}

.growth-rate {
  background-color: #f0f9eb;
  color: #67C23A;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.career-advice {
  margin: 30px 0;
}

.career-advice h3 {
  color: #409EFF;
}

.advice-content {
  background-color: #f2f6fc;
  border-radius: 4px;
  padding: 15px;
  color: #303133;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .career-header, .career-metrics {
    flex-direction: column;
    gap: 20px;
  }
  
  .metric-item {
    margin-bottom: 15px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
