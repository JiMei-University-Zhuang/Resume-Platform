<template>
  <div class="resume-create">
    <!-- 顶部标题栏 -->
    <div class="page-header">
      <h1 class="page-title">简历创建</h1>
      <div class="header-actions">
        <el-button type="primary" size="large" @click="changeTemplate">
          <el-icon><Document /></el-icon>
          切换模板
        </el-button>
        <el-button type="success" size="large" @click="exportPDF">
          <el-icon><Download /></el-icon>
          导出PDF
        </el-button>
        <el-button type="warning" size="large" @click="previewResume">
          <el-icon><View /></el-icon>
          预览
        </el-button>
        <el-button type="danger" size="large" @click="confirmClearResumeForm">
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="11">
        <el-card class="edit-area">
          <template #header>
            <div class="card-header">
              <span class="card-title">简历信息</span>
              <div class="header-actions">
                <el-button
                  class="analyze-button"
                  type="primary"
                  @click="analyzeResume"
                  size="small"
                  style="background-color: #3182ce; color: white; border-color: #3182ce"
                >
                  <el-icon><OfficeBuilding /></el-icon> AI 分析优化
                </el-button>
              </div>
            </div>
          </template>

          <div class="resume-type-selector">
            <span class="resume-type-label">简历类型:</span>
            <el-radio-group
              v-model="currentResumeType"
              size="small"
              @change="val => changeResumeType(val as string)"
            >
              <el-radio-button v-for="type in resumeTypes" :key="type.value" :label="type.value">
                {{ type.label }}
              </el-radio-button>
            </el-radio-group>
          </div>

          <el-form :model="resumeForm" label-width="100px" class="resume-form">
            <el-divider>个人信息</el-divider>
            <el-form-item label="姓名">
              <el-input v-model="resumeForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="resumeForm.gender" size="small">
                <el-radio-button label="男">男</el-radio-button>
                <el-radio-button label="女">女</el-radio-button>
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
            </div>
            <div class="action-buttons">
              <el-button type="primary" @click="addEducation">添加教育经历</el-button>
              <template
                v-for="(edu, eduIndex) in resumeForm.education"
                :key="'del-edu-' + eduIndex"
              >
                <el-button type="danger" @click="removeEducation(eduIndex)" v-if="eduIndex > 0"
                  >删除 {{ edu.school || '教育经历' + (eduIndex + 1) }}</el-button
                >
              </template>
            </div>

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
            </div>
            <div class="action-buttons">
              <el-button type="primary" @click="addExperience">添加工作经验</el-button>
              <template
                v-for="(exp, expIndex) in resumeForm.experience"
                :key="'del-exp-' + expIndex"
              >
                <el-button type="danger" @click="removeExperience(expIndex)" v-if="expIndex > 0"
                  >删除 {{ exp.company || '工作经验' + (expIndex + 1) }}</el-button
                >
              </template>
            </div>

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
              <div class="skill-tags-container">
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
              </div>
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
                <el-button type="primary" @click="previewResume" size="small">
                  <el-icon><View /></el-icon> 预览效果
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
                          <img
                            :src="getTemplatePreviewImage(template)"
                            class="template-thumbnail"
                            alt="简历模板预览"
                          />
                        </div>
                        <div class="template-info">
                          <h3>{{ getTemplateDisplayName(template) }}</h3>
                          <div class="template-tags">
                            <el-tag size="small" type="info">{{
                              getTemplateStyle(template)
                            }}</el-tag>
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
import { View, OfficeBuilding, Document, Download, Delete } from '@element-plus/icons-vue'
import templateAdapter from '@/components/Template/template-adapter'

