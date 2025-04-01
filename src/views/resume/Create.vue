<template>
  <div class="resume-create">
    <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="edit-area">
          <template #header>
            <div class="card-header">
              <span class="card-title">简历信息</span>
              <div class="header-actions">
                <el-button type="primary" @click="analyzeResume" size="small">
                  <el-icon><OfficeBuilding /></el-icon> AI 分析优化
                </el-button>
                <el-button type="danger" @click="confirmClearResumeForm" size="small">
                  <el-icon><Delete /></el-icon> 清空简历
                </el-button>
              </div>
            </div>
          </template>

          <el-form :model="resumeForm" label-width="100px" class="resume-form">
            <el-divider>个人信息</el-divider>
            <el-form-item label="姓名">
              <el-input v-model="resumeForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="resumeForm.gender">
                <el-radio value="男" label="男">男</el-radio>
                <el-radio value="女" label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="求职意向">
              <el-input v-model="resumeForm.jobTitle" placeholder="请输入求职意向"></el-input>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker
                v-model="resumeForm.birthday"
                type="date"
                placeholder="请选择生日"
                value-format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="籍贯">
              <el-input v-model="resumeForm.origin" placeholder="请输入籍贯"></el-input>
            </el-form-item>
            <el-form-item label="现居">
              <el-input v-model="resumeForm.currentResidence" placeholder="请输入现居地"></el-input>
            </el-form-item>
            <el-form-item label="政治面貌">
              <el-select v-model="resumeForm.politicalStatus" placeholder="请选择政治面貌">
                <el-option label="群众" value="群众"></el-option>
                <el-option label="团员" value="团员"></el-option>
                <el-option label="党员" value="党员"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="resumeForm.contact" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="resumeForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>

            <el-divider>荣誉奖励</el-divider>
            <el-form-item label="荣誉奖励">
              <el-input
                type="textarea"
                v-model="resumeForm.honors"
                :rows="4"
                placeholder="请输入荣誉奖励信息"
              ></el-input>
            </el-form-item>

            <el-divider>技能证书</el-divider>
            <el-form-item label="技能证书">
              <el-input
                type="textarea"
                v-model="resumeForm.certifications"
                :rows="4"
                placeholder="请输入技能证书信息"
              ></el-input>
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
                  <el-form-item :label="'时间段'">
                    <el-date-picker
                      v-model="edu.time"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-button type="danger" @click="removeEducation(index)" v-if="index > 0"
                >删除</el-button
              >
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
              <el-form-item label="时间段">
                <el-date-picker
                  v-model="exp.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="工作描述">
                <el-input
                  type="textarea"
                  v-model="exp.description"
                  :rows="4"
                  placeholder="请输入工作内容"
                ></el-input>
              </el-form-item>
              <el-button type="danger" @click="removeExperience(index)" v-if="index > 0"
                >删除</el-button
              >
            </div>
            <el-button type="primary" @click="addExperience">添加工作经验</el-button>

            <el-divider>在校经历</el-divider>
            <el-form-item label="在校经历">
              <el-input
                type="textarea"
                v-model="resumeForm.campusExperience"
                :rows="4"
                placeholder="请输入在校经历"
              ></el-input>
            </el-form-item>

            <el-divider>专业技能</el-divider>
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
              <el-button v-else class="button-new-tag" @click="showInput">+ 添加技能</el-button>
            </el-form-item>

            <el-divider>自我评价</el-divider>
            <el-form-item label="自我评价">
              <el-input
                type="textarea"
                v-model="resumeForm.selfAssessment"
                :rows="4"
                placeholder="请输入自我评价"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="13">
        <el-card class="preview-area">
          <template #header>
            <div class="card-header">
              <span class="card-title">预览</span>
              <div class="header-actions">
                <el-button type="success" @click="exportPDF" size="small">
                  <el-icon><DocumentCopy /></el-icon> 导出 PDF
                </el-button>
                <el-button type="primary" @click="previewResume" size="small">
                  <el-icon><View /></el-icon> 预览效果
                </el-button>
                <el-button @click="changeTemplate" size="small">
                  <el-icon><SwitchButton /></el-icon> 切换模板
                </el-button>

                <el-dialog 
                  v-model="templateDialogVisible" 
                  title="选择简历模板" 
                  width="70%"
                  :z-index="2000"
                  :modal-append-to-body="false"
                  append-to-body
                  class="template-selection-dialog"
                  destroy-on-close
                >
                  <el-row :gutter="20" class="template-grid">
                    <el-col
                      :span="6"
                      :xs="12"
                      :sm="8"
                      :md="6"
                      :lg="6"
                      v-for="template in Object.keys(templateComponents)"
                      :key="template"
                    >
                      <el-card :body-style="{ padding: '0px' }" class="template-card">
                        <div class="template-preview-box">
                          <img :src="getTemplatePreviewImage(template)" class="template-thumbnail" alt="简历模板预览" />
                        </div>
                        <div class="template-info">
                          <h3>{{ getTemplateDisplayName(template) }}</h3>
                          <div class="template-tags">
                            <el-tag size="small" type="info">{{ getTemplateStyle(template) }}</el-tag>
                          </div>
                          <div class="template-actions">
                            <el-button type="primary" @click="selectTemplate(template)" size="small"
                              >选择模板</el-button
                            >
                          </div>
                        </div>
                      </el-card>
                    </el-col>
                  </el-row>
                </el-dialog>
              </div>
            </div>
          </template>
          <div class="resume-preview" ref="resumePreview">
            <component :is="currentTemplate" :resumeForm="resumeForm" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="analysisDialogVisible" title="AI 简历分析" width="50%">
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

            <el-collapse-item title="优化建议" name="2">
              <ul>
                <li v-for="(suggestion, index) in aiSuggestions.suggestions" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </el-collapse-item>

            <el-collapse-item
              title="修改建议"
              name="3"
              v-if="aiSuggestions && aiSuggestions.revisions && aiSuggestions.revisions.length"
            >
              <div
                v-for="(revision, index) in aiSuggestions.revisions"
                :key="index"
                class="revision-item"
              >
                <h4>{{ revision.section }}</h4>
                <template v-if="Array.isArray(revision.suggestion)">
                  <div
                    v-for="(item, i) in revision.suggestion"
                    :key="i"
                    class="revision-comparison"
                  >
                    <template v-if="isSuggestionItemTemplate(item)">
                      <div class="original-content">
                        <h5>原内容:</h5>
                        <p>{{ item.original }}</p>
                      </div>
                      <div class="optimized-content">
                        <h5>优化建议:</h5>
                        <p>{{ item.optimized }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <p>{{ item }}</p>
                    </template>
                  </div>
                </template>
                <p v-else>{{ revision.suggestion }}</p>
              </div>
            </el-collapse-item>

            <el-collapse-item
              title="行业匹配度"
              name="4"
              v-if="aiSuggestions.industryMatch && aiSuggestions.industryMatch.length"
            >
              <el-progress
                v-for="(match, index) in aiSuggestions.industryMatch"
                :key="index"
                :percentage="match.score"
                :text="match.industry"
                :color="getProgressColor(match.score)"
                class="industry-match-item"
              ></el-progress>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="analysisDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="applyAISuggestions"> 应用 AI 建议 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="previewDialogVisible"
      title="简历预览"
      width="60%"
      :z-index="2000"
      :modal-append-to-body="false"
      append-to-body
      modal-class="preview-modal"
      :overlay-class="'preview-overlay'"
      align-center
      class="resume-preview-dialog"
    >
      <div class="resume-preview-dialog-content">
        <component :is="currentTemplate" :resumeForm="resumeForm" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { templateConfig } from '@/components/Template/templateConfig'
import { analyzeResume as analyzeResumeApi } from '@/api/template'
import { 
  Delete, 
  DocumentCopy, 
  View, 
  SwitchButton,
  OfficeBuilding
} from '@element-plus/icons-vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import dayjs from 'dayjs'

// 修复模板相关的类型
interface TemplateComponents {
  [key: string]: any
}

// 将 templateComponents 定义为具体类型
const templateComponents = templateConfig as unknown as TemplateComponents

interface SuggestionItem {
  original: string
  optimized: string
}

// 类型谓词函数，用于判断一个对象是否是 SuggestionItem 类型
function isSuggestionItem(suggestion: any): suggestion is SuggestionItem {
  return (
    typeof suggestion === 'object' &&
    suggestion !== null &&
    'original' in suggestion &&
    'optimized' in suggestion &&
    typeof suggestion.original === 'string' &&
    typeof suggestion.optimized === 'string'
  )
}

interface AISuggestions {
  summary: string
  score: number
  suggestions: string[]
  revisions: Array<{
    section: string
    suggestion: string | string[] | SuggestionItem[]
  }>
  industryMatch: Array<{
    industry: string
    score: number
  }>
}

interface ResumeForm {
  name: string
  gender: string
  jobTitle: string
  birthday: string | Date
  origin: string
  currentResidence: string
  politicalStatus: string
  contact: string
  email: string
  honors: string
  certifications: string
  education: {
    school: string
    major: string
    degree: string
    time: [Date, Date]
  }[]
  experience: {
    company: string
    position: string
    description: string
    time: [Date, Date]
  }[]
  campusExperience: string
  skills: string[]
  selfAssessment: string
}

const route = useRoute()
const currentTemplate = ref(null) // 初始化为 null
const inputVisible = ref(false)
const inputValue = ref('')
const resumeForm = ref<ResumeForm>({
  name: '张三',
  gender: '男',
  jobTitle: '前端开发工程师',
  birthday: '1995-05-15',
  origin: '北京',
  currentResidence: '上海',
  politicalStatus: '团员',
  contact: '13800138000',
  email: 'zhangsan@example.com',
  honors: '2022年获得公司优秀员工奖',
  certifications: 'PMP认证，前端开发高级工程师',
  education: [
    {
      school: '北京大学',
      major: '计算机科学与技术',
      degree: '本科',
      time: [new Date('2013-09-01'), new Date('2017-06-30')]
    }
  ],
  experience: [
    {
      company: '腾讯科技',
      position: '前端开发工程师',
      description: '负责公司核心产品的前端开发工作，使用Vue.js框架',
      time: [new Date('2018-07-01'), new Date('2021-12-31')]
    },
    {
      company: '阿里巴巴',
      position: '高级前端开发工程师',
      description: '负责电商平台的前端架构设计和开发',
      time: [new Date('2022-01-01'), new Date()]
    }
  ],
  campusExperience: '在校期间担任学生会技术部部长，组织多次技术分享会',
  skills: ['Vue.js', 'React', 'TypeScript', 'Node.js'],
  selfAssessment: '5年前端开发经验，熟练掌握主流前端技术栈，具有良好的团队协作能力和沟通能力'
})

const analyzing = ref(false)
const analysisDialogVisible = ref(false)
const activeCollapse = ref(['1', '2', '3'])
const aiSuggestions = ref<AISuggestions | null>(null)
const resumePreview = ref(null)

// 根据路由参数加载对应的模板
const selectTemplate = async (template: string) => {
  await loadTemplate(template)
  templateDialogVisible.value = false
}

// 定义模板加载函数
const loadTemplate = async (templateName?: string) => {
  const template = templateName || 'muban1' // 使用小写模板名称
  try {
    // 安全地加载组件
    const templateKey = template.toLowerCase() // 确保使用小写键名
    if (templateKey in templateComponents) {
      const module = await templateComponents[templateKey]()
      currentTemplate.value = module.default
    } else {
      // 回退到默认模板
      const fallback = await templateComponents['muban1']()
      currentTemplate.value = fallback.default
    }
  } catch (error) {
    console.error('加载模板失败:', error)
    try {
      // 二次尝试加载默认模板
      const fallback = await templateComponents['muban1']()
      currentTemplate.value = fallback.default
    } catch (err) {
      console.error('无法加载默认模板:', err)
      ElMessage.error('模板加载失败，请刷新页面重试')
    }
  }
}

// 使用正确的 watch 方法
watch(
  () => route.params.template || 'muban1',
  newTemplate => {
    loadTemplate(String(newTemplate).toLowerCase()) // 确保转换为小写字符串
  },
  { immediate: true }
)

const handleClose = (tag: string) => {
  resumeForm.value.skills = resumeForm.value.skills.filter(t => t !== tag)
}

const showInput = () => {
  inputVisible.value = true
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    resumeForm.value.skills.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const addEducation = () => {
  resumeForm.value.education.push({
    school: '',
    major: '',
    degree: '',
    time: [new Date(), new Date()]
  })
}

const removeEducation = (index: number) => {
  resumeForm.value.education.splice(index, 1)
}

const addExperience = () => {
  resumeForm.value.experience.push({
    company: '',
    position: '',
    description: '',
    time: [new Date(), new Date()]
  })
}

const removeExperience = (index: number) => {
  resumeForm.value.experience.splice(index, 1)
}

const exportPDF = async () => {
  if (!resumePreview.value) return

  try {
    ElMessage.info('正在生成PDF，请稍候...')
    
    // 确保模板完全渲染
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 直接使用DOM节点，而不是克隆节点
    const element = resumePreview.value
    
    // 使用更稳定的配置
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许跨域资源
      logging: false, // 减少日志输出
      allowTaint: true, // 允许污染
      backgroundColor: '#ffffff', // 设置白色背景
      ignoreElements: (element) => {
        // 忽略某些可能导致问题的元素
        return element.tagName === 'IFRAME' ||
          element.classList.contains('ignore-pdf')
      }
    })

    // 创建PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0)
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save('我的简历.pdf')

    ElMessage.success('PDF导出成功！')
  } catch (error: any) {
    console.error('PDF导出失败:', error)
    ElMessage.error(`PDF导出失败: ${error.message || '未知错误'}`)
  }
}

