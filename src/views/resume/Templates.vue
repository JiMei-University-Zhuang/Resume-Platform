<template>
  <div class="resume-templates">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="templates-header">
          <h2>简历模板</h2>
          <div class="filters">
            <el-radio-group v-model="filter" @change="(val) => handleFilterChange(val as FilterType)">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="fresh">应届生</el-radio-button>
              <el-radio-button label="tech">技术类</el-radio-button>
              <el-radio-button label="business">商务类</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6" v-for="template in filteredTemplates" :key="template.id">
        <el-card :body-style="{ padding: '0px' }" class="template-card">
          <img :src="template.preview" class="template-image">
          <div class="template-info">
            <h3>{{ template.name }}</h3>
            <p>{{ template.description }}</p>
            <div class="template-tags">
              <el-tag 
                v-for="tag in template.tags" 
                :key="tag"
                size="small"
                :type="getTagType(tag)"
              >{{ tag }}</el-tag>
            </div>
            <div class="template-actions">
              <el-button type="primary" @click="useTemplate(template)">使用模板</el-button>
              <el-button @click="previewTemplate(template)">预览</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="previewDialogVisible"
      title="模板预览"
      width="70%"
    >
      <div class="template-preview" v-if="selectedTemplate">
        <img :src="selectedTemplate.preview" class="preview-image">
        <div class="preview-info">
          <h2>{{ selectedTemplate.name }}</h2>
          <p>{{ selectedTemplate.description }}</p>
          <h3>适用场景</h3>
          <ul>
            <li v-for="(scene, index) in selectedTemplate.scenes" :key="index">
              {{ scene }}
            </li>
          </ul>
          <h3>模板特点</h3>
          <ul>
            <li v-for="(feature, index) in selectedTemplate.features" :key="index">
              {{ feature }}
            </li>
          </ul>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="useTemplate(selectedTemplate)">
            使用此模板
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose } from 'vue'
import { useRouter } from 'vue-router'
import type { FilterType, Template } from '@/types/templates'
import { getTagType } from '@/types/templates'

const router = useRouter()
const filter = ref<FilterType>('all')
const previewDialogVisible = ref(false)
const selectedTemplate = ref<Template | null>(null)

const handleFilterChange = (value: FilterType) => {
  filter.value = value
}

const previewTemplate = (template: Template) => {
  selectedTemplate.value = template
  previewDialogVisible.value = true
}

const useTemplate = (template: Template) => {
  router.push({
    name: 'ResumeCreate',
    params: { 
      template: template.componentName.toLowerCase() // 确保模板名称小写
    }
  })
}


