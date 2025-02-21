<template>
  <div class="resume-analysis">
    <!-- 上传区域 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <el-card>
          <div class="upload-area">
            <el-upload
              class="upload-box"
              drag
              action="#"
              :auto-upload="false"
              :on-change="handleFileChange"
              accept=".pdf,.doc,.docx"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 PDF、Word 格式文件，建议文件大小不超过 10MB
                </div>
              </template>
            </el-upload>
            <el-button type="primary" size="large" @click="startAnalysis" :loading="analyzing">
              开始分析
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分析结果 -->
    <el-row :gutter="20" v-if="analysisResult">
      <!-- 左侧：总体评分 -->
      <el-col :span="8">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>简历评分</span>
              <el-tag :type="getScoreType(analysisResult.score)">{{ analysisResult.score }}分</el-tag>
            </div>
          </template>
          <div class="score-details">
            <div class="score-item" v-for="(score, key) in analysisResult.scoreDetails" :key="key">
              <span class="score-label">{{ score.label }}</span>
              <el-progress 
                :percentage="score.value" 
                :color="getProgressColor(score.value)"
              ></el-progress>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 中间：优化建议 -->
      <el-col :span="8">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>优化建议</span>
              <el-button type="primary" text @click="applyAllSuggestions">
                一键应用所有建议
              </el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(suggestion, index) in analysisResult.suggestions"
              :key="index"
              :type="suggestion.type"
              :color="getSuggestionColor(suggestion.priority)"
              :size="suggestion.priority === 'high' ? 'large' : 'normal'"
            >
              <h4>{{ suggestion.title }}</h4>
              <p>{{ suggestion.content }}</p>
              <el-button 
                size="small"
                type="primary"
                text
                @click="applySuggestion(suggestion)"
              >
                应用建议
              </el-button>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧：行业匹配 -->
      <el-col :span="8">
        <el-card class="analysis-card">
          <template #header>
            <div class="card-header">
              <span>行业匹配度</span>
              <el-tooltip content="基于您的技能和经验推荐最适合的行业" placement="top">
                <el-icon><info-filled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="industry-match">
            <div v-for="(match, index) in analysisResult.industryMatch" :key="index" class="match-item">
              <div class="match-info">
                <span class="industry-name">{{ match.industry }}</span>
                <span class="match-score">{{ match.score }}%</span>
              </div>
              <el-progress 
                :percentage="match.score" 
                :color="getProgressColor(match.score)"
              ></el-progress>
              <div class="match-keywords">
                <el-tag 
                  v-for="keyword in match.keywords" 
                  :key="keyword"
                  size="small"
                  class="keyword-tag"
                >
                  {{ keyword }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI 建议对话框 -->
    <el-dialog
      v-model="aiDialogVisible"
      title="AI 优化建议"
      width="50%"
    >
      <div class="ai-suggestions">
        <div class="original-content">
          <h4>原内容</h4>
          <p>{{ currentSuggestion?.original }}</p>
        </div>
        <div class="suggested-content">
          <h4>优化建议</h4>
          <p>{{ currentSuggestion?.suggested }}</p>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="aiDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmApplySuggestion">
            应用建议
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UploadFilled, InfoFilled } from '@element-plus/icons-vue'

// Refs
const analyzing = ref(false)
const analysisResult = ref(null)
const aiDialogVisible = ref(false)
const currentSuggestion = ref(null)

// Methods
const handleFileChange = (file) => {
  console.log('文件已选择:', file)
}

const startAnalysis = async () => {
  analyzing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    analysisResult.value = {
      score: 85,
      scoreDetails: {
        content: { label: '内容完整度', value: 90 },
        format: { label: '格式规范度', value: 85 },
        keywords: { label: '关键词匹配度', value: 80 },
        experience: { label: '经验相关度', value: 85 }
      },
      suggestions: [
        {
          type: 'warning',
          priority: 'high',
          title: '技能描述优化',
          content: '建议在技能描述中添加具体的项目经验和成果数据',
          original: '精通Java开发',
          suggested: '精通Java开发，主导开发过电商平台核心模块，提升系统性能30%'
        },
        {
          type: 'info',
          priority: 'medium',
          title: '教育背景补充',
          content: '可以添加相关的专业课程和学术成果',
          original: '计算机科学与技术专业本科',
          suggested: '计算机科学与技术专业本科，主修数据结构、算法分析、机器学习等课程，发表学术论文2篇'
        }
      ],
      industryMatch: [
        {
          industry: '互联网技术',
          score: 90,
          keywords: ['Java', 'Spring Boot', '微服务']
        },
        {
          industry: '人工智能',
          score: 75,
          keywords: ['机器学习', 'Python', '数据分析']
        },
        {
          industry: '金融科技',
          score: 70,
          keywords: ['支付系统', '安全开发', '高并发']
        }
      ]
    }
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}

const getScoreType = (score: number) => {
  if (score >= 90) return 'success'
  if (score >= 75) return 'warning'
  return 'danger'
}

const getProgressColor = (value: number) => {
  if (value >= 90) return '#67C23A'
  if (value >= 75) return '#E6A23C'
  return '#F56C6C'
}

const getSuggestionColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#F56C6C'
    case 'medium': return '#E6A23C'
    default: return '#909399'
  }
}

const applySuggestion = (suggestion) => {
  currentSuggestion.value = suggestion
  aiDialogVisible.value = true
}

const confirmApplySuggestion = () => {
  ElMessage.success('已应用优化建议')
  aiDialogVisible.value = false
}

const applyAllSuggestions = () => {
  ElMessage.success('已应用所有优化建议')
}
</script>

<style scoped>
.resume-analysis {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.upload-box {
  width: 100%;
  max-width: 500px;
}

.analysis-card {
  height: calc(100vh - 200px);
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-item {
  .score-label {
    display: block;
    margin-bottom: 8px;
    color: #666;
  }
}

.industry-match {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.match-item {
  margin-bottom: 20px;
}

.match-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.industry-name {
  font-weight: 500;
}

.match-score {
  color: #666;
}

.match-keywords {
  margin-top: 8px;
}

.keyword-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

.ai-suggestions {
  .original-content,
  .suggested-content {
    margin-bottom: 20px;
    
    h4 {
      margin-bottom: 10px;
      color: #333;
    }
    
    p {
      color: #666;
      line-height: 1.6;
    }
  }
}
</style>
