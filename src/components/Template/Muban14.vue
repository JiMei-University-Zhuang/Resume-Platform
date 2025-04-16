<template>
  <div class="resume">
    <aside class="resume-sidebar">
      <div class="photo-wrapper" @click="uploadPhoto">
        <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="个人照片" />
        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
        <div v-if="!resumeForm.photoUrl" class="photo-placeholder">
          <div class="photo-icon"></div>
          <span>上传照片</span>
        </div>
      </div>

      <div class="sidebar-name">
        <h1>{{ resumeForm.name }}</h1>
        <div class="title-bar">
          <span>{{ resumeForm.jobTitle }}</span>
        </div>
      </div>

      <section class="sidebar-section">
        <h2>
          <span class="icon-contact"></span>
          联系方式
        </h2>
        <ul class="contact-list">
          <li>
            <span class="contact-label">电话:</span>
            <span class="contact-value">{{ resumeForm.contact }}</span>
          </li>
          <li>
            <span class="contact-label">邮箱:</span>
            <span class="contact-value">{{ resumeForm.email }}</span>
          </li>
          <li>
            <span class="contact-label">所在地:</span>
            <span class="contact-value">{{ resumeForm.currentResidence }}</span>
          </li>
          <li>
            <span class="contact-label">籍贯:</span>
            <span class="contact-value">{{ resumeForm.origin }}</span>
          </li>
        </ul>
      </section>

      <section class="sidebar-section">
        <h2>
          <span class="icon-skills"></span>
          专业技能
        </h2>
        <div class="skills-grid">
          <div v-for="(skill, index) in resumeForm.skills" :key="index" class="skill-pill">
            {{ skill }}
          </div>
        </div>
      </section>

      <section class="sidebar-section">
        <h2>
          <span class="icon-certificates"></span>
          证书与荣誉
        </h2>
        <ul class="certificate-list">
          <li v-for="(cert, index) in certifications" :key="index">{{ cert }}</li>
        </ul>
      </section>
    </aside>

    <main class="resume-main">
      <section class="main-section profile-section">
        <h2>
          <span class="icon-profile"></span>
          关于我
        </h2>
        <div class="profile-content">
          <p>{{ resumeForm.selfAssessment }}</p>
        </div>
      </section>

      <section class="main-section">
        <h2>
          <span class="icon-education"></span>
          教育背景
        </h2>
        <div class="education-timeline">
          <div v-for="(edu, index) in resumeForm.education" :key="index" class="timeline-entry">
            <div class="time-badge">
              {{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}
            </div>
            <div class="education-content">
              <h3>{{ edu.school }}</h3>
              <div class="education-details">
                <span class="degree">{{ edu.degree }}</span>
                <span class="major">{{ edu.major }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="main-section">
        <h2>
          <span class="icon-experience"></span>
          工作经验
        </h2>
        <div class="experience-items">
          <div v-for="(exp, index) in resumeForm.experience" :key="index" class="experience-item">
            <div class="experience-header">
              <div class="experience-title">
                <h3>{{ exp.position }}</h3>
                <div class="company-name">{{ exp.company }}</div>
              </div>
              <div class="experience-period">
                {{ formatDate(exp.time[0]) }} - {{ formatDate(exp.time[1]) }}
              </div>
            </div>
            <div class="experience-description">
              <ul>
                <li v-for="(item, i) in exp.description.split('\n').filter(l => l)" :key="i">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="main-section">
        <h2>
          <span class="icon-campus"></span>
          校园经历
        </h2>
        <div class="campus-activities">
          <ul class="campus-list">
            <li v-for="(item, index) in campusExperience" :key="index">{{ item }}</li>
          </ul>
        </div>
      </section>
    </main>
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
</script>

<style scoped>
.resume {
  width: 210mm; /* A4纸宽度 */
  min-height: 297mm; /* A4高度 */
  margin: 0 auto;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  display: flex;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  color: #333;
  background-color: #fff;
  position: relative;
}

.resume-sidebar {
  width: 30%;
  background: linear-gradient(135deg, #673ab7, #9c27b0);
  color: white;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.resume-main {
  width: 70%;
  padding: 40px;
  box-sizing: border-box;
}

/* Sidebar Elements */
.photo-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.photo-wrapper img {
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
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
}

.photo-icon {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  margin-bottom: 8px;
}

.sidebar-name {
  text-align: center;
  padding: 0 30px;
  margin-bottom: 30px;
}

.sidebar-name h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.title-bar {
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 5px 15px;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.9rem;
}

.sidebar-section {
  padding: 25px 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.sidebar-section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
}

.sidebar-section h2 span[class^='icon-'] {
  width: 20px;
  height: 20px;
  background-color: white;
  display: inline-block;
  margin-right: 10px;
  mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  border-radius: 4px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  margin-bottom: 12px;
  display: flex;
  font-size: 0.95rem;
}

.contact-label {
  width: 60px;
  opacity: 0.8;
}

.contact-value {
  flex: 1;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.skill-pill {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
}

.skill-pill:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.certificate-list {
  padding-left: 15px;
  margin: 15px 0 0;
}

.certificate-list li {
  margin-bottom: 8px;
  font-size: 0.95rem;
  position: relative;
}

/* Main Content Elements */
.main-section {
  margin-bottom: 35px;
  border-bottom: 1px solid #eee;
  padding-bottom: 25px;
}

.main-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.main-section h2 {
  color: #673ab7;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
}

.main-section h2 span[class^='icon-'] {
  width: 24px;
  height: 24px;
  background-color: #673ab7;
  display: inline-block;
  margin-right: 10px;
  mask-position: center;
  mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  border-radius: 4px;
}

.profile-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  text-align: justify;
}

.education-timeline {
  position: relative;
}

.timeline-entry {
  display: flex;
  margin-bottom: 20px;
  position: relative;
}

.time-badge {
  width: 100px;
  font-size: 0.85rem;
  color: #673ab7;
  font-weight: 600;
  padding: 5px 0;
}

.education-content {
  flex: 1;
  padding-left: 15px;
  border-left: 2px solid #eee;
  position: relative;
}

.education-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 10px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #673ab7;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #673ab7;
  z-index: 1;
}

.education-content h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.education-details {
  font-size: 0.95rem;
  color: #666;
}

.degree {
  margin-right: 10px;
  color: #673ab7;
}

.experience-items {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.experience-item {
  border-left: 2px solid #eee;
  padding-left: 20px;
  position: relative;
}

.experience-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 10px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #673ab7;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #673ab7;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.experience-title h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #333;
}

.company-name {
  font-size: 0.95rem;
  color: #673ab7;
  font-weight: 500;
}

.experience-period {
  font-size: 0.85rem;
  color: #777;
}

.experience-description ul {
  padding-left: 18px;
  margin: 10px 0 0;
}

.experience-description li {
  margin-bottom: 6px;
  font-size: 0.95rem;
  color: #555;
}

.campus-list {
  padding-left: 25px;
  margin: 15px 0 0;
}

.campus-list li {
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #444;
  position: relative;
}

.campus-list li::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #673ab7;
}

@media print {
  .resume {
    box-shadow: none;
  }

  /* 确保打印颜色正确 */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
</style>