const templates: Template[] = [
  {
    // Muban1
    id: 1,
    name: '清新简约模板',
    description: '适合应届生的简洁大方模板',
    preview: 'path/to/preview1.jpg',
    tags: ['应届生', '简约风格'],
    scenes: [
      '适合应届生求职',
      '适合简历内容不多的求职者',
      '偏好简约设计风格的求职者'
    ],
    features: [
      '简洁大方的版面设计',
      '重点突出教育背景',
      '适当留白提升可读性'
    ],
    componentName: 'muban1' 
  },
  {
    // Muban2
    id: 2,
    name: '技术专家模板',
    description: '突出技术栈和项目经验',
    preview: 'path/to/preview2.jpg',
    tags: ['技术类', '经验型'],
    scenes: [
      '适合有丰富技术经验的求职者',
      '需要展示详细技术栈的场景',
      '注重项目经验展示的职位'
    ],
    features: [
      '技能矩阵展示',
      '项目经验时间线',
      '技术关键词标签云'
    ],
    componentName: 'muban2' 
  },
  {
    // Muban3
    id: 3,
    name: '端庄大气模板',
    description: '突出技术栈和项目经验',
    preview: 'path/to/preview2.jpg',
    tags: ['技术类', '经验型'],
    scenes: [
      '适合有丰富技术经验的求职者',
      '需要展示详细技术栈的场景',
      '注重项目经验展示的职位'
    ],
    features: [
      '技能矩阵展示',
      '项目经验时间线',
      '技术关键词标签云'
    ],
    componentName: 'muban3' 
  },
  {
    // Muban4
    id: 4,
    name: '创意设计模板',
    description: '适合设计师的创意简历模板',
    preview: 'path/to/preview4.jpg',
    tags: ['设计类', '创意风格'],
    scenes: [
      '适合设计师求职',
      '需要展示创意能力的场景',
      '注重视觉表现的职位'
    ],
    features: [
      '创意布局设计',
      '视觉元素丰富',
      '色彩搭配鲜明'
    ],
    componentName: 'muban4' 
  },
  {
    // Muban5
    id: 5,
    name: '商务精英模板',
    description: '适合商务人士的专业简历模板',
    preview: 'path/to/preview5.jpg',
    tags: ['商务类', '专业风格'],
    scenes: [
      '适合商务人士求职',
      '需要展示专业能力的场景',
      '注重职业形象的职位'
    ],
    features: [
      '专业商务风格',
      '重点突出工作经历',
      '强调职业成就'
    ],
    componentName: 'muban5' 
  },
  {
    // Muban6
    id: 6,
    name: '学术研究模板',
    description: '适合学术研究人员的简历模板',
    preview: 'path/to/preview6.jpg',
    tags: ['学术类', '研究型'],
    scenes: [
      '适合学术研究人员求职',
      '需要展示研究成果的场景',
      '注重学术背景的职位'
    ],
    features: [
      '突出学术成就',
      '展示研究项目',
      '强调发表论文'
    ],
    componentName: 'muban6' 
  },
  {
    // Muban7
    id: 7,
    name: '市场营销模板',
    description: '适合市场营销人员的创意简历模板',
    preview: 'path/to/preview7.jpg',
    tags: ['市场类', '创意风格'],
    scenes: [
      '适合市场营销人员求职',
      '需要展示营销案例的场景',
      '注重创意能力的职位'
    ],
    features: [
      '突出营销项目成果',
      '强调数据分析能力',
      '展示创意策划案例'
    ],
    componentName: 'muban7' 
  },
  {
    // Muban8
    id: 8,
    name: '学术研究模板',
    description: '适合博士及科研人员的专业简历模板',
    preview: 'path/to/preview8.jpg',
    tags: ['学术类', '研究型'],
    scenes: [
      '适合高校教师求职',
      '科研岗位申请',
      '学术会议简历投递'
    ],
    features: [
      '突出学术成果展示',
      '研究项目时间线',
      '论文发表列表模块'
    ],
    componentName: 'muban8'
  },
  {
    // Muban9
    id: 9,
    name: '市场营销模板',
    description: '适合市场推广人员的创意型简历',
    preview: 'path/to/preview9.jpg',
    tags: ['市场类', '创意型'],
    scenes: [
      '市场营销岗位申请',
      '品牌推广职位',
      '数字营销岗位'
    ],
    features: [
      '营销案例展示模块',
      '数据分析可视化',
      '社交媒体运营展示'
    ],
    componentName: 'muban9'
  },
  {
    // Muban10
    id: 10,
    name: '医疗护理模板',
    description: '适用于医疗护理专业的简历模板',
    preview: 'path/to/preview10.jpg',
    tags: ['医疗类', '护理型'],
    scenes: [
      '医院护理岗位申请',
      '医疗科研职位',
      '公共卫生机构'
    ],
    features: [
      '突出护理实践经验',
      '医疗技能证书展示',
      '病例管理经验模块'
    ],
    componentName: 'muban10'
  }
]

const filteredTemplates = computed(() => {
  if (filter.value === 'all') return templates
  return templates.filter(template => 
    template.tags.some(tag => {
      switch (filter.value) {
        case 'fresh': return tag === '应届生'
        case 'tech': return tag === '技术类'
        case 'business': return tag === '商务类'
        default: return true
      }
    })
  )
})

// Make variables available to template
defineExpose({
  filter,
  filteredTemplates,
  previewDialogVisible,
  selectedTemplate,
  getTagType,
  handleFilterChange,
  previewTemplate,
  useTemplate
})
</script>

<style scoped>
.resume-templates {
  padding: 20px;
}

.templates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.templates-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.template-card {
  margin-bottom: 20px;
  transition: all 0.3s;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.template-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.template-info {
  padding: 15px;
}

.template-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.template-info p {
  color: #666;
  margin-bottom: 15px;
  font-size: 14px;
}

.template-tags {
  margin-bottom: 15px;
}

.template-tags .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}

.template-actions {
  display: flex;
  justify-content: space-between;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  height: 80vh;
  margin: 10vh auto !important;
}

.el-dialog__body {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-preview {
  display: flex;
  gap: 30px;
  width: 100%;
  height: 100%;
  align-items: flex-start;
}

.preview-image {
  width: 50%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}

.preview-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.preview-info h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.preview-info h3 {
  margin: 10px 0 0;
  font-size: 18px;
  color: #606266;
}

.preview-info p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.preview-info ul {
  margin: 0;
  padding-left: 20px;
}

.preview-info li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.6;
}
</style>
