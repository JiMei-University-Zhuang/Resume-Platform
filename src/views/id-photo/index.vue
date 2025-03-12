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
                      v-for="color in presetColors.value"
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
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'

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
  if (!file.raw) return
  const isImage = file.raw.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('请上传图片文件！')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      previewUrl.value = e.target.result as string
    }
  }
  reader.readAsDataURL(file.raw)
}

const generatePhoto = async () => {
  if (!previewUrl.value) {
    ElMessage.warning('请先上传照片')
    return
  }

  generating.value = true
  try {
    // TODO: 调用后端 AI 证件照生成接口
    await new Promise(resolve => setTimeout(resolve, 2000))
    ElMessage.success('证件照生成成功！')
  } catch (error) {
    ElMessage.error('生成失败，请重试')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.id-photo-container {
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
}

.photo-uploader {
  width: 100%;
  margin-bottom: 20px;
}

.settings-panel {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.preview-area {
  width: 100%;
  height: 300px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
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
  gap: 8px;
}

.color-btn {
  width: 60px;
  height: 24px;
  border: 1px solid #dcdfe6;
  color: transparent;
  padding: 0;
}

.color-btn:hover {
  border-color: #409eff;
}

.beautify-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-beautify-options {
  margin-top: 8px;
  padding-left: 24px;
}

.suggestions {
  margin-top: 20px;
}

.suggestions .el-alert {
  margin-bottom: 10px;
}
</style>
