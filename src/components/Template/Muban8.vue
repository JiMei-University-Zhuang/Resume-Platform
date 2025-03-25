<template>
  <div class="resume">
    <!-- Header -->
    <div class="header">
      <h1>个人简历</h1>
      <div class="icons">
        <div class="icon red"></div>
        <div class="icon orange"></div>
        <div class="icon pink"></div>
      </div>
    </div>

    <!-- Basic Information -->
    <section class="section">
      <h2 class="section-title">基本信息</h2>
      <div class="section-content basic-info">
        <div class="info-item"><span>姓名:</span> {{ resumeForm.name }}</div>
        <div class="info-item"><span>性别:</span> {{ resumeForm.gender }}</div>
        <div class="info-item"><span>出生年月:</span> {{ formatDate(resumeForm.birthday) }}</div>
        <div class="info-item"><span>籍贯:</span> {{ resumeForm.origin }}</div>
        <div class="info-item"><span>政治面貌:</span> {{ resumeForm.politicalStatus }}</div>
        <div class="info-item"><span>求职意向:</span> {{ resumeForm.jobTitle }}</div>
        <div class="info-item"><span>电子邮箱:</span> {{ resumeForm.email }}</div>
        <div class="info-item"><span>联系方式:</span> {{ resumeForm.contact }}</div>
        <div class="photo" @click="uploadPhoto">
          <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="个人头像" />
          <div v-else class="upload-placeholder">
            <span>点击上传证件照</span>
          </div>
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
        </div>
      </div>
    </section>

    <!-- 教育背景 -->
    <section class="section">
      <h2 class="section-title">教育背景</h2>
      <div class="section-content">
        <div v-for="(edu, index) in resumeForm.education" :key="index" class="item">
          <div class="item-header">
            <span class="time">{{ formatDateRange(edu.time) }}</span>
            <span>{{ edu.school }} | {{ edu.major }} / {{ edu.degree }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 工作经历 -->
    <section class="section" v-if="resumeForm.experience.length">
      <h2 class="section-title">工作经历</h2>
      <div class="section-content">
        <div v-for="(exp, index) in resumeForm.experience" :key="index" class="item">
          <div class="item-header">
            <span class="time">{{ formatDateRange(exp.time) }}</span>
            <span>{{ exp.company }} | {{ exp.position }}</span>
          </div>
          <p>{{ exp.description }}</p>
        </div>
      </div>
    </section>

    <!-- 在校经历 -->
    <section class="section" v-if="resumeForm.campusExperience">
      <h2 class="section-title">在校经历</h2>
      <div class="section-content">
        <div class="item">
          <div v-html="resumeForm.campusExperience"></div>
        </div>
      </div>
    </section>

    <!-- 技能证书 -->
    <section class="section">
      <h2 class="section-title">技能证书</h2>
      <div class="section-content">
        <div class="item">
          <div v-html="resumeForm.certifications"></div>
          <ul v-if="resumeForm.skills.length">
            <li v-for="(skill, index) in resumeForm.skills" :key="index">{{ skill }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 自我评价 -->
    <section class="section">
      <h2 class="section-title">自我评价</h2>
      <div class="section-content">
        <div class="item">
          <div v-html="resumeForm.selfAssessment"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue'
import dayjs from 'dayjs'

const fileInput = ref<HTMLInputElement | null>(null)

const props = defineProps({
  resumeForm: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      gender: '',
      jobTitle: '',
      birthday: null,
      origin: '',
      politicalStatus: '',
      contact: '',
      email: '',
      education: [],
      experience: [],
      campusExperience: '',
      certifications: '',
      skills: [],
      selfAssessment: '',
      photoUrl: ''
    })
  }
})

const formatDate = (date: Date | null) => {
  return date ? dayjs(date).format('YYYY.MM') : ''
}

const formatDateRange = (dateRange: Date[]) => {
  if (!dateRange) return ''
  const start = dayjs(dateRange[0]).format('YYYY.MM')
  const end = dateRange[1] ? dayjs(dateRange[1]).format('YYYY.MM') : '至今'
  return `${start}-${end}`
}

const uploadPhoto = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      props.resumeForm.photoUrl = result
    }
    reader.readAsDataURL(input.files[0])
  }
}
</script>

<style scoped>
.resume {
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #fff;
  margin: 20px auto;
  padding: 20px;
  max-width: 900px;
  border: 1px solid #eee;
  border-radius: 5px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header h1 {
  color: #e26386;
}
.icons {
  display: flex;
  gap: 10px;
}
.icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.icon.red {
  background-color: #e26386;
}
.icon.orange {
  background-color: #f4a261;
}
.icon.pink {
  background-color: #f699c8;
}
.section {
  margin-bottom: 20px;
}
.section-title {
  font-size: 1.5em;
  color: #e26386;
  border-left: 5px solid #e26386;
  padding-left: 10px;
  margin-bottom: 10px;
}
.section-content {
  padding-left: 20px;
}
.basic-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  position: relative;
}
.info-item {
  flex: 1 1 50%;
  margin-bottom: 5px;
}
.photo {
  cursor: pointer;
}
.photo img {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  margin-top: 10px;
}
.upload-placeholder {
  width: 100px;
  height: 120px;
  border: 2px dashed #e26386;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #e26386;
  font-size: 12px;
  margin-top: 10px;
  padding: 5px;
}
.item {
  margin-bottom: 15px;
}
.item-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
ul {
  margin-top: 5px;
  padding-left: 20px;
  list-style: disc;
}
</style>
