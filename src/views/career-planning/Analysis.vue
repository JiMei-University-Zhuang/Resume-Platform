<template>
  <div class="career-analysis">
    <el-card class="analysis-card">
      <template #header>
        <div class="card-header">
          <span>职业倾向分析</span>
        </div>
      </template>

      <el-form :model="analysisForm" label-width="120px">
        <el-form-item label="教育背景">
          <el-select v-model="analysisForm.education" placeholder="请选择您的学历">
            <el-option label="高中" value="high_school" />
            <el-option label="专科" value="college" />
            <el-option label="本科" value="bachelor" />
            <el-option label="硕士" value="master" />
            <el-option label="博士" value="phd" />
          </el-select>
        </el-form-item>

        <el-form-item label="专业方向">
          <el-input v-model="analysisForm.major" placeholder="请输入您的专业" />
        </el-form-item>

        <el-form-item label="技能特长">
          <el-select
            v-model="analysisForm.skills"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入您的技能特长"
          >
            <el-option label="编程开发" value="programming" />
            <el-option label="数据分析" value="data_analysis" />
            <el-option label="产品设计" value="product_design" />
            <el-option label="市场营销" value="marketing" />
            <el-option label="项目管理" value="project_management" />
          </el-select>
        </el-form-item>

        <el-form-item label="兴趣爱好">
          <el-select
            v-model="analysisForm.interests"
            multiple
            filterable
            allow-create
            placeholder="请选择或输入您的兴趣爱好"
          >
            <el-option label="技术研究" value="tech_research" />
            <el-option label="创意设计" value="creative_design" />
            <el-option label="数据分析" value="data_analysis" />
            <el-option label="人际沟通" value="communication" />
            <el-option label="团队协作" value="teamwork" />
          </el-select>
        </el-form-item>

        <el-form-item label="工作经验">
          <el-input-number
            v-model="analysisForm.workExperience"
            :min="0"
            :max="50"
            placeholder="工作年限"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAnalysis" :loading="analyzing">
            开始分析
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="analysisResult" class="analysis-result">
        <h3>分析结果</h3>
        <el-divider />
        <div class="result-content">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="最适合的职业方向">
              {{ analysisResult.recommendedCareer }}
            </el-descriptions-item>
            <el-descriptions-item label="职业优势">
              {{ analysisResult.advantages }}
            </el-descriptions-item>
            <el-descriptions-item label="发展建议">
              {{ analysisResult.suggestions }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { CareerAnalysis } from '@/types/career'

interface AnalysisForm {
  education: string
  major: string
  skills: string[]
  interests: string[]
  workExperience: number
}

const analyzing = ref(false)
const analysisForm = reactive<AnalysisForm>({
  education: '',
  major: '',
  skills: [],
  interests: [],
  workExperience: 0
})

const analysisResult = ref<CareerAnalysis | null>(null)

const submitAnalysis = async () => {
  if (!analysisForm.education || !analysisForm.major) {
    ElMessage.warning('请填写必要的信息')
    return
  }

  analyzing.value = true
  try {
    // TODO: 调用后端AI职业分析接口
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟分析结果
    analysisResult.value = {
      recommendedCareer: '软件开发工程师',
      advantages: '具备扎实的技术基础，对编程有浓厚兴趣，适合从事技术开发工作。',
      suggestions: '建议继续深入学习新技术，参与开源项目，提升系统设计能力。'
    } as CareerAnalysis

    ElMessage.success('分析完成')
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}
</script>

<style scoped>
.career-analysis {
  padding: 20px;
}

.analysis-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-result {
  margin-top: 30px;
}

.result-content {
  margin-top: 20px;
}

:deep(.el-select) {
  width: 100%;
}
</style>