import { ref, watch, onMounted, nextTick } from 'vue'
import { ElMessageBox } from 'element-plus'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import dayjs from 'dayjs'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: '.header-actions',
      popover: {
        title: '顶部操作区',
        description: '这里提供了模板切换、导出PDF、预览和清空等常用操作',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.resume-type-selector',
      popover: {
        title: '选择简历类型',
        description: '根据您的求职需求选择合适的简历类型，系统会为您推荐相应的内容格式',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '.resume-form',
      popover: {
        title: '个人信息',
        description: '填写基本的个人信息，包括姓名、性别、联系方式等',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.education-item',
      popover: {
        title: '教育经历',
        description: '添加您的学历信息，包括学校、专业、学位等',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.experience-item',
      popover: {
        title: '工作经验',
        description: '详细描述您的工作经历，突出重要成就和职责',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.skill-tags-container',
      popover: {
        title: '技能标签',
        description: '添加您掌握的专业技能，让雇主快速了解您的能力',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.analyze-button',
      popover: {
        title: 'AI优化',
        description: '利用 AI 技术优化简历内容，提高可读性和吸引力',
        side: 'right',
        align: 'start'
      }
    },
    {
      element: '.resume-preview',
      popover: {
        title: '实时预览',
        description: '在右侧可以实时预览简历效果，帮助您及时调整内容和布局',
        side: 'right',
        align: 'start'
      }
    },
    { popover: { title: '开始创建', description: '现在，让我们开始创建您的专业简历吧！' } }
  ]
})

// 在组件挂载后启动导览
onMounted(() => {
  const hasSeenCreateGuide = localStorage.getItem('hasSeenCreateGuide')
  if (!hasSeenCreateGuide) {
    nextTick(() => {
      setTimeout(() => {
        driverObj.drive()
        localStorage.setItem('hasSeenCreateGuide', 'true')
      }, 500)
    })
  }
})

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

const route = useRoute()
const currentTemplate = ref(null) // 初始化为 null
const inputVisible = ref(false)
const inputValue = ref('')

// 定义简历类型
const resumeTypes = [
  { label: '应届生简历', value: 'graduate' },
  { label: '技术岗简历', value: 'tech' },
  { label: '管理岗简历', value: 'management' },
  { label: '市场营销简历', value: 'marketing' },
  { label: '财务会计简历', value: 'finance' }
]

// 当前选择的简历类型
const currentResumeType = ref('tech')

// 定义不同类型简历的初始数据模板
const resumeTemplates = {
  graduate: {
    name: '李明',
    gender: '男',
    jobTitle: '应届毕业生求职',
    birthday: '2000-06-15',
    origin: '广州',
    currentResidence: '广州',
    politicalStatus: '团员',
    contact: '13800138001',
    email: 'liming@example.com',
    honors: '校级优秀毕业生\n学业奖学金二等奖\n英语四六级证书',
    certifications: '计算机等级证书二级\n大学生创新创业项目结项证书',
    education: [
      {
        school: '华南理工大学',
        major: '电子信息工程',
        degree: '本科',
        time: [new Date('2019-09-01'), new Date('2023-06-30')]
      }
    ],
    experience: [
      {
        company: '广州智能科技有限公司',
        position: '前端开发实习生',
        description:
          '参与公司产品前端页面的开发和维护，使用Vue.js框架进行开发，配合后端完成数据交互功能。',
        time: [new Date('2022-07-01'), new Date('2022-08-31')]
      }
    ],
    campusExperience:
      '担任班级学习委员，负责组织学习交流活动\n参与校园科技创新大赛，获得三等奖\n参加志愿者活动，累计服务时长超过50小时',
    skills: ['HTML/CSS', 'JavaScript', 'Vue.js', 'Python'],
    selfAssessment:
      '作为一名即将毕业的学生，我具有扎实的专业知识基础和良好的学习能力，对新技术有浓厚的兴趣。在校期间积极参与各类实践活动，培养了团队协作和沟通能力。工作认真负责，有较强的适应能力和抗压能力。'
  },
  tech: {
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
        description:
          '【情境】面对日益增长的用户需求及市场竞争压力，【任务】我被委任为腾讯科技核心产品的主要前端开发者之一，负责提升用户体验并优化性能。【行动】利用Vue.js框架重构了多个关键页面，引入了TypeScript提高代码质量，并实施了一系列性能优化措施。【成果】最终实现了加载速度提升30%，用户满意度提高了15%。',
        time: [new Date('2018-07-01'), new Date('2021-12-31')]
      },
      {
        company: '阿里巴巴',
        position: '高级前端开发工程师',
        description:
          '【情境】电商平台面临用户体验不一致和性能瓶颈问题，【任务】作为前端架构师，负责制定前端技术标准并带领团队进行系统重构。【行动】设计并实施了组件化开发流程，建立了严格的代码审查机制，优化了前端构建流程。【成果】重构后的系统性能提升40%，开发效率提高25%，用户转化率提升10%。',
        time: [new Date('2022-01-01'), new Date()]
      }
    ],
    campusExperience: '在校期间担任学生会技术部部长，组织多次技术分享会',
    skills: ['Vue.js', 'React', 'TypeScript', 'Node.js', 'Webpack', 'Docker'],
    selfAssessment:
      '5年前端开发经验，熟练掌握主流前端技术栈，具有良好的团队协作能力和沟通能力。对新技术有浓厚兴趣，能快速学习并应用到实际项目中。注重代码质量和用户体验，善于解决复杂技术问题。有带领团队经验，能够进行技术架构设计和技术选型。'
  },
  management: {
    name: '王丽',
    gender: '女',
    jobTitle: '项目经理',
    birthday: '1990-03-25',
    origin: '南京',
    currentResidence: '深圳',
    politicalStatus: '党员',
    contact: '13800138002',
    email: 'wangli@example.com',
    honors: '深圳市优秀管理者\n公司年度管理创新奖',
    certifications: 'PMP认证\nScrumMaster认证\nMBA学位',
    education: [
      {
        school: '复旦大学',
        major: '工商管理',
        degree: '硕士',
        time: [new Date('2012-09-01'), new Date('2015-06-30')]
      },
      {
        school: '南京大学',
        major: '计算机科学',
        degree: '本科',
        time: [new Date('2008-09-01'), new Date('2012-06-30')]
      }
    ],
    experience: [
      {
        company: '华为技术有限公司',
        position: '高级项目经理',
        description:
          '【情境】公司大型跨国项目面临进度延迟和团队协作问题，【任务】被任命为项目经理负责扭转局面，【行动】重组团队结构，优化工作流程，建立清晰的沟通机制和里程碑追踪系统，【成果】项目提前一个月完成，客户满意度达95%，为公司带来3000万收入。',
        time: [new Date('2018-03-01'), new Date()]
      },
      {
        company: '中兴通讯',
        position: '项目主管',
        description:
          '【情境】多个研发项目并行推进，资源冲突严重，【任务】作为项目主管统筹资源并确保项目按时交付，【行动】实施敏捷项目管理方法，建立资源共享机制，优化团队协作模式，【成果】团队生产力提升35%，所有项目按期交付，节省成本20%。',
        time: [new Date('2015-07-01'), new Date('2018-02-28')]
      }
    ],
    campusExperience: '研究生期间担任MBA协会主席，组织多次企业参访和管理论坛',
    skills: ['项目管理', '团队领导', '敏捷开发', '风险管理', '预算控制', '商务谈判'],
    selfAssessment:
      '拥有8年项目管理经验，擅长带领跨职能团队完成复杂项目。具有出色的领导力、沟通能力和问题解决能力。精通敏捷和传统项目管理方法，能够根据项目特点灵活选择合适的管理方式。注重团队成长和业务价值的实现，有成功管理千万级项目的经验。'
  },
  marketing: {
    name: '赵芳',
    gender: '女',
    jobTitle: '市场营销经理',
    birthday: '1993-11-08',
    origin: '成都',
    currentResidence: '北京',
    politicalStatus: '群众',
    contact: '13800138003',
    email: 'zhaofang@example.com',
    honors: '年度最佳营销案例奖\n行业影响力人物提名',
    certifications: '数字营销专业认证\n社交媒体营销证书',
    education: [
      {
        school: '中国人民大学',
        major: '市场营销',
        degree: '本科',
        time: [new Date('2011-09-01'), new Date('2015-06-30')]
      }
    ],
    experience: [
      {
        company: '字节跳动',
        position: '市场营销经理',
        description:
          '【情境】新产品上线初期用户增长缓慢，【任务】负责制定并执行市场推广策略，【行动】设计了多渠道整合营销方案，包括社交媒体营销、KOL合作和线下活动，【成果】三个月内用户增长200%，品牌知名度提升50%，产品跻身行业前三。',
        time: [new Date('2019-04-01'), new Date()]
      },
      {
        company: '京东集团',
        position: '营销专员',
        description:
          '【情境】618购物节需要创新营销方案，【任务】作为团队核心成员负责创意策划和执行，【行动】提出并实施了"品类日"概念，结合直播和社交裂变，【成果】带动品类销售额同比增长150%，获得公司年度创新奖。',
        time: [new Date('2015-07-01'), new Date('2019-03-31')]
      }
    ],
    campusExperience: '大学期间创办校园营销协会，举办多场营销大赛和企业分享会',
    skills: ['数字营销', '品牌策划', '社交媒体运营', '内容营销', '用户增长', '数据分析'],
    selfAssessment:
      '具有7年互联网行业市场营销经验，对数字营销和品牌建设有深入理解。擅长整合各类营销渠道，制定有效的营销策略。具有出色的创意思维和执行力，能够将创意转化为有效的市场行动。熟悉用户心理，善于数据分析，能够不断优化营销效果。有团队管理经验，能够带领团队实现营销目标。'
  },
  finance: {
    name: '陈明',
    gender: '男',
    jobTitle: '财务分析师',
    birthday: '1992-09-20',
    origin: '上海',
    currentResidence: '上海',
    politicalStatus: '群众',
    contact: '13800138004',
    email: 'chenming@example.com',
    honors: '注册会计师考试专业阶段优秀考生\n公司财务创新奖',
    certifications: 'CPA注册会计师\nFRM金融风险管理师\nCFA一级',
    education: [
      {
        school: '上海财经大学',
        major: '财务管理',
        degree: '硕士',
        time: [new Date('2014-09-01'), new Date('2017-06-30')]
      },
      {
        school: '复旦大学',
        major: '会计学',
        degree: '本科',
        time: [new Date('2010-09-01'), new Date('2014-06-30')]
      }
    ],
    experience: [
      {
        company: '普华永道会计师事务所',
        position: '高级财务分析师',
        description:
          '【情境】某大型跨国公司并购项目需要财务尽职调查，【任务】作为项目负责人进行财务分析和风险评估，【行动】组织团队深入分析目标公司财务状况，识别潜在风险并提出解决方案，【成果】顺利完成尽职调查，为客户节省约2000万并购成本，获得客户高度评价。',
        time: [new Date('2020-02-01'), new Date()]
      },
      {
        company: '安永华明会计师事务所',
        position: '审计师',
        description:
          '【情境】多家上市公司年度审计工作任务繁重，【任务】负责财务报表审计和内控评估，【行动】优化审计流程，应用数据分析工具提高审计效率，【成果】比预期提前完成多个项目，审计质量获得客户认可，被评为年度优秀员工。',
        time: [new Date('2017-07-01'), new Date('2020-01-31')]
      }
    ],
    campusExperience: '研究生期间担任金融俱乐部副主席，组织企业参访和行业讲座',
    skills: ['财务分析', '财务建模', '风险评估', '审计', 'Excel高级应用', 'SQL', 'Python数据分析'],
    selfAssessment:
      '拥有6年财务分析和审计经验，对财务报表分析和企业估值有深入研究。具备扎实的会计和金融知识，精通财务建模和风险管理。工作严谨细致，善于发现财务数据中的问题并提出建设性意见。良好的沟通能力和团队协作精神，能够向非财务人员清晰解释复杂的财务概念。持续学习新知识，保持专业敏感度。'
  }
}

