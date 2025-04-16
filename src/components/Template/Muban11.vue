<template>
  <div class="resume">
    <header class="header">
      <div class="header-content">
        <h1>{{ resumeForm.name }}</h1>
        <p class="job-title">{{ resumeForm.jobTitle }}</p>
      </div>
      <div class="header-decoration"></div>
    </header>

    <div class="main-content">
      <div class="left-column">
        <div class="photo-container" @click="uploadPhoto">
          <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="个人照片" />
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
          <div v-if="!resumeForm.photoUrl" class="upload-placeholder">
            <span>点击上传照片</span>
          </div>
        </div>

        <section class="section">
          <h2 class="section-title"><i class="section-icon contact-icon"></i>联系方式</h2>
          <div class="contact-info">
            <div class="contact-item">
              <i class="contact-icon phone-icon"></i>
              <span>{{ resumeForm.contact }}</span>
            </div>
            <div class="contact-item">
              <i class="contact-icon email-icon"></i>
              <span>{{ resumeForm.email }}</span>
            </div>
            <div class="contact-item">
              <i class="contact-icon location-icon"></i>
              <span>{{ resumeForm.currentResidence }}</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title"><i class="section-icon skills-icon"></i>专业技能</h2>
          <div class="skills-container">
            <div v-for="(skill, index) in resumeForm.skills" :key="index" class="skill-item">
              <div class="skill-name">{{ skill }}</div>
              <div class="skill-bar">
                <div class="skill-level" :style="{ width: getRandomLevel() }"></div>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title"><i class="section-icon certificate-icon"></i>证书与荣誉</h2>
          <ul class="certificate-list">
            <li v-for="(cert, index) in certificates" :key="index">{{ cert }}</li>
          </ul>
        </section>
      </div>

      <div class="right-column">
        <section class="section">
          <h2 class="section-title"><i class="section-icon profile-icon"></i>个人简介</h2>
          <p class="profile-text">{{ resumeForm.selfAssessment }}</p>
        </section>

        <section class="section">
          <h2 class="section-title"><i class="section-icon education-icon"></i>教育背景</h2>
          <div v-for="(edu, index) in resumeForm.education" :key="index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-title">{{ edu.school }}</span>
                <span class="timeline-period"
                  >{{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}</span
                >
              </div>
              <p class="timeline-subtitle">{{ edu.major }} | {{ edu.degree }}</p>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title"><i class="section-icon experience-icon"></i>工作经验</h2>
          <div v-for="(exp, index) in resumeForm.experience" :key="index" class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-header">
                <span class="timeline-title">{{ exp.company }}</span>
                <span class="timeline-period"
                  >{{ formatDate(exp.time[0]) }} - {{ formatDate(exp.time[1]) }}</span
                >
              </div>
              <p class="timeline-subtitle">{{ exp.position }}</p>
              <div class="timeline-description">
                <ul>
                  <li v-for="(item, i) in exp.description.split('\n').filter(l => l)" :key="i">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2 class="section-title"><i class="section-icon campus-icon"></i>校园经历</h2>
          <div class="campus-experience">
            <ul>
              <li v-for="(item, index) in campusExperience" :key="index">{{ item }}</li>
            </ul>
          </div>
        </section>
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

const certificates = computed(() =>
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

// 只用于展示效果的随机技能等级函数
const getRandomLevel = () => {
  const levels = ['85%', '90%', '75%', '80%', '95%']
  return levels[Math.floor(Math.random() * levels.length)]
}
</script>

<style scoped>
.resume {
  width: 210mm; /* A4宽度 */
  min-height: 297mm; /* A4高度 */
  margin: 0 auto;
  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: #333;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.header {
  background: linear-gradient(135deg, #1a5276, #2980b9);
  color: white;
  padding: 30px 40px;
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.job-title {
  font-size: 1.2rem;
  margin-top: 5px;
  opacity: 0.9;
  font-weight: 300;
}

.header-decoration {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  z-index: 1;
}

.main-content {
  display: flex;
  flex: 1;
}

.left-column {
  width: 30%;
  background-color: #f5f7fa;
  padding: 30px 20px;
  border-right: 1px solid #e6e9ed;
}

.right-column {
  width: 70%;
  padding: 30px;
}

.section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a5276;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #2980b9;
  display: flex;
  align-items: center;
}

.section-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  background-color: #2980b9;
  display: inline-block;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.photo-container {
  width: 150px;
  height: 180px;
  margin: 0 auto 20px;
  border: 1px solid #e6e9ed;
  overflow: hidden;
  cursor: pointer;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  color: #95a5a6;
  text-align: center;
  padding: 10px;
  font-size: 0.9rem;
}

.contact-info {
  margin-top: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.95rem;
}

.contact-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  background-color: #2980b9;
  display: inline-block;
}

.skills-container {
  margin-top: 15px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-name {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.skill-bar {
  height: 6px;
  background-color: #e6e9ed;
  border-radius: 3px;
  overflow: hidden;
}

.skill-level {
  height: 100%;
  background: linear-gradient(90deg, #2980b9, #3498db);
  border-radius: 3px;
}

.certificate-list {
  padding-left: 20px;
  margin-top: 15px;
}

.certificate-list li {
  margin-bottom: 8px;
  font-size: 0.95rem;
  position: relative;
}

.profile-text {
  line-height: 1.6;
  text-align: justify;
  font-size: 0.95rem;
}

.timeline-item {
  position: relative;
  padding-left: 25px;
  margin-bottom: 25px;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #2980b9;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #2980b9;
}

.timeline-content {
  position: relative;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.timeline-title {
  font-weight: 600;
  font-size: 1.05rem;
  color: #2c3e50;
}

.timeline-period {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.timeline-subtitle {
  font-size: 0.95rem;
  color: #2980b9;
  margin-bottom: 10px;
  font-style: italic;
}

.timeline-description ul {
  padding-left: 20px;
  margin: 0;
}

.timeline-description li {
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.campus-experience ul {
  padding-left: 20px;
  margin: 0;
}

.campus-experience li {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

@media print {
  .resume {
    box-shadow: none;
    margin: 0;
  }

  /* 确保打印颜色正确 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style>
