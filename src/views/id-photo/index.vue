<template>
  <div class="id-photo-container">
    <el-card class="upload-area">
      <template #header>
        <div class="card-header">
          <span>AI 证件照制作</span>
          <el-button type="primary" @click="generatePhoto" :loading="generating">
            生成证件照
          </el-button>
        </div>
      </template>

      <div class="content">
        <div class="left-panel">
          <el-upload
            class="photo-uploader"
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePhotoChange"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽图片到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 jpg/png 文件，建议使用正面免冠照片
              </div>
            </template>
          </el-upload>

          <div class="settings-panel">
            <h3>照片设置</h3>
            <el-form :model="photoSettings" label-width="100px">
              <el-form-item label="照片规格">
                <el-select v-model="photoSettings.size" placeholder="选择照片规格">
                  <el-option label="一寸" value="one-inch" />
                  <el-option label="二寸" value="two-inch" />
                  <el-option label="小二寸" value="small-two-inch" />
                  <el-option label="证件照" value="id-photo" />
                </el-select>
              </el-form-item>

              <el-form-item label="背景颜色">
                <div class="color-selection">
                  <el-color-picker v-model="photoSettings.backgroundColor" show-alpha />
                  <div class="preset-colors">
                    <el-button
                      v-for="color in presetColors"
                      :key="color.value"
                      :style="{ backgroundColor: color.value }"
                      class="color-btn"
                      @click="photoSettings.backgroundColor = color.value"
                    >
                      {{ color.label }}
                    </el-button>
                  </div>
                </div>
              </el-form-item>

              <el-form-item label="基础美化">
                <div class="beautify-controls">
                  <el-slider
                    v-model="photoSettings.brightness"
                    :min="-100"
                    :max="100"
                    :step="1"
                    show-input
                    size="small"
                  >
                    <template #prepend>亮度</template>
                  </el-slider>
                  <el-slider
                    v-model="photoSettings.contrast"
                    :min="-100"
                    :max="100"
                    :step="1"
                    show-input
                    size="small"
                  >
                    <template #prepend>对比度</template>
                  </el-slider>
                  <el-slider
                    v-model="photoSettings.saturation"
                    :min="-100"
                    :max="100"
                    :step="1"
                    show-input
                    size="small"
                  >
                    <template #prepend>饱和度</template>
                  </el-slider>
                </div>
              </el-form-item>

              <el-form-item label="智能美化">
                <el-switch
                  v-model="photoSettings.aiBeautify"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div v-if="photoSettings.aiBeautify" class="ai-beautify-options">
                  <el-checkbox-group v-model="photoSettings.aiBeautifyOptions">
                    <el-checkbox label="skin">智能美肤</el-checkbox>
                    <el-checkbox label="face">五官优化</el-checkbox>
                    <el-checkbox label="wrinkle">祛皱</el-checkbox>
                  </el-checkbox-group>
                </div>
              </el-form-item>

              <el-form-item label="着装建议">
                <el-switch
                  v-model="photoSettings.showDressingSuggestions"
                  active-text="显示"
                  inactive-text="隐藏"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="right-panel">
          <div class="preview-area">
            <img v-if="previewUrl" :src="previewUrl" class="preview-image" />
            <div v-else class="empty-preview">
              预览区域
            </div>
          </div>

          <div class="action-buttons" v-if="previewUrl">
            <el-button type="success" @click="downloadPhoto">
              <el-icon><Download /></el-icon> 下载证件照
            </el-button>
          </div>

          <div v-if="photoSettings.showDressingSuggestions" class="suggestions">
            <h3>着装建议</h3>
            <el-alert
              title="建议穿着正装，选择素色上衣"
              type="info"
              :closable="false"
              show-icon
            />
            <el-alert
              title="避免穿着花纹复杂的衣物"
              type="info"
              :closable="false"
              show-icon
            />
            <el-alert
              title="保持整洁的发型，避免头发遮挡面部"
              type="info"
              :closable="false"
              show-icon
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UploadFilled, Download } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { uploadIdPhoto } from '@/api/id-photo'

interface PhotoSettings {
  size: string
  backgroundColor: string
  showDressingSuggestions: boolean
  brightness: number
  contrast: number
  saturation: number
  aiBeautify: boolean
  aiBeautifyOptions: string[]
}

interface PresetColor {
  label: string
  value: string
}

const generating = ref<boolean>(false)
const previewUrl = ref<string>('')
const selectedFile = ref<File | null>(null)

const presetColors = ref<PresetColor[]>([
  { label: '白色', value: '#FFFFFF' },
  { label: '蓝色', value: '#2C5BA9' },
  { label: '红色', value: '#B31942' },
  { label: '灰色', value: '#808080' }
])

const photoSettings = reactive<PhotoSettings>({
  size: 'one-inch',
  backgroundColor: '#FFFFFF',
  showDressingSuggestions: true,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  aiBeautify: false,
  aiBeautifyOptions: ['skin']
})

const handlePhotoChange = (file: UploadFile) => {
  if (!file.raw) {
    ElMessage.error('文件上传失败')
    return
  }
  
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return
  }
  
  const isLt5M = file.size! / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!')
    return
  }
  
  selectedFile.value = file.raw
  
  const reader = new FileReader()
  reader.onload = e => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file.raw)
}

const generatePhoto = async () => {
  if (!selectedFile.value) {
    ElMessage.warning('请先上传照片')
    return
  }
  
  generating.value = true
  
  try {
    const options = {
      size: photoSettings.size,
      brightness: photoSettings.brightness,
      contrast: photoSettings.contrast,
      saturation: photoSettings.saturation,
      aiBeautify: photoSettings.aiBeautify ? '1' : '0',
      aiOptions: photoSettings.aiBeautifyOptions.join(',')
    }
    
    const response = await uploadIdPhoto(
      selectedFile.value,
      photoSettings.backgroundColor,
      options
    )
    
    if (response.data && response.data.image) {
      const base64Data = response.data.image.startsWith('data:image') 
        ? response.data.image 
        : `data:image/png;base64,${response.data.image}`
      
      previewUrl.value = base64Data
      ElMessage.success('证件照生成成功')
    } else {
      throw new Error('未返回有效的图片数据')
    }
  } catch (error) {
    console.error('生成证件照失败:', error)
    ElMessage.error('生成证件照失败，请重试')
  } finally {
    generating.value = false
  }
}

const downloadPhoto = () => {
  if (!previewUrl.value) {
    ElMessage.warning('请先生成证件照')
    return
  }
  
  try {
    // 使用a标签下载Base64图片
    const link = document.createElement('a')
    link.href = previewUrl.value
    link.download = `证件照_${new Date().getTime()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    ElMessage.success('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
    ElMessage.error('下载失败，请重试')
  }
}
</script>

<style scoped>
.id-photo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  gap: 20px;
}

.left-panel {
  flex: 1;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.photo-uploader {
  width: 100%;
}

.settings-panel {
  margin-top: 20px;
}

.preview-area {
  background-color: #f5f7fa;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.empty-preview {
  color: #909399;
  font-size: 14px;
}

.color-selection {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.preset-colors {
  display: flex;
  gap: 10px;
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: transparent;
  transition: transform 0.2s;
}

.color-btn:hover {
  transform: scale(1.05);
}

.beautify-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ai-beautify-options {
  margin-top: 10px;
  padding-left: 20px;
}

.suggestions {
  background-color: #f5f7fa;
  border-radius: 6px;
  padding: 15px;
}

.suggestions h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 16px;
  color: #303133;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.action-buttons .el-button {
  padding: 12px 20px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  
  .preview-area {
    height: 250px;
  }
}
</style>