// 将resumeForm改为一个函数，根据当前选择的类型返回对应的模板
const resumeForm = ref(JSON.parse(JSON.stringify(resumeTemplates.tech)))

// 添加切换简历类型的函数
const changeResumeType = (type: string) => {
  currentResumeType.value = type
  // 深拷贝模板数据，避免相互影响
  resumeForm.value = JSON.parse(
    JSON.stringify(resumeTemplates[type as keyof typeof resumeTemplates])
  )
  message.success(`已切换到${resumeTypes.find(item => item.value === type)?.label}`)
}

const analyzing = ref(false)
const analysisDialogVisible = ref(false)
const activeCollapse = ref(['1', '2', '3'])
const aiSuggestions = ref<AISuggestions | null>(null)
const resumePreview = ref<HTMLDivElement | null>(null)

// 根据路由参数加载对应的模板
const selectTemplate = async (template: string) => {
  await loadTemplate(template)
  templateDialogVisible.value = false

  // 应用模板增强
  await nextTick()
  if (resumePreview.value) {
    await templateAdapter.enhanceTemplate(template, resumePreview.value)
  }
}

// 定义模板加载函数
const loadTemplate = async (templateName?: string) => {
  const template = templateName || 'muban6' // 使用小写模板名称
  try {
    // 安全地加载组件
    const templateKey = template.toLowerCase() // 确保使用小写键名
    if (templateKey in templateComponents) {
      const module = await templateComponents[templateKey]()
      currentTemplate.value = module.default

      // 应用模板增强
      await nextTick()
      if (resumePreview.value) {
        await templateAdapter.enhanceTemplate(templateKey, resumePreview.value)
      }
    } else {
      // 回退到默认模板
      const defaultModule = await templateComponents['muban6']()
      currentTemplate.value = defaultModule.default

      // 应用默认模板增强
      await nextTick()
      if (resumePreview.value) {
        await templateAdapter.enhanceTemplate('muban6', resumePreview.value)
      }
    }
  } catch (error) {
    console.error('加载模板失败:', error)
    try {
      // 二次尝试加载默认模板
      const defaultFallback = await templateComponents['muban6']()
      currentTemplate.value = defaultFallback.default
    } catch (err) {
      console.error('无法加载默认模板:', err)
      message.error('模板加载失败，请刷新页面重试')
    }
  }
}

