<template>
  <div class="career-roadmap">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span><el-icon><Compass /></el-icon> 职业发展规划</span>
              <el-tooltip content="基于您的目标职位和背景，制定个性化的职业发展路线图">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>

          <el-form :model="roadmapForm" label-width="120px" label-position="top">
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="当前职位" required>
                  <el-input v-model="roadmapForm.currentPosition" placeholder="请输入您当前的职位" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="目标职位" required>
                  <el-input v-model="roadmapForm.targetPosition" placeholder="请输入您希望达到的职位" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :xs="24" :sm="12">
                <el-form-item label="工作经验" required>
                  <el-input-number 
                    v-model="roadmapForm.yearsOfExperience" 
                    :min="0" 
                    :precision="0" 
                    style="width: 100%"
                    placeholder="请输入您的工作年限" 
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="教育背景" required>
                  <el-select v-model="roadmapForm.education" placeholder="请选择您的最高学历" style="width: 100%">
                    <el-option label="高中" value="high_school" />
                    <el-option label="专科" value="college" />
                    <el-option label="本科" value="bachelor" />
                    <el-option label="硕士" value="master" />
                    <el-option label="博士" value="phd" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="技能特长" required>
              <el-select
                v-model="roadmapForm.skills"
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
                v-model="roadmapForm.interests"
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

            <el-form-item label="首选行业" required>
              <el-select v-model="roadmapForm.preferredIndustry" placeholder="请选择您的首选行业" style="width: 100%">
                <el-option label="互联网/科技" value="tech" />
                <el-option label="金融/银行" value="finance" />
                <el-option label="医疗/健康" value="healthcare" />
                <el-option label="教育" value="education" />
                <el-option label="制造业" value="manufacturing" />
                <el-option label="零售/电商" value="retail" />
                <el-option label="咨询/服务" value="consulting" />
                <el-option label="政府/非盈利" value="government" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="generateRoadmap" :loading="generating">
                生成发展路线图
              </el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-if="roadmapResult" class="result-section">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><Connection /></el-icon> 职业发展路线图：从 {{ roadmapResult.currentLevel }} 到 {{ roadmapResult.targetPosition }}</span>
              <el-button size="small" type="primary" plain @click="saveToPDF">
                <el-icon><Download /></el-icon>
                保存为 PDF
              </el-button>
            </div>
          </template>

          <div class="roadmap-timeline">
            <div class="timeline-header">
              <div class="timeline-years">
                预计用时：约 {{ roadmapResult.timelineYears }} 年
              </div>
            </div>

            <el-timeline>
              <el-timeline-item
                v-for="milestone in roadmapResult.milestones"
                :key="milestone.stage"
                :type="getTimelineItemType(milestone.stage)"
                :color="getTimelineItemColor(milestone.stage)"
                :size="milestone.stage === 1 ? 'large' : 'normal'"
                :hollow="milestone.stage === roadmapResult.milestones.length"
              >
                <div class="timeline-item-content">
                  <div class="milestone-header">
                    <h3 class="milestone-title">{{ milestone.title }}</h3>
                    <span class="milestone-duration">{{ milestone.duration }}</span>
                  </div>
                  
                  <div class="milestone-tasks">
                    <h4>关键任务</h4>
                    <ul>
                      <li v-for="(task, index) in milestone.tasks" :key="index">
                        {{ task }}
                      </li>
                    </ul>
                  </div>
                  
                  <div class="skills-to-acquire">
                    <h4>需掌握的技能</h4>
                    <div class="skill-tags">
                      <el-tag
                        v-for="(skill, index) in milestone.skillsToAcquire"
                        :key="index"
                        class="skill-tag"
                        :type="getTagType(index)"
                      >
                        {{ skill }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>

            <div class="recommendations-section">
              <h3>发展建议</h3>
              <ul class="recommendations-list">
                <li v-for="(recommendation, index) in roadmapResult.recommendations" :key="index">
                  <el-icon color="#409EFF"><Star /></el-icon>
                  <span>{{ recommendation }}</span>
                </li>
              </ul>
            </div>

            <div class="action-buttons">
              <el-button type="primary" @click="goToCareerAnalysis">职业分析</el-button>
              <el-button type="success" @click="goToRecommendation">职业推荐</el-button>
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
import type { 
  CareerRoadmapForm, 
  CareerRoadmapResult, 
  CareerSkill 
} from '@/types/career'
import { 
  submitCareerRoadmap, 
  getCareerSkills 
} from '@/api/career'

const router = useRouter()
const generating = ref(false)
const allSkills = ref<CareerSkill[]>([])

const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const designSkills = computed(() => allSkills.value.filter(skill => skill.category === 'design'))
const managementSkills = computed(() => allSkills.value.filter(skill => skill.category === 'management'))
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

const roadmapForm = reactive<CareerRoadmapForm>({
  currentPosition: '',
  targetPosition: '',
  yearsOfExperience: 1,
  skills: [],
  interests: [],
  education: '',
  preferredIndustry: ''
})

const roadmapResult = ref<CareerRoadmapResult | null>(null)

onMounted(async () => {
  try {
    allSkills.value = await getCareerSkills()
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  }
})

const generateRoadmap = async () => {
  if (!roadmapForm.currentPosition || !roadmapForm.targetPosition || !roadmapForm.education || roadmapForm.skills.length === 0) {
    ElMessage.warning('请填写必要的信息')
    return
  }

  generating.value = true
  try {
    roadmapResult.value = await submitCareerRoadmap(roadmapForm)
    ElMessage.success('路线图生成成功')
    
    // 滚动到结果区域
    setTimeout(() => {
      const resultElement = document.querySelector('.result-section')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  } catch (error) {
    ElMessage.error('生成失败，请重试')
    console.error(error)
  } finally {
    generating.value = false
  }
}

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

const getTimelineItemType = (stage: number) => {
  const types = ['primary', 'success', 'warning', 'danger'] as const
  return types[(stage - 1) % types.length]
}

const getTimelineItemColor = (stage: number) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
  return colors[(stage - 1) % colors.length]
}

const getTagType = (index: number): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = 
    ['success', 'warning', 'info', 'primary', 'danger']
  return types[index % types.length]
}

const saveToPDF = () => {
  ElMessage.success('PDF文件已下载（模拟）')
  // 实际项目中可以使用html2canvas和jsPDF等库实现PDF导出功能
}

const goToCareerAnalysis = () => {
  router.push('/career-planning/analysis')
}

const goToRecommendation = () => {
  router.push('/career-planning/recommendation')
}
</script>

<style scoped>
.career-roadmap {
  padding: 20px;
}

.form-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-section {
  margin-top: 30px;
}

.roadmap-timeline {
  padding: 10px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.timeline-years {
  font-size: 16px;
  font-weight: bold;
  color: #409EFF;
  background-color: #ecf5ff;
  padding: 8px 15px;
  border-radius: 4px;
}

.timeline-item-content {
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.milestone-title {
  font-size: 18px;
  margin: 0;
  color: #303133;
}

.milestone-duration {
  font-size: 14px;
  color: #909399;
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
}

.milestone-tasks h4, .skills-to-acquire h4 {
  font-size: 15px;
  color: #606266;
  margin: 15px 0 10px 0;
}

.milestone-tasks ul {
  padding-left: 20px;
  margin: 0;
}

.milestone-tasks li {
  margin-bottom: 5px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  margin-right: 0;
}

.recommendations-section {
  margin: 30px 0;
  padding: 15px;
  background-color: #f2f6fc;
  border-radius: 4px;
}

.recommendations-section h3 {
  margin-top: 0;
  color: #409EFF;
}

.recommendations-list {
  padding-left: 0;
  list-style-type: none;
}

.recommendations-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 10px;
}

.recommendations-list li .el-icon {
  margin-top: 3px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .milestone-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
