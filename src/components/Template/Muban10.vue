<template>
  <div class="resume-container">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h1>PERSONAL RESUME</h1>
        <h2>{{ resumeForm.name }}</h2>
        <p><span>出生年月：</span>{{ formatDate(resumeForm.birthday) }}</p>
        <p><span>籍贯：</span>{{ resumeForm.origin }}</p>
        <p><span>联系方式：</span>{{ resumeForm.contact }}</p>
        <p><span>求职意向：</span>{{ resumeForm.jobTitle }}</p>
        <p><span>政治面貌：</span>{{ resumeForm.politicalStatus }}</p>
        <p><span>现居：</span>{{ resumeForm.currentResidence }}</p>
        <p><span>邮箱：</span>{{ resumeForm.email }}</p>
      </div>
      <div class="header-right" @click="uploadPhoto">
        <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="个人照片" />
        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
        <div v-if="!resumeForm.photoUrl" class="upload-placeholder">
          <span>点击上传照片</span>
        </div>
      </div>
    </div>

    <!-- Education Section -->
    <section class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>教育背景</h2>
      </div>
      <div class="section-content">
        <div v-for="(edu, index) in resumeForm.education" :key="index" class="item">
          <div class="item-header">
            <span class="time">{{ formatDateRange(edu.time) }}</span>
            <span>{{ edu.school }} | {{ edu.major }}</span>
            <span class="role">{{ edu.degree }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Work Experience Section -->
    <section class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>工作经历</h2>
      </div>
      <div class="section-content">
        <div v-for="(exp, index) in resumeForm.experience" :key="index" class="item">
          <div class="item-header">
            <span class="time">{{ formatDateRange(exp.time) }}</span>
            <span>{{ exp.company }}</span>
            <span class="role">{{ exp.position }}</span>
          </div>
          <p>{{ exp.description }}</p>
        </div>
      </div>
    </section>

    <!-- Campus Experience Section -->
    <section class="section" v-if="resumeForm.campusExperience">
      <div class="section-header">
        <div class="icon"></div>
        <h2>在校经历</h2>
      </div>
      <div class="section-content">
        <div class="item">
          <p>{{ resumeForm.campusExperience }}</p>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="section" v-if="resumeForm.skills && resumeForm.skills.length > 0">
      <div class="section-header">
        <div class="icon"></div>
        <h2>专业技能</h2>
      </div>
      <div class="section-content">
        <div class="skills-container">
          <span v-for="(skill, index) in resumeForm.skills" :key="index" class="skill-tag">{{
            skill
          }}</span>
        </div>
      </div>
    </section>

    <!-- Honors Section -->
    <section class="section" v-if="resumeForm.honors">
      <div class="section-header">
        <div class="icon"></div>
        <h2>荣誉奖励</h2>
      </div>
      <div class="section-content">
        <div class="item">
          <p>{{ resumeForm.honors }}</p>
        </div>
      </div>
    </section>

    <!-- Certifications Section -->
    <section class="section" v-if="resumeForm.certifications">
      <div class="section-header">
        <div class="icon"></div>
        <h2>技能证书</h2>
      </div>
      <div class="section-content">
        <div class="item">
          <p>{{ resumeForm.certifications }}</p>
        </div>
      </div>
    </section>

    <!-- Self Assessment Section -->
    <section class="section" v-if="resumeForm.selfAssessment">
      <div class="section-header">
        <div class="icon"></div>
        <h2>自我评价</h2>
      </div>
      <div class="section-content">
        <div class="item">
          <p>{{ resumeForm.selfAssessment }}</p>
        </div>
      </div>
    </section>
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

const formatDate = (date: Date | null) => {
  return date ? dayjs(date).format('YYYY.MM') : ''
}

const formatDateRange = (dateRange: [Date, Date]) => {
  if (!dateRange || !Array.isArray(dateRange)) return ''
  return `${formatDate(dateRange[0])} - ${formatDate(dateRange[1])}`
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
      // 更新 resumeForm 的 photoUrl 属性以显示新上传的图片
      props.resumeForm.photoUrl = result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.resume-container {
  font-family: 'Arial', sans-serif;
  background-color: #f9fafa;
  max-width: 820px;
  margin: 20px auto;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: #333;
}

.header {
  display: flex;
  justify-content: space-between;
  background-color: #daf1ed;
  padding: 25px;
  margin-bottom: 25px;
  border-radius: 8px;
}

.header-left {
  flex: 1;
}

.header-left h1 {
  color: #2e817f;
  font-size: 1.5em;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.header-left h2 {
  font-size: 2em;
  font-weight: bold;
  margin: 10px 0 15px;
  color: #333;
}

.header-left p {
  margin: 8px 0;
  font-size: 14px;
}

.header-left span {
  font-weight: bold;
  color: #2e817f;
  margin-right: 5px;
}

.header-right {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  cursor: pointer;
}

.header-right img {
  width: 120px;
  height: 160px;
  border-radius: 5px;
  object-fit: cover;
  border: 2px solid #2e817f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-placeholder {
  width: 120px;
  height: 160px;
  border: 2px dashed #2e817f;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f8f7;
  color: #2e817f;
  font-size: 14px;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  background-color: #e0f0ee;
}

.section {
  margin-bottom: 25px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 2px solid #daf1ed;
  padding-bottom: 10px;
}

.section-header .icon {
  width: 18px;
  height: 18px;
  background-color: #2e817f;
  border-radius: 50%;
  margin-right: 10px;
}

.section-header h2 {
  font-size: 1.3em;
  font-weight: bold;
  color: #2e817f;
  margin: 0;
}

.section-content {
  padding-left: 28px;
}

.item {
  margin-bottom: 15px;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  flex-wrap: nowrap;
}

.item-header .time {
  color: #2e817f;
  min-width: 180px;
  flex-shrink: 0;
}

.item-header .role {
  font-weight: normal;
  font-style: italic;
  color: #666;
  margin-left: auto;
}

.item p {
  margin-top: 8px;
  margin-left: 180px;
  color: #666;
  line-height: 1.5;
}

.item p {
  margin: 8px 0;
  line-height: 1.6;
  text-align: justify;
}

ul {
  padding-left: 20px;
  list-style: disc;
  margin: 10px 0;
}

li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.skill-tag {
  background-color: #e0f0ee;
  color: #2e817f;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  display: inline-block;
  border: 1px solid #c5e3e0;
}

@media print {
  .resume-container {
    box-shadow: none;
    margin: 0;
    padding: 20px;
  }

  .header-right img {
    border: 1px solid #2e817f;
  }

  .section {
    box-shadow: none;
    page-break-inside: avoid;
  }
}
</style>
