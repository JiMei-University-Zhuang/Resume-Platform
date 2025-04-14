<template>
  <div class="resume">
    <header class="resume-header">
      <div class="header-banner">
        <h1 class="header-name">{{ resumeForm.name }}</h1>
        <p class="header-title">{{ resumeForm.jobTitle }}</p>
      </div>
    </header>

    <div class="resume-content">
      <!-- 左侧信息栏 -->
      <div class="sidebar">
        <div class="photo-container" @click="uploadPhoto">
          <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="个人照片" />
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
          <div v-if="!resumeForm.photoUrl" class="photo-placeholder">
            <i class="photo-icon"></i>
            <span>点击上传照片</span>
          </div>
        </div>

        <div class="card contact-card">
          <h2 class="card-title">联系方式</h2>
          <ul class="contact-list">
            <li>
              <i class="icon email-icon"></i>
              <span>{{ resumeForm.email }}</span>
            </li>
            <li>
              <i class="icon phone-icon"></i>
              <span>{{ resumeForm.contact }}</span>
            </li>
            <li>
              <i class="icon location-icon"></i>
              <span>{{ resumeForm.currentResidence }}</span>
            </li>
            <li>
              <i class="icon origin-icon"></i>
              <span>{{ resumeForm.origin }}</span>
            </li>
          </ul>
        </div>

        <div class="card skills-card">
          <h2 class="card-title">专业技能</h2>
          <div class="skills-container">
            <div v-for="(skill, index) in resumeForm.skills" :key="index" class="skill-item">
              <div class="skill-info">
                <span class="skill-name">{{ skill }}</span>
                <span class="skill-level">{{ getSkillLevel(index) }}</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: getSkillProgress(index) }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card certs-card">
          <h2 class="card-title">证书荣誉</h2>
          <ul class="cert-list">
            <li v-for="(cert, index) in certifications" :key="index">
              <i class="cert-icon"></i>
              <span>{{ cert }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧主内容区 -->
      <div class="main-content">
        <div class="card summary-card">
          <h2 class="card-title">个人简介</h2>
          <p class="summary-text">{{ resumeForm.selfAssessment }}</p>
        </div>

        <div class="card education-card">
          <h2 class="card-title">教育背景</h2>
          <div class="timeline">
            <div v-for="(edu, index) in resumeForm.education" :key="index" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-date">{{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}</div>
                <h3 class="timeline-title">{{ edu.school }}</h3>
                <div class="timeline-subtitle">{{ edu.major }} - {{ edu.degree }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card experience-card">
          <h2 class="card-title">工作经验</h2>
          <div class="timeline">
            <div v-for="(exp, index) in resumeForm.experience" :key="index" class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <div class="timeline-date">{{ formatDate(exp.time[0]) }} - {{ formatDate(exp.time[1]) }}</div>
                <h3 class="timeline-title">{{ exp.company }}</h3>
                <div class="timeline-subtitle">{{ exp.position }}</div>
                <ul class="timeline-details">
                  <li v-for="(item, i) in exp.description.split('\n').filter(l => l)" :key="i">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="card campus-card">
          <h2 class="card-title">校园经历</h2>
          <ul class="campus-list">
            <li v-for="(item, index) in campusExperience" :key="index">
              <span class="campus-bullet"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref, computed } from 'vue'
import dayjs from 'dayjs'

interface ResumeForm {
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
  photoUrl: string
}

const props = defineProps({
  resumeForm: {
    type: Object as PropType<ResumeForm>,
    required: true
  }
})

const fileInput = ref<HTMLInputElement | null>(null)

const certifications = computed(() => 
  props.resumeForm.certifications.split('\n').filter(cert => cert.trim())
)

const campusExperience = computed(() => 
  props.resumeForm.campusExperience.split('\n').filter(exp => exp.trim())
)

const formatDate = (date: Date | null) => {
  return date ? dayjs(date).format('YYYY.MM') : ''
}

const uploadPhoto = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    const reader = new FileReader()
    reader.onload = e => {
      const result = e.target?.result as string
      props.resumeForm.photoUrl = result
    }
    reader.readAsDataURL(file)
  }
}

// 生成随机技能等级和进度条
const getSkillLevel = (index: number) => {
  const levels = ['熟练', '精通', '良好', '掌握', '熟悉']
  return levels[index % levels.length]
}

const getSkillProgress = (index: number) => {
  const progress = [95, 85, 75, 90, 80]
  return `${progress[index % progress.length]}%`
}
</script>

<style scoped>
.resume {
  width: 210mm; /* A4纸宽度 */
  min-height: 297mm; /* A4高度 */
  margin: 0 auto;
  font-family: "Source Sans Pro", "Microsoft YaHei", sans-serif;
  color: #333;
  background-color: #f9f9f9;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.resume-header {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  padding: 30px;
  color: white;
  text-align: center;
}

.header-name {
  font-size: 2.4rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 1.2rem;
  margin: 8px 0 0;
  font-weight: 300;
  opacity: 0.9;
}

.resume-content {
  display: flex;
  padding: 25px;
  gap: 25px;
}

.sidebar {
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.main-content {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 1.25rem;
  color: #2ecc71;
  margin-top: 0;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
  position: relative;
}

.card-title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 50px;
  height: 2px;
  background-color: #2ecc71;
}

.photo-container {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: white;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  color: #aaa;
}

.photo-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  background-color: #ccc;
  border-radius: 50%;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  background-color: #2ecc71;
  border-radius: 50%;
}

.skills-container {
  margin-top: 15px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.skill-name {
  font-size: 0.95rem;
}

.skill-level {
  font-size: 0.85rem;
  color: #777;
}

.skill-bar {
  height: 6px;
  background-color: #eee;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #1abc9c);
  border-radius: 3px;
}

.cert-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cert-list li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.cert-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #2ecc71;
  margin-right: 12px;
}

.summary-text {
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: justify;
  color: #444;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 8px;
  width: 2px;
  background-color: #eee;
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
}

.timeline-marker {
  position: absolute;
  left: -30px;
  top: 5px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #2ecc71;
  border: 3px solid white;
  box-shadow: 0 0 0 2px rgba(46, 204, 113, 0.3);
}

.timeline-date {
  font-size: 0.85rem;
  color: #2ecc71;
  font-weight: 600;
  margin-bottom: 5px;
}

.timeline-title {
  font-size: 1.1rem;
  margin: 0 0 5px;
  color: #333;
}

.timeline-subtitle {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 10px;
}

.timeline-details {
  padding-left: 18px;
  margin: 10px 0 0;
}

.timeline-details li {
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #555;
}

.campus-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.campus-list li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  font-size: 0.95rem;
  display: flex;
  align-items: flex-start;
}

.campus-bullet {
  width: 8px;
  height: 8px;
  background-color: #2ecc71;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 8px;
}

@media print {
  .resume {
    box-shadow: none;
    background-color: white;
  }
  
  /* 确保打印颜色正确 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style> 