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

const useTemplate = (template: Template | null) => {
  if (!template) return
  router.push({
    name: 'ResumeCreate',
    query: { template: template.id.toString() }
  })
}

const templates: Template[] = [
  {
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
    ]
  },
  {
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
    ]
  },
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

.template-preview {
  display: flex;
  gap: 30px;
}

.preview-image {
  width: 50%;
  object-fit: contain;
}

.preview-info {
  flex: 1;
}

.preview-info h2 {
  margin: 0 0 20px;
  font-size: 24px;
}

.preview-info h3 {
  margin: 20px 0 10px;
  font-size: 18px;
  color: #333;
}

.preview-info ul {
  padding-left: 20px;
  margin: 10px 0;
}

.preview-info li {
  margin-bottom: 8px;
  color: #666;
}
</style>