const analyzeResume = async () => {
  analysisDialogVisible.value = true
  analyzing.value = true

  try {
    // 准备数据 - 将Date对象转换为字符串
    const formData = {
      ...resumeForm.value,
      birthday: resumeForm.value.birthday
        ? dayjs(resumeForm.value.birthday).format('YYYY-MM-DD')
        : '',
      education: resumeForm.value.education.map(edu => ({
        ...edu,
        time: [
          dayjs(edu.time[0]).format('YYYY-MM-DD'),
          dayjs(edu.time[1]).format('YYYY-MM-DD')
        ] as [string, string]
      })),
      experience: resumeForm.value.experience.map(exp => ({
        ...exp,
        time: [
          dayjs(exp.time[0]).format('YYYY-MM-DD'),
          dayjs(exp.time[1]).format('YYYY-MM-DD')
        ] as [string, string]
      }))
    }

    // 调用API
    const response = await analyzeResumeApi(formData)

    // 处理API响应 - 提取aiSuggestions数据
    console.log('API Response:', response)

    // 提取aiSuggestions数据
    if (response.data && response.data.aiSuggestions) {
      // 转换 API 响应数据中的字符串数字为实际数字
      const apiData = response.data.aiSuggestions

      aiSuggestions.value = {
        summary: apiData.summary,
        score: typeof apiData.score === 'string' ? parseFloat(apiData.score) : apiData.score,
        suggestions: apiData.suggestions,
        revisions: apiData.revisions,
        industryMatch: apiData.industryMatch.map(match => ({
          industry: match.industry,
          score: typeof match.score === 'string' ? parseFloat(match.score) : match.score
        }))
      }
    } else {
      throw new Error('响应数据格式不正确')
    }
  } catch (error) {
    console.error('分析失败:', error)
    ElMessage.error('简历分析失败，请稍后再试')
  } finally {
    analyzing.value = false
  }
}