// 使用正确的 watch 方法
watch(
  () => route.params.template || 'muban6',
  newTemplate => {
    loadTemplate(String(newTemplate).toLowerCase()) // 确保转换为小写字符串
  },
  { immediate: true }
)

const handleClose = (tag: string) => {
  resumeForm.value.skills = resumeForm.value.skills.filter((t: string) => t !== tag)
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

// 完全替换 exportPDF 函数
const exportPDF = async () => {
  if (!resumePreview.value) return

  try {
    message.info('正在生成PDF，请稍候...')

    // 确保模板完全渲染
    await new Promise(resolve => setTimeout(resolve, 1000))

    const element = resumePreview.value

    // 在导出前临时调整预览区域以获得更好的宽度
    const originalStyle = element.getAttribute('style') || ''
    // 显式类型转换为HTMLElement，避免Element类型错误
    const htmlElement = element as HTMLElement
    htmlElement.style.width = '794px' // A4宽度对应的像素
    htmlElement.style.maxWidth = 'none'
    htmlElement.style.margin = '0'
    htmlElement.style.boxSizing = 'border-box'

    // 使用更高质量的配置进行渲染
    const canvas = await html2canvas(element, {
      scale: 2, // 使用适当的比例，提高清晰度但不过大
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff',
      ignoreElements: el => el.tagName === 'IFRAME' || el.classList.contains('ignore-pdf'),
      onclone: (doc, clone) => {
        // 获取克隆后的目标元素
        const clonedElement = clone.querySelector('.resume-preview')
        if (clonedElement) {
          // 对克隆的元素应用宽度样式，确保在PDF中有足够的宽度
          // 类型转换为HTMLElement
          const clonedHtmlElement = clonedElement as HTMLElement
          clonedHtmlElement.style.width = '794px' // A4宽度对应的像素
          clonedHtmlElement.style.maxWidth = 'none'
          clonedHtmlElement.style.margin = '0'
          clonedHtmlElement.style.boxSizing = 'border-box'

          // 调整内部简历容器样式，确保内容充满宽度
          const resumeContainer = clonedElement.querySelector('.resume')
          if (resumeContainer) {
            // 类型转换为HTMLElement
            const resumeHtmlContainer = resumeContainer as HTMLElement
            resumeHtmlContainer.style.width = '100%'
            resumeHtmlContainer.style.maxWidth = 'none'
            resumeHtmlContainer.style.boxShadow = 'none'
            resumeHtmlContainer.style.margin = '0'
          }
        }

        // 添加额外样式来优化PDF输出
        const style = doc.createElement('style')
        style.innerHTML = `
          * { -webkit-print-color-adjust: exact !important; }
          .resume-preview { width: 794px !important; max-width: none !important; margin: 0 !important; }
          .resume { box-shadow: none !important; margin: 0 !important; max-width: none !important; width: 100% !important; }
          p, div, span, h1, h2, h3, h4, h5, h6 { 
            font-family: 'Arial', 'Helvetica', sans-serif !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page { margin: 0; }
        `
        doc.head.appendChild(style)
        return clone
      }
    })

    // 恢复原始样式
    element.setAttribute('style', originalStyle)

    // 获取canvas尺寸和图像数据
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const imgData = canvas.toDataURL('image/jpeg', 1.0)

    // 创建PDF文档 - 使用A4尺寸
    const pdf = new jsPDF({
      orientation: 'portrait', // 使用纵向
      unit: 'mm',
      format: 'a4'
    })

    // 获取PDF页面尺寸（以毫米为单位）
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // 设置边距，确保内容不会贴边
    const margin = 5 // 减小边距到5mm
    const contentWidth = pdfWidth - margin * 2
    const contentHeight = pdfHeight - margin * 2

    // 修改缩放比例计算逻辑 - 优先适配宽度，确保充分利用页面宽度
    const widthRatio = contentWidth / imgWidth
    const heightRatio = contentHeight / imgHeight

    // 以宽度为主要参考，如果高度会超出，则再以高度为准
    // 避免重复声明变量
    let finalScaleRatio = widthRatio
    if (imgHeight * widthRatio > contentHeight) {
      finalScaleRatio = heightRatio
    }

    // 计算缩放后的尺寸
    const scaledWidth = imgWidth * finalScaleRatio
    const scaledHeight = imgHeight * finalScaleRatio

    // 计算居中位置
    const xPos = margin + (contentWidth - scaledWidth) / 2
    const yPos = margin

    // 添加图像到PDF，使用计算好的位置和尺寸
    pdf.addImage(imgData, 'JPEG', xPos, yPos, scaledWidth, scaledHeight)

    // 保存PDF
    pdf.save('我的简历.pdf')

    message.success('PDF导出成功！')
  } catch (error: any) {
    console.error('PDF导出失败:', error)
    message.error(`PDF导出失败: ${error.message || '未知错误'}`)
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
      education: resumeForm.value.education.map((edu: any) => ({
        ...edu,
        time: [
          dayjs(edu.time[0]).format('YYYY-MM-DD'),
          dayjs(edu.time[1]).format('YYYY-MM-DD')
        ] as [string, string]
      })),
      experience: resumeForm.value.experience.map((exp: any) => ({
        ...exp,
        time: [
          dayjs(exp.time[0]).format('YYYY-MM-DD'),
          dayjs(exp.time[1]).format('YYYY-MM-DD')
        ] as [string, string]
      }))
    }

    // 调用API
    const response = await analyzeResumeApi(formData)

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
    message.error('简历分析失败，请稍后再试')
  } finally {
    analyzing.value = false
  }
}

