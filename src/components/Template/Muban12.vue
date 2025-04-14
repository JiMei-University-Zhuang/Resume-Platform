<template>
  <div class="resume">
    <div class="header">
      <div class="name-section">
        <h1>{{ resumeForm.name }}</h1>
        <div class="divider"></div>
        <p>{{ resumeForm.jobTitle }}</p>
      </div>
      
      <div class="photo-section" @click="uploadPhoto">
        <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="个人照片" />
        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
        <div v-if="!resumeForm.photoUrl" class="photo-placeholder">
          <span>添加照片</span>
        </div>
      </div>
    </div>
    
    <div class="two-column-section">
      <div class="left-column">
        <section class="resume-section">
          <h2>个人信息</h2>
          <div class="personal-info">
            <div class="info-item">
              <div class="info-icon">✉</div>
              <div class="info-text">{{ resumeForm.email }}</div>
            </div>
            <div class="info-item">
              <div class="info-icon">☎</div>
              <div class="info-text">{{ resumeForm.contact }}</div>
            </div>
            <div class="info-item">
              <div class="info-icon">⌂</div>
              <div class="info-text">{{ resumeForm.currentResidence }}</div>
            </div>
            <div class="info-item">
              <div class="info-icon">⚲</div>
              <div class="info-text">{{ resumeForm.origin }}</div>
            </div>
          </div>
        </section>
        
        <section class="resume-section">
          <h2>技能专长</h2>
          <div class="skills-list">
            <div v-for="(skill, index) in resumeForm.skills" :key="index" class="skill-tag">
              {{ skill }}
            </div>
          </div>
        </section>
        
        <section class="resume-section">
          <h2>荣誉证书</h2>
          <ul class="simple-list">
            <li v-for="(cert, index) in certifications" :key="index">{{ cert }}</li>
          </ul>
        </section>
      </div>
      
      <div class="right-column">
        <section class="resume-section">
          <h2>自我评价</h2>
          <div class="self-assessment">
            {{ resumeForm.selfAssessment }}
          </div>
        </section>
        
        <section class="resume-section">
          <h2>教育背景</h2>
          <div v-for="(edu, index) in resumeForm.education" :key="index" class="education-item">
            <div class="edu-header">
              <div class="edu-degree">{{ edu.degree }}</div>
              <div class="edu-period">{{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}</div>
            </div>
            <div class="edu-school">{{ edu.school }}</div>
            <div class="edu-major">{{ edu.major }}</div>
          </div>
        </section>
        
        <section class="resume-section">
          <h2>工作经验</h2>
          <div v-for="(exp, index) in resumeForm.experience" :key="index" class="experience-item">
            <div class="exp-header">
              <div class="exp-position">{{ exp.position }}</div>
              <div class="exp-period">{{ formatDate(exp.time[0]) }} - {{ formatDate(exp.time[1]) }}</div>
            </div>
            <div class="exp-company">{{ exp.company }}</div>
            <ul class="exp-description">
              <li v-for="(item, i) in exp.description.split('\n').filter(l => l)" :key="i">{{ item }}</li>
            </ul>
          </div>
        </section>
        
        <section class="resume-section">
          <h2>校园经历</h2>
          <ul class="campus-list">
            <li v-for="(item, index) in campusExperience" :key="index">{{ item }}</li>
          </ul>
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
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eaeaea;
}

.name-section {
  flex: 1;
}

.name-section h1 {
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0;
  color: #000;
  letter-spacing: 1px;
}

.divider {
  width: 40px;
  height: 3px;
  background-color: #000;
  margin: 15px 0;
}

.name-section p {
  font-size: 1.2rem;
  margin: 0;
  color: #555;
}

.photo-section {
  width: 120px;
  height: 150px;
  margin-left: 30px;
  overflow: hidden;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #eaeaea;
}

.photo-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
  color: #888;
  font-size: 0.8rem;
}

.two-column-section {
  display: flex;
  flex: 1;
}

.left-column {
  width: 30%;
  padding: 40px 30px;
  background-color: #f8f8f8;
  border-right: 1px solid #eaeaea;
}

.right-column {
  width: 70%;
  padding: 40px;
}

.resume-section {
  margin-bottom: 30px;
}

.resume-section h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.personal-info .info-item {
  display: flex;
  margin-bottom: 12px;
  align-items: center;
}

.info-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: #333;
  color: #fff;
  border-radius: 50%;
  font-size: 0.85rem;
}

.info-text {
  font-size: 0.95rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  padding: 6px 12px;
  background-color: #eee;
  border-radius: 3px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 8px;
}

.simple-list {
  padding-left: 18px;
  margin: 0;
}

.simple-list li {
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.self-assessment {
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: justify;
}

.education-item, .experience-item {
  margin-bottom: 20px;
}

.edu-header, .exp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.edu-degree, .exp-position {
  font-size: 1.05rem;
  font-weight: 600;
}

.edu-period, .exp-period {
  font-size: 0.9rem;
  color: #666;
}

.edu-school, .exp-company {
  font-size: 1rem;
  margin-bottom: 5px;
}

.edu-major {
  font-size: 0.95rem;
  color: #555;
  font-style: italic;
  margin-bottom: 5px;
}

.exp-description {
  padding-left: 18px;
  margin: 10px 0 0 0;
}

.exp-description li {
  margin-bottom: 5px;
  font-size: 0.95rem;
}

.campus-list {
  padding-left: 18px;
  margin: 0;
}

.campus-list li {
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