<template>
  <div class="resume-create">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="edit-area">
          <template #header>
            <div class="card-header">
              <span>简历信息</span>
              <el-button type="primary" @click="analyzeResume">AI 分析优化</el-button>
            </div>
          </template>
          
          <el-form :model="resumeForm" label-width="100px">
            <el-divider>基本信息</el-divider>
            <el-form-item label="姓名">
              <el-input v-model="resumeForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="求职意向">
              <el-input v-model="resumeForm.jobTitle" placeholder="请输入求职意向"></el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input v-model="resumeForm.contact" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="resumeForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <el-divider>教育背景</el-divider>
            <div v-for="(edu, index) in resumeForm.education" :key="index" class="education-item">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item :label="'学校名称'">
                    <el-input v-model="edu.school" placeholder="请输入学校名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="'专业'">
                    <el-input v-model="edu.major" placeholder="请输入专业"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item :label="'学历'">
                    <el-select v-model="edu.degree" placeholder="请选择学历">
                      <el-option label="专科" value="专科"></el-option>
                      <el-option label="本科" value="本科"></el-option>
                      <el-option label="硕士" value="硕士"></el-option>
                      <el-option label="博士" value="博士"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="'时间'">
                    <el-date-picker
                      v-model="edu.time"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-button type="danger" @click="removeEducation(index)" v-if="index > 0">删除</el-button>
            </div>
            <el-button type="primary" @click="addEducation">添加教育经历</el-button>

            <el-divider>工作经验</el-divider>
            <div v-for="(exp, index) in resumeForm.experience" :key="index" class="experience-item">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item :label="'公司名称'">
                    <el-input v-model="exp.company" placeholder="请输入公司名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="'职位'">
                    <el-input v-model="exp.position" placeholder="请输入职位"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="工作内容">
                <el-input type="textarea" v-model="exp.description" :rows="4" placeholder="请输入工作内容"></el-input>
              </el-form-item>
              <el-button type="danger" @click="removeExperience(index)" v-if="index > 0">删除</el-button>
            </div>
            <el-button type="primary" @click="addExperience">添加工作经验</el-button>

            <el-divider>技能特长</el-divider>
            <el-form-item label="技能标签">
              <el-tag
                v-for="tag in resumeForm.skills"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
                class="skill-tag"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="input-new-tag"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" @click="showInput">
                + 添加技能
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="preview-area">
          <template #header>
            <div class="card-header">
              <span>预览</span>
              <div>
                <el-button type="success" @click="exportPDF">导出 PDF</el-button>
                <el-button @click="changeTemplate">切换模板</el-button>
              </div>
            </div>
          </template>
          <div class="resume-preview" ref="resumePreview">
            <h1>{{ resumeForm.name }}</h1>
            <h2>{{ resumeForm.jobTitle }}</h2>
            <p>联系方式：{{ resumeForm.contact }}</p>
            <p>邮箱：{{ resumeForm.email }}</p>

            <h3>教育背景</h3>
            <div v-for="edu in resumeForm.education" :key="edu.school">
              <p>{{ edu.school }} - {{ edu.major }}</p>
              <p>{{ edu.degree }} {{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}</p>
            </div>

            <h3>工作经验</h3>
            <div v-for="exp in resumeForm.experience" :key="exp.company">
              <p>{{ exp.company }} - {{ exp.position }}</p>
              <p>{{ exp.description }}</p>
            </div>

            <h3>技能特长</h3>
            <p>{{ resumeForm.skills.join('、') }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="analysisDialogVisible"
      title="AI 简历分析"
      width="50%"
    >
      <div v-loading="analyzing">
        <div v-if="!analyzing && aiSuggestions">
          <el-alert
            :title="aiSuggestions.summary"
            type="success"
            :closable="false"
            class="mb-20"
          ></el-alert>
          
          <el-collapse v-model="activeCollapse">
            <el-collapse-item title="整体评分" name="1">
              <el-rate
                v-model="aiSuggestions.score"
                disabled
                show-score
                text-color="#ff9900"
              ></el-rate>
            </el-collapse-item>
            
            <el-collapse-item title="详细建议" name="2">
              <ul>
                <li v-for="(suggestion, index) in aiSuggestions.suggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </el-collapse-item>

            <el-collapse-item title="行业匹配度" name="3">
              <el-progress
                v-for="(match, index) in aiSuggestions.industryMatch"
                :key="index"
                :percentage="match.score"
                :text="match.industry"
                :color="match.score > 80 ? '#67C23A' : match.score > 60 ? '#E6A23C' : '#F56C6C'"
              ></el-progress>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="analysisDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="applyAISuggestions">
            应用 AI 建议
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import dayjs from 'dayjs'

// State
const inputVisible = ref(false)
const inputValue = ref('')
const resumeForm = reactive({
  name: '',
  jobTitle: '',
  contact: '',
  email: '',
  education: [{
    school: '',
    major: '',
    degree: '',
    time: []
  }],
  experience: [{
    company: '',
    position: '',
    description: ''
  }],
  skills: []
})

const analyzing = ref(false)
const analysisDialogVisible = ref(false)
const activeCollapse = ref(['1', '2', '3'])
const aiSuggestions = ref(null)
const resumePreview = ref(null)

// Methods
const handleClose = (tag: string) => {
  resumeForm.skills.splice(resumeForm.skills.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    resumeForm.skills.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addEducation = () => {
  resumeForm.education.push({
    school: '',
    major: '',
    degree: '',
    time: []
  })
}

const removeEducation = (index: number) => {
  resumeForm.education.splice(index, 1)
}

const addExperience = () => {
  resumeForm.experience.push({
    company: '',
    position: '',
    description: ''
  })
}

const removeExperience = (index: number) => {
  resumeForm.experience.splice(index, 1)
}

const formatDate = (date: Date) => {
  return dayjs(date).format('YYYY.MM')
}

const exportPDF = async () => {
  if (!resumePreview.value) return
  
  try {
    const canvas = await html2canvas(resumePreview.value)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('我的简历.pdf')
    
    ElMessage.success('PDF导出成功！')
  } catch (error) {
    ElMessage.error('PDF导出失败，请重试')
  }
}

const analyzeResume = async () => {
  analysisDialogVisible.value = true
  analyzing.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    aiSuggestions.value = {
      summary: '您的简历整体结构完整，但在某些方面还可以进一步优化',
      score: 4,
      suggestions: [
        '建议在工作经验中多突出具体的成果和数据',
        '可以添加更多与目标职位相关的专业技能',
        '教育背景部分可以补充相关的课程项目经验'
      ],
      industryMatch: [
        { industry: '互联网技术', score: 85 },
        { industry: '人工智能', score: 75 },
        { industry: '数据分析', score: 65 }
      ]
    }
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}

const applyAISuggestions = () => {
  ElMessage.success('已应用 AI 建议')
  analysisDialogVisible.value = false
}

const changeTemplate = () => {
  ElMessage.info('模板切换功能开发中...')
}
</script>

<style scoped>
.resume-create {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-area,
.preview-area {
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.education-item,
.experience-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.skill-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.input-new-tag {
  width: 90px;
  margin-right: 10px;
  vertical-align: bottom;
}

.resume-preview {
  padding: 20px;
  min-height: 800px;
}

.mb-20 {
  margin-bottom: 20px;
}

.resume-preview h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.resume-preview h2 {
  font-size: 18px;
  color: #666;
  margin-bottom: 20px;
}

.resume-preview h3 {
  font-size: 16px;
  margin: 20px 0 10px;
  padding-bottom: 5px;
  border-bottom: 2px solid #1849ea;
}

.resume-preview p {
  margin: 5px 0;
  line-height: 1.6;
}
</style>