const applyAISuggestions = () => {
  if (!aiSuggestions.value) {
    ElMessage.warning('没有可用的 AI 建议')
    return
  }

  // 查找各个部分的修改建议
  const revisions = aiSuggestions.value.revisions || []

  // 处理工作经历修改
  const workExperienceSuggestion = revisions.find(rev => rev.section === '工作经历')
  if (workExperienceSuggestion && Array.isArray(workExperienceSuggestion.suggestion)) {
    // 获取每个工作经历的优化建议
    const suggestions = workExperienceSuggestion.suggestion as SuggestionItem[]

    // 遍历建议，根据原始内容匹配对应的工作经历并应用优化
    suggestions.forEach(suggestion => {
      if ('original' in suggestion && 'optimized' in suggestion) {
        // 查找匹配的工作经历
        const experienceIndex = resumeForm.value.experience.findIndex(
          exp => exp.description.trim() === suggestion.original.trim()
        )

        // 如果找到匹配的工作经历，应用优化建议
        if (experienceIndex !== -1) {
          resumeForm.value.experience[experienceIndex].description = suggestion.optimized
        }
      }
    })
  }

  // 处理教育经历修改
  const educationSuggestion = revisions.find(rev => rev.section === '教育经历')
  if (educationSuggestion && Array.isArray(educationSuggestion.suggestion)) {
    // 获取教育经历的优化建议
    const suggestions = educationSuggestion.suggestion as SuggestionItem[]

    // 尝试匹配校园经历并应用优化
    suggestions.forEach(suggestion => {
      if ('original' in suggestion && 'optimized' in suggestion) {
        // 如果原始内容与校园经历匹配
        if (resumeForm.value.campusExperience.includes(suggestion.original)) {
          // 替换匹配的部分
          resumeForm.value.campusExperience = resumeForm.value.campusExperience.replace(
            suggestion.original,
            suggestion.optimized
          )
        }
      }
    })
  }

  // 处理在校经历修改
  const campusExperienceSuggestion = revisions.find(rev => rev.section === '在校经历')
  if (campusExperienceSuggestion) {
    if (Array.isArray(campusExperienceSuggestion.suggestion)) {
      // 处理数组类型的建议
      campusExperienceSuggestion.suggestion.forEach(suggestion => {
        if (isSuggestionItem(suggestion)) {
          // 如果是包含original和optimized的对象
          if (resumeForm.value.campusExperience.includes(suggestion.original)) {
            resumeForm.value.campusExperience = resumeForm.value.campusExperience.replace(
              suggestion.original,
              suggestion.optimized
            )
          }
        } else if (typeof suggestion === 'string') {
          // 如果是字符串类型
          resumeForm.value.campusExperience = suggestion
        }
      })
    } else if (typeof campusExperienceSuggestion.suggestion === 'string') {
      // 处理字符串类型的建议
      resumeForm.value.campusExperience = campusExperienceSuggestion.suggestion
    }
  }

  // 处理自我评价修改
  const selfAssessmentSuggestion = revisions.find(rev => rev.section === '自我评价')
  if (selfAssessmentSuggestion) {
    if (Array.isArray(selfAssessmentSuggestion.suggestion)) {
      // 处理数组类型的建议
      const optimizedSuggestions: string[] = []

      selfAssessmentSuggestion.suggestion.forEach(suggestion => {
        if (isSuggestionItem(suggestion)) {
          // 如果是包含original和optimized的对象
          optimizedSuggestions.push(suggestion.optimized)
        } else if (typeof suggestion === 'string') {
          // 如果是字符串类型
          optimizedSuggestions.push(suggestion)
        }
      })

      if (optimizedSuggestions.length > 0) {
        resumeForm.value.selfAssessment = optimizedSuggestions.join('\n\n')
      }
    } else if (typeof selfAssessmentSuggestion.suggestion === 'string') {
      // 处理字符串类型的建议
      resumeForm.value.selfAssessment = selfAssessmentSuggestion.suggestion
    }
  }

  ElMessage.success('已应用 AI 建议')
  analysisDialogVisible.value = false
}

