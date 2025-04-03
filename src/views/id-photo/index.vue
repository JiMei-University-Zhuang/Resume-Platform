<template>
  <div class="id-photo-container">
    <div class="id-photo-header">
      <h1 class="page-title">AI 证件照制作</h1>
      <p class="page-desc">上传照片，一键生成标准证件照，快速方便</p>
    </div>

    <div class="id-photo-content">
      <div class="upload-section">
        <div class="upload-area">
          <el-upload
            v-if="!previewUrl"
            class="photo-uploader"
            drag
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePhotoChange"
          >
            <div class="upload-inner">
              <el-icon class="upload-icon"><upload-filled /></el-icon>
              <div class="upload-text">
                拖拽图片到此处或 <span class="text-primary">点击上传</span>
              </div>
              <div class="upload-hint">建议使用正面免冠照片，文件不超过5MB</div>
            </div>
          </el-upload>

          <div v-else class="preview-container">
            <div class="preview-image-container">
              <img :src="previewUrl" class="preview-image" />

              <div class="preview-filter" v-if="photoSettings.filter !== 'none'">
                <img :src="previewUrl" class="filtered-image" :style="filterStyle" />
              </div>

              <div class="preview-actions">
                <el-button class="action-btn" @click="resetImage">
                  <el-icon><Delete /></el-icon>重新上传
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <el-drawer
          v-model="drawerVisible"
          title="证件照拍摄指南"
          direction="rtl"
          size="300px"
          :with-header="true"
        >
          <div class="drawer-content">
            <h3>证件照基本要求</h3>
            <ul class="guide-list">
              <li>保持面部正对镜头，表情自然</li>
              <li>背景应为纯色，无杂物干扰</li>
              <li>头发整洁不遮挡面部，露出耳朵</li>
              <li>避免穿着花纹复杂的衣物</li>
              <li>不佩戴眼镜、帽子等饰品</li>
              <li>光线充足均匀，避免阴影</li>
            </ul>

            <h3>拍摄建议</h3>
            <ul class="guide-list">
              <li>建议穿着深色系正装，选择素色上衣</li>
              <li>女士可适当化淡妆，不宜过浓</li>
              <li>拍摄距离以头肩部自然呈现为宜</li>
              <li>使用三脚架可提高稳定性</li>
            </ul>

            <div class="guide-samples">
              <div class="sample-item">
                <div class="sample-image good"></div>
                <div class="sample-label">正确示范</div>
              </div>
              <div class="sample-item">
                <div class="sample-image bad"></div>
                <div class="sample-label">错误示范</div>
              </div>
            </div>
          </div>
        </el-drawer>
      </div>

      <div class="settings-section">
        <el-tabs v-model="activeSettingsTab">
          <el-tab-pane label="规格设置" name="specs">
            <div class="section-title">照片规格</div>

            <div class="settings-form">
              <div class="form-item">
                <label class="form-label">照片规格</label>
                <div class="form-control">
                  <el-select v-model="photoSettings.size" class="size-select">
                    <el-option-group label="常用证件照">
                      <el-option value="one-inch" label="一寸(25×35mm)" />
                      <el-option value="two-inch" label="二寸(35×49mm)" />
                      <el-option value="small-two-inch" label="小二寸(35×45mm)" />
                      <el-option value="id-card" label="身份证(26×32mm)" />
                    </el-option-group>
                    <el-option-group label="求职照">
                      <el-option value="job-photo" label="职业照(38×50mm)" />
                      <el-option value="work-permit" label="工作证(32×40mm)" />
                    </el-option-group>
                    <el-option-group label="签证照">
                      <el-option value="visa-us" label="美国签证(51×51mm)" />
                      <el-option value="visa-uk" label="英国签证(35×45mm)" />
                      <el-option value="visa-eu" label="欧盟签证(35×45mm)" />
                      <el-option value="visa-ca" label="加拿大签证(35×45mm)" />
                    </el-option-group>
                    <el-option-group label="证书照">
                      <el-option value="cert-photo" label="资格证书(35×45mm)" />
                      <el-option value="student-card" label="学生证(相同比例)" />
                    </el-option-group>
                  </el-select>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label">背景颜色</label>
                <div class="form-control">
                  <div class="color-selection">
                    <div class="preset-colors">
                      <div
                        v-for="color in presetColors"
                        :key="color.value"
                        class="color-btn"
                        :class="{ active: photoSettings.backgroundColor === color.value }"
                        :style="{ backgroundColor: color.value }"
                        @click="photoSettings.backgroundColor = color.value"
                      >
                        <el-icon v-if="photoSettings.backgroundColor === color.value"
                          ><Check
                        /></el-icon>
                      </div>
                    </div>
                    <el-color-picker
                      v-model="photoSettings.backgroundColor"
                      class="custom-color-picker"
                      size="small"
                      show-alpha
                    />
                  </div>
                </div>
              </div>

              <div class="form-item">
                <label class="form-label">拍摄指南</label>
                <div class="form-control">
                  <el-button type="info" text @click="drawerVisible = true">
                    <el-icon><InfoFilled /></el-icon>查看拍摄指南
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="效果调整" name="effects">
            <div class="section-title">照片效果</div>

            <div class="settings-form">
              <div class="form-item">
                <label class="form-label">滤镜效果</label>
                <div class="form-control">
                  <el-select v-model="photoSettings.filter" class="filter-select">
                    <el-option value="none" label="无滤镜" />
                    <el-option value="warm" label="暖色调" />
                    <el-option value="cool" label="冷色调" />
                    <el-option value="bw" label="黑白" />
                    <el-option value="vintage" label="复古" />
                    <el-option value="clarity" label="清晰" />
                  </el-select>
                </div>
              </div>

              <template v-if="previewUrl">
                <div class="form-item">
                  <label class="form-label">亮度</label>
                  <div class="form-control">
                    <el-slider
                      v-model="photoSettings.brightness"
                      :min="-100"
                      :max="100"
                      :format-tooltip="val => `${val}%`"
                    />
                  </div>
                </div>

                <div class="form-item">
                  <label class="form-label">对比度</label>
                  <div class="form-control">
                    <el-slider
                      v-model="photoSettings.contrast"
                      :min="-100"
                      :max="100"
                      :format-tooltip="val => `${val}%`"
                    />
                  </div>
                </div>

                <div class="form-item">
                  <label class="form-label">饱和度</label>
                  <div class="form-control">
                    <el-slider
                      v-model="photoSettings.saturation"
                      :min="-100"
                      :max="100"
                      :format-tooltip="val => `${val}%`"
                    />
                  </div>
                </div>
              </template>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="action-buttons">
          <el-button
            type="primary"
            class="generate-btn"
            @click="generatePhoto"
            :loading="generating"
            :disabled="!previewUrl"
          >
            <el-icon><Picture /></el-icon>生成证件照
          </el-button>

          <el-button
            v-if="generatedPhotoUrl"
            class="download-btn"
            type="success"
            @click="downloadPhoto"
          >
            <el-icon><Download /></el-icon>下载证件照
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { UploadFilled, Download, Delete, InfoFilled, Picture, Check } from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { uploadIdPhoto } from '@/api/id-photo'