const applyAISuggestions = () => {
  if (!aiSuggestions.value) {
    message.warning('没有可用的 AI 建议')
    return
  }

  // 查找各个部分的修改建议
  const revisions = aiSuggestions.value.revisions || []

  // 处理工作经历修改
  const workExperienceSuggestion = revisions.find(rev => rev.section === '工作经历')
  if (workExperienceSuggestion && Array.isArray(workExperienceSuggestion.suggestion)) {
    // 获取每个工作经历的优化建议
    workExperienceSuggestion.suggestion.forEach(suggestion => {
      // 检查建议是否是字符串
      if (typeof suggestion === 'string') {
        // 如果是普通字符串，可能是针对整体的建议
        // 这里可以选择性地处理字符串类型的建议
        return // 暂时忽略字符串类型的建议
      }

      // 检查是否是 SuggestionItem 对象
      if (isSuggestionItem(suggestion)) {
        // 查找匹配的工作经历
        const experienceIndex = resumeForm.value.experience.findIndex(
          (exp: any) => exp.description.trim() === suggestion.original.trim()
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
    educationSuggestion.suggestion.forEach(suggestion => {
      // 检查是否是 SuggestionItem 对象
      if (isSuggestionItem(suggestion)) {
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

  message.success('已应用 AI 建议')
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
      message.success('简历信息已清空')
    })
    .catch(() => {
      message.info('已取消清空操作')
    })
}

const clearResumeForm = () => {
  resumeForm.value = {
    name: '',
    gender: '',
    jobTitle: '',
    birthday: '',
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

// 类型守卫函数
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
    muban2: '专业技术风格',
    muban3: '商务精英风格',
    muban4: '创意设计风格',
    muban5: '学术研究风格',
    muban6: '市场营销风格',
    muban7: '医疗护理风格',
    muban8: '教育培训风格',
    muban9: '工程技术风格',
    muban10: '金融财务风格',
    muban11: '现代蓝色风格',
    muban12: '简约黑白风格',
    muban13: '清新卡片风格',
    muban14: '科技紫色风格'
  }
  return nameMap[templateKey.toLowerCase()] || templateKey
}

// 获取模板风格标签
const getTemplateStyle = (templateKey: string) => {
  const styleMap: Record<string, string> = {
    muban2: '技术风格',
    muban3: '商务风格',
    muban4: '创意风格',
    muban5: '学术风格',
    muban6: '营销风格',
    muban7: '医疗风格',
    muban8: '教育风格',
    muban9: '工程风格',
    muban10: '金融风格',
    muban11: '现代风格',
    muban12: '简约风格',
    muban13: '清新风格',
    muban14: '科技风格'
  }
  return styleMap[templateKey.toLowerCase()] || '标准风格'
}

onMounted(async () => {
  // 初始化时确保模板正确加载
  await nextTick()
  // 应用模板增强
  if (resumePreview.value && currentTemplate.value) {
    const currentTemplateName = route.params.template?.toString() || 'muban6'
    await templateAdapter.enhanceTemplate(currentTemplateName, resumePreview.value)
  }
})

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
  isSuggestionItemTemplate,
  changeResumeType
})
</script>

<style scoped>
.resume-create {
  padding: 24px;
  background-color: #f0f2f5;
  min-height: calc(100vh - 64px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: linear-gradient(to right, #1a365d, #3182ce);
  padding: 20px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  color: white !important;
}

.page-title {
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white !important;
}

.page-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 24px;
  background-color: white;
  border-radius: 2px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions .el-button {
  transition: all 0.3s;
  font-weight: 500;
  font-size: 14px;
  height: 40px;
  padding: 0 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-actions .el-button--primary {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.header-actions .el-button--primary:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-color: #409eff;
  border-radius: 2px;
}

.edit-area,
.preview-area {
  height: calc(100vh - 140px);
  overflow-y: auto;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  background-color: white;
  padding: 0;
}

.edit-area:hover,
.preview-area:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.edit-area {
  padding: 24px;
}

.resume-form :deep(.el-divider__text) {
  background-color: white;
  color: #3182ce;
  font-weight: 600;
  font-size: 16px;
  padding: 0 16px;
}

.resume-form :deep(.el-divider) {
  margin: 32px 0 20px;
}

.resume-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #2d3748;
}

.resume-form :deep(.el-input__wrapper),
.resume-form :deep(.el-textarea__wrapper) {
  box-shadow: 0 0 0 1px #e2e8f0 inset;
  border-radius: 6px;
  transition: all 0.3s;
}

.resume-form :deep(.el-input__wrapper:hover),
.resume-form :deep(.el-textarea__wrapper:hover) {
  box-shadow: 0 0 0 1px #3182ce inset;
}

.resume-form :deep(.el-input__wrapper.is-focus),
.resume-form :deep(.el-textarea__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.2) inset !important;
}

.education-item,
.experience-item {
  margin-bottom: 24px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
  position: relative;
  transition: all 0.3s ease;
}

.education-item:hover,
.experience-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e0;
}

.education-item .el-button,
.experience-item .el-button {
  position: absolute;
  right: 15px;
  bottom: 15px;
  transition: all 0.3s;
}

.education-item .el-button:hover,
.experience-item .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 18px;
  color: #3182ce;
  margin: 20px 0 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 3px;
  height: 18px;
  background-color: #3182ce;
  border-radius: 2px;
}

.skill-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  border-radius: 4px;
  background-color: #ebf8ff;
  border-color: #bee3f8;
  color: #3182ce;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(49, 130, 206, 0.15);
}

.input-new-tag {
  width: 150px;
  margin-right: 10px;
  margin-bottom: 10px;
  vertical-align: bottom;
}

.resume-preview {
  padding: 30px;
  min-height: 800px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 重写预览区域样式，让邮箱等信息在同一行显示 */
.resume-preview :deep(.contact-info) {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.resume-preview :deep(.contact-info-item) {
  display: flex;
  align-items: center;
  gap: 5px;
}

.resume-preview :deep(.section-heading) {
  border-bottom: 2px solid #3182ce;
  padding-bottom: 8px;
  margin-top: 25px;
  margin-bottom: 15px;
  color: #2d3748;
  font-size: 18px;
  font-weight: 600;
}

.resume-preview :deep(.resume-header) {
  margin-bottom: 25px;
}

.resume-preview :deep(.resume-header h1) {
  font-size: 28px;
  margin-bottom: 5px;
  color: #1a365d;
}

.resume-preview :deep(.resume-header h2) {
  font-size: 18px;
  color: #3182ce;
  margin-bottom: 15px;
}

.resume-preview :deep(.time-period) {
  color: #4a5568;
  font-weight: 500;
  margin-bottom: 5px;
}

.resume-preview :deep(.experience-item),
.resume-preview :deep(.education-item) {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e2e8f0;
}

.resume-preview :deep(.experience-header),
.resume-preview :deep(.education-header) {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.resume-preview :deep(.company-school) {
  font-weight: 600;
  color: #2d3748;
  font-size: 16px;
}

.resume-preview :deep(.position-major) {
  font-weight: 500;
  color: #4a5568;
  font-style: italic;
}

/* 按钮样式重写 */
:deep(.el-button--primary) {
  background-color: #1890ff;
  border-color: #1890ff;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border-radius: 4px;
}

:deep(.el-button--primary:hover) {
  background-color: #40a9ff;
  border-color: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(24, 144, 255, 0.25);
}

:deep(.el-button--danger) {
  background-color: #f5222d;
  border-color: #f5222d;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-button--danger:hover) {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(245, 34, 45, 0.25);
}

:deep(.el-button--success) {
  background-color: #52c41a;
  border-color: #52c41a;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-button--success:hover) {
  background-color: #73d13d;
  border-color: #73d13d;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(82, 196, 26, 0.25);
}

:deep(.el-button--warning) {
  background-color: #faad14;
  border-color: #faad14;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.05);
}

:deep(.el-button--warning:hover) {
  background-color: #ffc53d;
  border-color: #ffc53d;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(250, 173, 20, 0.25);
}

.preview-overlay {
  background-color: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(4px);
}

.preview-modal {
  border-radius: 12px;
  overflow: hidden;
}

.resume-preview-dialog :deep(.el-dialog) {
  max-width: 90vw;
  max-height: 90vh;
  margin: 5vh auto !important;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

.resume-preview-dialog :deep(.el-dialog__header) {
  background-color: #f7fafc;
  padding: 16px 20px;
  margin-right: 0;
  border-bottom: 1px solid #edf2f7;
}

.resume-preview-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  color: #2d3748;
  font-weight: 600;
}

.resume-preview-dialog :deep(.el-dialog__headerbtn) {
  top: 16px;
}

.resume-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.resume-preview-dialog-content {
  padding: 30px;
  background-color: white;
  transform: scale(0.9);
  transform-origin: center;
  margin: 20px auto;
  max-height: 70vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.resume-preview-dialog-content:hover {
  transform: scale(0.92);
}

.template-card {
  margin-bottom: 24px;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  height: 240px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.template-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: #3182ce;
}

.template-preview-box {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s;
}

.template-card:hover .template-preview-box {
  background: #edf2f7;
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

.remove-button {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 10;
}

.add-section {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.w-100 {
  width: 100%;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.action-buttons .el-button--danger {
  margin-left: 5px;
}

.resume-type-selector {
  margin: 10px 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background-color: #f6f8fa;
  border-radius: 8px;
  border: 1px solid #e6e8eb;
}

.resume-type-label {
  font-weight: 500;
  color: #2d3748;
  margin-right: 8px;
}

.resume-type-selector .el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-type-selector :deep(.el-radio-button__inner) {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  transition: all 0.3s;
}

.resume-type-selector :deep(.el-radio-button__orig-radio:checked + .el-radio-button__inner) {
  background-color: #1890ff;
  border-color: #1890ff;
  box-shadow: -1px 0 0 0 #1890ff;
  color: white;
}

.resume-type-selector :deep(.el-radio-button:hover .el-radio-button__inner) {
  color: #1890ff;
  border-color: #1890ff;
}

.resume-type-selector :deep(.el-radio-button__orig-radio:checked:hover + .el-radio-button__inner) {
  color: white;
}

/* 专业技能区样式优化 */
.skill-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 10px;
}

.skill-tag {
  padding: 8px 16px;
  margin-right: 0;
  margin-bottom: 0;
  border-radius: 4px;
  background-color: #f0f7ff;
  border-color: #d6e8ff;
  color: #1890ff;
  font-size: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.15);
  background-color: #e6f4ff;
  border-color: #a6d2ff;
}

.input-new-tag {
  width: 150px;
  margin-right: 0;
  margin-bottom: 0;
  vertical-align: middle;
}

.button-new-tag {
  padding: 8px 16px;
  height: auto;
  border-style: dashed;
  font-size: 14px;
  color: #666;
  border-color: #d9d9d9;
  background: #fafafa;
}

.button-new-tag:hover {
  color: #1890ff;
  border-color: #1890ff;
  background: #f0f7ff;
}

/* 调整预览区域的专业技能样式 */
.resume-preview :deep(.skills-section) {
  margin-top: 20px;
}

.resume-preview :deep(.skills-container) {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

.resume-preview :deep(.skill-item) {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 10px 16px;
  color: #333;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.resume-preview :deep(.skill-item:hover) {
  background-color: #ebf5ff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
</style>
