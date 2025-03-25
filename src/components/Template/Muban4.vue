<template>
  <div class="resume">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="resume-title">RESUME</div>
        <div class="name-info">
          <h2>{{ resumeForm.name }}</h2>
          <p>{{ resumeForm.jobTitle }}</p>
        </div>
      </div>
      <div class="header-right">
        <el-upload
          class="photo-upload"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handlePhotoChange"
        >
          <img v-if="photoUrl" :src="photoUrl" class="photo" />
          <div v-else class="photo-placeholder">
            <el-icon><Plus /></el-icon>
            <span>上传照片</span>
          </div>
        </el-upload>
      </div>
    </header>

    <!-- Personal Information -->
    <section class="personal-info">
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>生日：{{ resumeForm.birthday }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>现居：{{ resumeForm.currentResidence }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>电话：{{ resumeForm.contact }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>邮箱：{{ resumeForm.email }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>政治面貌：{{ resumeForm.politicalStatus }}</span>
      </div>
    </section>

    <!-- Section: Education -->
    <section class="education">
      <div class="section-header">
        <div class="icon-placeholder"></div>
        <span>教育背景</span>
      </div>
      <div class="section-content">
        <div v-for="(edu, index) in resumeForm.education" :key="index" class="education-item">
          <div class="edu-main-info">
            <span class="time">{{ formatDateRange(edu.time) }}</span>
            <span class="school">{{ edu.school }}</span>
            <span class="major">{{ edu.major }}</span>
            <span class="degree">{{ edu.degree }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Section: Work Experience -->
    <section class="work-experience">
      <div class="section-header">
        <div class="icon-placeholder"></div>
        <span>工作经历</span>
      </div>
      <div class="section-content">
        <div v-for="(exp, index) in resumeForm.experience" :key="index" class="work-item">
          <div class="work-main-info">
            <span class="time">{{ formatDateRange(exp.time) }}</span>
            <span class="company">{{ exp.company }}</span>
            <span class="position">{{ exp.position }}</span>
          </div>
          <p class="details">{{ exp.description }}</p>
        </div>
      </div>
    </section>

    <!-- Section: Skills -->
    <section class="skills">
      <div class="section-header">
        <div class="icon-placeholder"></div>
        <span>技能证书</span>
      </div>
      <div class="section-content">
        <div class="skills-tags">
          <el-tag v-for="skill in resumeForm.skills" :key="skill" class="skill-tag" effect="plain">
            {{ skill }}
          </el-tag>
        </div>
        <p v-if="resumeForm.certifications" class="certifications">
          {{ resumeForm.certifications }}
        </p>
      </div>
    </section>

    <!-- Section: Self Evaluate -->
    <section class="self-evaluation">
      <div class="section-header">
        <div class="icon-placeholder"></div>
        <span>自我评价</span>
      </div>
      <div class="section-content">
        <p>{{ resumeForm.selfAssessment }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  resumeForm: {
    type: Object,
    required: true
  }
})

const photoUrl = ref('')

const handlePhotoChange = file => {
  photoUrl.value = URL.createObjectURL(file.raw)
}

const formatDateRange = dateRange => {
  if (!dateRange || !Array.isArray(dateRange)) return ''
  const startDate = new Date(dateRange[0])
  const endDate = new Date(dateRange[1])
  return `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')} - ${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}`
}
</script>

<style scoped>
/* 全局样式 */
.resume {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #1f3a93;
  padding-bottom: 20px;
}

.resume-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: #1f3a93;
  padding: 8px 15px;
  border-radius: 4px;
}

.name-info {
  margin-top: 15px;
}

.name-info h2 {
  font-size: 24px;
  margin: 0;
  color: #1f3a93;
}

.name-info p {
  margin: 5px 0 0;
  color: #666;
  font-size: 16px;
}

.photo-upload {
  width: 120px;
  height: 150px;
}

.photo-placeholder {
  width: 120px;
  height: 150px;
  background-color: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.photo-placeholder:hover {
  border-color: #1f3a93;
  color: #1f3a93;
}

.photo {
  width: 120px;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
}

/* Personal Info */
.personal-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.icon-placeholder {
  width: 16px;
  height: 16px;
  background-color: #1f3a93;
  margin-right: 10px;
  border-radius: 50%;
}

/* Sections */
.section-header {
  display: flex;
  align-items: center;
  margin: 25px 0 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #1f3a93;
}

.section-header span {
  font-size: 18px;
  font-weight: bold;
  color: #1f3a93;
  margin-left: 10px;
}

.section-content {
  padding: 0 10px;
}

/* Education */
.education-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.edu-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.time {
  color: #666;
  min-width: 180px;
}

.school {
  font-weight: bold;
  color: #1f3a93;
  min-width: 200px;
}

.major {
  color: #333;
  min-width: 150px;
}

.degree {
  color: #666;
}

/* Work Experience */
.work-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.work-main-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.company {
  font-weight: bold;
  color: #1f3a93;
  min-width: 200px;
}

.position {
  color: #333;
  min-width: 150px;
}

.details {
  color: #666;
  line-height: 1.6;
  margin: 10px 0 0;
  padding-left: 15px;
  border-left: 3px solid #1f3a93;
}

/* Skills */
.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.skill-tag {
  margin-right: 8px;
}

.certifications {
  color: #666;
  line-height: 1.6;
  margin: 10px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

/* Self Evaluation */
.self-evaluation p {
  color: #666;
  line-height: 1.8;
  text-align: justify;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
  margin: 0;
}
</style>
