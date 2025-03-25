<template>
  <div class="resume-container">
    <!-- Header -->
    <div class="header">
      <h1>个人简历</h1>
    </div>

    <!-- 基本信息 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>基本信息</h2>
      </div>
      <div class="info">
        <div>
          <p>姓 名：{{ resumeForm.name }}</p>
          <p>性 别：{{ resumeForm.gender }}</p>
          <p>政治面貌：{{ resumeForm.politicalStatus }}</p>
          <p>籍 贯：{{ resumeForm.origin }}</p>
        </div>
        <div>
          <p>求职意向：{{ resumeForm.jobTitle }}</p>
          <p>出生年月：{{ formatDate(resumeForm.birthday) }}</p>
          <p>现居地址：{{ resumeForm.currentResidence }}</p>
          <p>联系方式：{{ resumeForm.contact }}</p>
        </div>
        <div class="photo" @click="uploadPhoto">
          <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" class="avatar" />
          <div v-else class="upload-placeholder">
            <span>点击上传证件照</span>
          </div>
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>教育背景</h2>
      </div>
      <div v-for="(edu, index) in resumeForm.education" :key="index" class="info">
        <p>{{ formatDateRange(edu.time) }} | {{ edu.school }} | {{ edu.major }}</p>
        <p>学历：{{ edu.degree }}</p>
      </div>
    </div>

    <!-- 工作经历 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>工作经历</h2>
      </div>
      <div v-for="(exp, index) in resumeForm.experience" :key="index" class="info">
        <p>{{ formatDateRange(exp.time) }} | {{ exp.company }} | {{ exp.position }}</p>
        <p>{{ exp.description }}</p>
      </div>
    </div>

    <!-- 在校经历 -->
    <div class="section" v-if="resumeForm.campusExperience">
      <div class="section-header">
        <div class="icon"></div>
        <h2>在校经历</h2>
      </div>
      <div class="info">
        <p>{{ resumeForm.campusExperience }}</p>
      </div>
    </div>

    <!-- 技能证书 -->
    <div class="section" v-if="resumeForm.certifications">
      <div class="section-header">
        <div class="icon"></div>
        <h2>技能证书</h2>
      </div>
      <div class="info">
        <p>{{ resumeForm.certifications }}</p>
      </div>
    </div>

    <!-- 自我评价 -->
    <div class="section" v-if="resumeForm.selfAssessment">
      <div class="section-header">
        <div class="icon"></div>
        <h2>自我评价</h2>
      </div>
      <div class="info">
        <p>{{ resumeForm.selfAssessment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

interface Props {
  resumeForm: {
    name: string
    gender: string
    jobTitle: string
    birthday: Date | null
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
    photoUrl?: string
  }
}

const props = defineProps<Props>()
const fileInput = ref<HTMLInputElement | null>(null)

// 日期格式化
const formatDate = (date: Date | null) => {
  return date ? dayjs(date).format('YYYY.MM') : ''
}

// 时间段格式化
const formatDateRange = (dates: [Date, Date]) => {
  if (!dates || dates.length < 2) return ''
  const start = dayjs(dates[0]).format('YYYY.MM')
  const end = dayjs(dates[1]).format('YYYY.MM')
  return `${start} - ${end}`
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
.resume-container {
  width: 750px;
  margin: 20px auto;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  font-family: Arial, sans-serif;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transform: scale(0.7);
  transform-origin: top left;
}

.header {
  background-color: #e7e4f7;
  text-align: center;
  padding: 20px 0;
  border-bottom: 2px solid #7f66b2;
}

.header h1 {
  color: #7f66b2;
  font-weight: bold;
  margin: 0;
  font-size: 24px;
}

.section {
  margin: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.section-header .icon {
  width: 10px;
  height: 30px;
  background-color: #7f66b2;
  margin-right: 10px;
  border-radius: 5px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #7f66b2;
  font-weight: bold;
}

.info {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-left: 4px solid #e7e4f7;
  padding-left: 15px;
}

.info > div {
  flex: 1;
  margin-right: 20px;
}

.photo {
  width: 120px;
  height: 160px;
  border: 2px dashed #7f66b2;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  color: #7f66b2;
  font-size: 14px;
  text-align: center;
}

.info p {
  margin: 5px 0;
  line-height: 1.5;
  font-size: 14px;
}

.info p:first-child {
  font-weight: bold;
}
</style>