const templateDialogVisible = ref(false)
const previewDialogVisible = ref(false)

const changeTemplate = () => {
  templateDialogVisible.value = true
}

const previewResume = () => {
  previewDialogVisible.value = true
}

const confirmClearResumeForm = () => {
  ElMessageBox.confirm('确定要清空简历信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      clearResumeForm()
      ElMessage.success('简历信息已清空')
    })
    .catch(() => {
      ElMessage.info('已取消清空操作')
    })
}

const clearResumeForm = () => {
  resumeForm.value = {
    name: '',
    gender: '',
    jobTitle: '',
    birthday: '1995-05-15',
    origin: '',
    currentResidence: '',
    politicalStatus: '',
    contact: '',
    email: '',
    honors: '',
    certifications: '',
    education: [
      {
        school: '',
        major: '',
        degree: '',
        time: [new Date(), new Date()]
      }
    ],
    experience: [
      {
        company: '',
        position: '',
        description: '',
        time: [new Date(), new Date()]
      }
    ],
    campusExperience: '',
    skills: [],
    selfAssessment: ''
  }
}

// 返回进度条颜色
const getProgressColor = (score: number): string => {
  if (score > 80) return '#67C23A'
  if (score > 60) return '#E6A23C'
  return '#F56C6C'
}

// 新增的类型守卫函数
function isSuggestionItemTemplate(item: any): item is SuggestionItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'original' in item &&
    'optimized' in item &&
    typeof item.original === 'string' &&
    typeof item.optimized === 'string'
  )
}