interface PhotoSettings {
  size: string
  backgroundColor: string
  filter: string
  brightness: number
  contrast: number
  saturation: number
}

interface PresetColor {
  label: string
  value: string
}

const generating = ref<boolean>(false)
const previewUrl = ref<string>('')
const generatedPhotoUrl = ref<string>('')
const selectedFile = ref<File | null>(null)
const drawerVisible = ref<boolean>(false)
const activeSettingsTab = ref<string>('specs')

const presetColors = ref<PresetColor[]>([
  { label: '白色', value: '#FFFFFF' },
  { label: '蓝色', value: '#2C5BA9' },
  { label: '红色', value: '#B31942' },
  { label: '灰色', value: '#808080' },
  { label: '深蓝', value: '#1a365d' },
  { label: '绿色', value: '#1D6F42' }
])

const photoSettings = reactive<PhotoSettings>({
  size: 'small-two-inch',
  backgroundColor: '#FFFFFF',
  filter: 'none',
  brightness: 0,
  contrast: 0,
  saturation: 0
})

const filterStyle = computed(() => {
  const filters = []

  if (photoSettings.brightness !== 0) {
    filters.push(`brightness(${100 + photoSettings.brightness}%)`)
  }

  if (photoSettings.contrast !== 0) {
    filters.push(`contrast(${100 + photoSettings.contrast}%)`)
  }

  if (photoSettings.saturation !== 0) {
    filters.push(`saturate(${100 + photoSettings.saturation}%)`)
  }

  switch (photoSettings.filter) {
    case 'warm':
      filters.push('sepia(30%)')
      break
    case 'cool':
      filters.push('hue-rotate(180deg)')
      break
    case 'bw':
      filters.push('grayscale(100%)')
      break
    case 'vintage':
      filters.push('sepia(80%)')
      filters.push('contrast(120%)')
      filters.push('brightness(90%)')
      break
    case 'clarity':
      filters.push('contrast(120%)')
      filters.push('brightness(110%)')
      break
  }

  return {
    filter: filters.join(' ')
  }
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

const resetImage = () => {
  selectedFile.value = null
  previewUrl.value = ''
  generatedPhotoUrl.value = ''
  photoSettings.brightness = 0
  photoSettings.contrast = 0
  photoSettings.saturation = 0
  photoSettings.filter = 'none'
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
      filter: photoSettings.filter
    }

    // 使用原始上传的文件
    const imageFile = selectedFile.value as File

    const response = await uploadIdPhoto(imageFile, photoSettings.backgroundColor, options)

    if (response.data && response.data.image) {
      const base64Data = response.data.image.startsWith('data:image')
        ? response.data.image
        : `data:image/png;base64,${response.data.image}`

      generatedPhotoUrl.value = base64Data
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
  if (!generatedPhotoUrl.value) {
    ElMessage.warning('请先生成证件照')
    return
  }

  try {
    const sizeName = photoSettings.size.replace(/-/g, '_')
    const link = document.createElement('a')
    link.href = generatedPhotoUrl.value
    link.download = `证件照_${sizeName}_${new Date().getTime()}.png`
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
  padding: 32px 24px;
  color: #1f1f1f;
}

.id-photo-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1f1f1f;
}

.page-desc {
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.id-photo-content {
  display: flex;
  gap: 32px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

@media (max-width: 768px) {
  .id-photo-content {
    flex-direction: column;
  }
}

.upload-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-area {
  width: 100%;
}

.photo-uploader {
  width: 100%;
}

.upload-inner {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.upload-inner:hover {
  border-color: #1677ff;
}

.upload-icon {
  font-size: 48px;
  color: #d9d9d9;
  margin-bottom: 16px;
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 8px;
}

.text-primary {
  color: #1677ff;
  cursor: pointer;
}

.upload-hint {
  font-size: 14px;
  color: #999;
}

.preview-container {
  width: 100%;
}

.preview-image-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-filter {
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}

.filtered-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 4px;
}

.preview-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drawer-content {
  padding: 16px;
}

.drawer-content h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-size: 16px;
  color: #1f1f1f;
  position: relative;
  padding-left: 10px;
}

.drawer-content h3:first-child {
  margin-top: 0;
}

.drawer-content h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #1677ff;
  border-radius: 2px;
}

.guide-list {
  padding-left: 20px;
  margin: 0;
}

.guide-list li {
  margin-bottom: 8px;
  color: #555;
  line-height: 1.5;
}

.guide-samples {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.sample-item {
  text-align: center;
  width: 45%;
}

.sample-image {
  height: 120px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-size: cover;
  background-position: center;
}

.sample-image.good {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
}

.sample-image.bad {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
}

.sample-label {
  font-size: 12px;
  color: #666;
}

.settings-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.settings-form {
  flex: 1;
}

.form-item {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
}

.size-select,
.filter-select {
  width: 100%;
}

.color-selection {
  display: flex;
  align-items: center;
  gap: 16px;
}

.preset-colors {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-btn {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.color-btn.active {
  border: 2px solid #1677ff;
  transform: scale(1.1);
}

.custom-color-picker {
  margin-left: auto;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.generate-btn,
.download-btn {
  padding: 0 32px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 4px;
}

.generate-btn {
  background: #1677ff;
}

.generate-btn:hover {
  background: #0958d9;
}

.download-btn {
  background: #52c41a;
}

.download-btn:hover {
  background: #389e0d;
}
</style>
