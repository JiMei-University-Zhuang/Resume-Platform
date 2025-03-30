<template>
  <div class="career-analysis">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span
                ><el-icon><Aim /></el-icon> 职业倾向分析</span
              >
              <el-tooltip content="基于您的教育背景、技能和兴趣爱好，分析最适合您的职业方向">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>

          <el-form :model="analysisForm" label-width="120px">
            <el-form-item label="教育背景" required>
              <el-select v-model="analysisForm.education" placeholder="请选择您的学历">
                <el-option label="高中" value="high_school" />
                <el-option label="专科" value="college" />
                <el-option label="本科" value="bachelor" />
                <el-option label="硕士" value="master" />
                <el-option label="博士" value="phd" />
              </el-select>
            </el-form-item>

            <el-form-item label="专业方向" required>
              <el-input v-model="analysisForm.major" placeholder="请输入您的专业" />
            </el-form-item>

            <el-form-item label="技能特长" required>
              <el-select
                v-model="analysisForm.skills"
                multiple
                filterable
                allow-create
                placeholder="请选择或输入您的技能特长"
                style="width: 100%"
              >
                <el-option-group label="技术">
                  <el-option
                    v-for="skill in techSkills"
                    :key="skill.id"
                    :label="skill.name"
                    :value="skill.name"
                  />
                </el-option-group>
                <el-option-group label="设计">
                  <el-option
                    v-for="skill in designSkills"
                    :key="skill.id"
                    :label="skill.name"
                    :value="skill.name"
                  />
                </el-option-group>
                <el-option-group label="管理">
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

            <el-form-item label="兴趣爱好">
              <el-select
                v-model="analysisForm.interests"
                multiple
                filterable
                allow-create
                placeholder="请选择或输入您的兴趣爱好"
                style="width: 100%"
              >
                <el-option label="技术研究" value="tech_research" />
                <el-option label="创意设计" value="creative_design" />
                <el-option label="数据分析" value="data_analysis" />
                <el-option label="人际沟通" value="communication" />
                <el-option label="团队协作" value="teamwork" />
                <el-option label="写作" value="writing" />
                <el-option label="策略规划" value="strategy" />
                <el-option label="教学培训" value="teaching" />
                <el-option label="艺术创作" value="art" />
              </el-select>
            </el-form-item>

            <el-form-item label="工作经验">
              <el-input-number
                v-model="analysisForm.workExperience"
                :min="0"
                :max="50"
                placeholder="工作年限"
              />
              <span class="form-note">年</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitAnalysis" :loading="analyzing">
                开始分析
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="analysisResult" class="result-section">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span
                ><el-icon><DataAnalysis /></el-icon> 分析结果</span
              >
            </div>
          </template>

          <div class="result-summary">
            <div class="summary-header">
              <h2 class="recommended-career">{{ analysisResult.recommendedCareer }}</h2>
              <div class="match-score">
                <el-progress
                  type="circle"
                  :percentage="analysisResult.suitabilityScore"
                  :status="getScoreStatus(analysisResult.suitabilityScore)"
                />
                <div class="score-label">匹配度</div>
              </div>
            </div>

            <div class="advantages-box">
              <h3>职业优势</h3>
              <p>{{ analysisResult.advantages }}</p>
            </div>

            <el-divider />

            <div class="strength-weakness">
              <div class="strengths">
                <h3>您的优势</h3>
                <ul>
                  <li v-for="(strength, index) in analysisResult.strengths" :key="index">
                    <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                    <span>{{ strength }}</span>
                  </li>
                </ul>
              </div>
              <div class="weaknesses">
                <h3>改进空间</h3>
                <ul>
                  <li v-for="(weakness, index) in analysisResult.weaknesses" :key="index">
                    <el-icon color="#F56C6C"><InfoFilled /></el-icon>
                    <span>{{ weakness }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <el-divider />

            <div class="suggestions-box">
              <h3>发展建议</h3>
              <p>{{ analysisResult.suggestions }}</p>
            </div>

            <el-divider />

            <div class="related-careers">
              <h3>相关职业推荐</h3>
              <div class="career-tags">
                <el-tag
                  v-for="(career, index) in analysisResult.relatedCareers"
                  :key="index"
                  class="career-tag"
                  @click="goToRecommendationWithCareer(career)"
                >
                  {{ career }}
                  <el-icon class="tag-icon"><ArrowRight /></el-icon>
                </el-tag>
              </div>
            </div>

            <div class="action-buttons">
              <el-button type="primary" @click="goToRoadmap">查看职业发展规划</el-button>
              <el-button type="success" @click="goToRecommendation">探索更多职业选择</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { CareerAnalysisForm, CareerAnalysisResult, CareerSkill } from '@/types/career'
import { submitCareerAnalysis, getCareerSkills } from '@/api/career'

const router = useRouter()
const analyzing = ref(false)
const allSkills = ref<CareerSkill[]>([])

const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const designSkills = computed(() => allSkills.value.filter(skill => skill.category === 'design'))
const managementSkills = computed(() =>
  allSkills.value.filter(skill => skill.category === 'management')
)
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

const analysisForm = reactive<CareerAnalysisForm>({
  education: '',
  major: '',
  skills: [],
  interests: [],
  workExperience: 0
})

const analysisResult = ref<CareerAnalysisResult | null>(null)

onMounted(async () => {
  try {
    allSkills.value = await getCareerSkills()
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  }
})

const submitAnalysis = async () => {
  if (!analysisForm.education || !analysisForm.major || analysisForm.skills.length === 0) {
    ElMessage.warning('请填写必要的信息（教育背景、专业方向和技能特长）')
    return
  }

  analyzing.value = true
  try {
    analysisResult.value = await submitCareerAnalysis(analysisForm)
    ElMessage.success('分析完成')

    // 滚动到结果区域
    setTimeout(() => {
      const resultElement = document.querySelector('.result-section')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  } catch (error) {
    ElMessage.error('分析失败，请重试')
    console.error(error)
  } finally {
    analyzing.value = false
  }
}

const resetForm = () => {
  analysisForm.education = ''
  analysisForm.major = ''
  analysisForm.skills = []
  analysisForm.interests = []
  analysisForm.workExperience = 0
  analysisResult.value = null
}

const getScoreStatus = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 70) return ''
  return 'exception'
}

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
  padding: 20px;
}

.analysis-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-note {
  margin-left: 10px;
  color: #909399;
}

.result-section {
  margin-top: 30px;
}

.result-summary {
  padding: 10px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recommended-career {
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

.advantages-box,
.suggestions-box {
  padding: 15px;
  background-color: #f2f6fc;
  border-radius: 4px;
  margin-bottom: 20px;
}

.advantages-box h3,
.suggestions-box h3 {
  margin-top: 0;
  color: #409eff;
}

.strength-weakness {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
}

.strengths,
.weaknesses {
  flex: 1;
}

.strengths h3,
.weaknesses h3 {
  margin-top: 0;
}

.strengths ul,
.weaknesses ul {
  padding-left: 0;
  list-style-type: none;
}

.strengths li,
.weaknesses li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.related-careers {
  margin: 20px 0;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.career-tag {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s;
}

.career-tag:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.tag-icon {
  font-size: 12px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .summary-header {
    flex-direction: column;
    gap: 20px;
  }

  .strength-weakness {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