// 获取模板预览图片
const getTemplatePreviewImage = (templateKey: string) => {
  const templateIndex = parseInt(templateKey.replace('muban', '')) || 1
  const validIndex = templateIndex > 0 && templateIndex <= 10 ? templateIndex : 1
  
  // 使用相对于公共目录的路径
  return `/template_imgs/${validIndex}.png`
}

// 获取模板显示名称
const getTemplateDisplayName = (templateKey: string) => {
  const nameMap: Record<string, string> = {
    muban1: '清新简约风格',
    muban2: '专业技术风格',
    muban3: '商务精英风格',
    muban4: '创意设计风格',
    muban5: '学术研究风格',
    muban6: '市场营销风格',
    muban7: '医疗护理风格',
    muban8: '教育培训风格',
    muban9: '工程技术风格',
    muban10: '金融财务风格'
  }
  return nameMap[templateKey.toLowerCase()] || templateKey
}

// 获取模板风格标签
const getTemplateStyle = (templateKey: string) => {
  const styleMap: Record<string, string> = {
    muban1: '简约风格',
    muban2: '技术风格',
    muban3: '商务风格',
    muban4: '创意风格',
    muban5: '学术风格',
    muban6: '营销风格',
    muban7: '医疗风格',
    muban8: '教育风格',
    muban9: '工程风格',
    muban10: '金融风格'
  }
  return styleMap[templateKey.toLowerCase()] || '标准风格'
}

// 暴露函数给模板使用
defineExpose({
  resumeForm,
  currentTemplate,
  analyzing,
  analysisDialogVisible,
  activeCollapse,
  aiSuggestions,
  templateDialogVisible,
  previewDialogVisible,
  exportPDF,
  analyzeResume,
  applyAISuggestions,
  getProgressColor,
  getTemplatePreviewImage,
  getTemplateDisplayName,
  getTemplateStyle,
  templateComponents,
  selectTemplate,
  loadTemplate,
  handleClose,
  showInput,
  handleInputConfirm,
  addEducation,
  removeEducation,
  addExperience,
  removeExperience,
  changeTemplate,
  previewResume,
  confirmClearResumeForm,
  clearResumeForm,
  isSuggestionItemTemplate
})
</script>

<style scoped>
.resume-create {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.card-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #409EFF;
  border-radius: 2px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.edit-area,
.preview-area {
  height: calc(100vh - 120px);
  overflow-y: auto;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.edit-area:hover,
.preview-area:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.resume-form :deep(.el-divider__text) {
  background-color: #f8f9fa;
  color: #409EFF;
  font-weight: 600;
  font-size: 15px;
}

.resume-form :deep(.el-form-item__label) {
  font-weight: 500;
}

.education-item,
.experience-item {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #f8f9fa;
  position: relative;
  transition: all 0.3s ease;
}

.education-item:hover,
.experience-item:hover {
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  border-color: #dcdfe6;
}

.education-item .el-button,
.experience-item .el-button {
  position: absolute;
  right: 15px;
  bottom: 15px;
}

.skill-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  transform: translateY(-2px);
}

.input-new-tag {
  width: 120px;
  margin-right: 10px;
  vertical-align: bottom;
}

.resume-preview {
  padding: 20px;
  min-height: 800px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

/* 创建简历的按钮样式 */
.el-button--primary {
  background-color: #409EFF;
  border-color: #409EFF;
}

.el-button--danger {
  background-color: #F56C6C;
  border-color: #F56C6C;
}

.el-button--success {
  background-color: #67C23A;
  border-color: #67C23A;
}

.el-button--primary:hover,
.el-button--primary:focus {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.el-button--danger:hover,
.el-button--danger:focus {
  background-color: #f78989;
  border-color: #f78989;
}

.el-button--success:hover,
.el-button--success:focus {
  background-color: #85ce61;
  border-color: #85ce61;
}

.preview-overlay {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(2px);
}

.preview-modal {
  border-radius: 8px;
  overflow: hidden;
}

.resume-preview-dialog :deep(.el-dialog) {
  max-width: 90vw;
  max-height: 90vh;
  margin: 5vh auto !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.resume-preview-dialog-content {
  padding: 20px;
  background-color: white;
  border-radius: 4px;
  transform: scale(0.85);
  transform-origin: center;
  margin: 0 auto;
  max-height: 70vh;
  overflow-y: auto;
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

.template-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  height: 240px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.template-card:hover {
  box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
  border-color: #409eff;
}

.template-preview-box {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  overflow: hidden;
}

.template-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.template-preview-box:hover .template-thumbnail {
  transform: scale(1.05);
}

.template-info {
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
}

.template-info h3 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #303133;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.template-tags {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.template-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 调整栅格间距 */
.el-row--gutter-20 {
  margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .el-col {
    margin-bottom: 15px;
  }

  .template-card {
    margin-bottom: 15px;
  }
}

.industry-match-item {
  margin-bottom: 15px;
}

.revision-item {
  margin-bottom: 20px;
  padding: 10px;
  border-left: 3px solid #409eff;
  background-color: #f8f9fa;
}

.revision-item h4 {
  margin-top: 0;
  color: #409eff;
  font-weight: 600;
}

.revision-comparison {
  margin-bottom: 15px;
  border-bottom: 1px dashed #e0e0e0;
  padding-bottom: 10px;
}

.original-content,
.optimized-content {
  margin-bottom: 10px;
}

.original-content h5 {
  margin: 5px 0;
  color: #909399;
  font-size: 14px;
}

.optimized-content h5 {
  margin: 5px 0;
  color: #67c23a;
  font-size: 14px;
}

.optimized-content p {
  background-color: #f0f9eb;
  padding: 8px;
  border-radius: 4px;
  border-left: 2px solid #67c23a;
}

.revision-item ul {
  padding-left: 20px;
  margin-bottom: 0;
}

.revision-item li {
  margin-bottom: 8px;
}

.template-selection-dialog :deep(.el-dialog) {
  max-width: 90vw;
  max-height: 90vh;
  margin: 5vh auto !important;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.template-selection-dialog :deep(.el-dialog__body) {
  padding: 20px;
  max-height: 65vh;
  overflow-y: auto;
  scrollbar-width: thin;
}

.template-selection-dialog :deep(.el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.template-selection-dialog :deep(.el-dialog__footer) {
  padding: 15px 20px;
  border-top: 1px solid #f0f0f0;
  background-color: #f8f9fa;
}

.template-grid {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  margin: 0 -10px;
}
</style>
