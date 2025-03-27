<template>
  <div class="resume-container">
    <!-- 左侧部分 -->
    <div class="left-panel">
      <!-- 头像、姓名及职位 -->
      <div class="profile">
        <div class="avatar">
          <label class="upload-container">
            <div v-if="!profilePic" class="placeholder">
              <span>+</span>
              <p>上传照片</p>
            </div>
            <img v-else class="uploaded-photo" :src="profilePic" alt="用户照片" />
            <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" />
          </label>
        </div>
        <div class="name">{{ resumeForm.name }}</div>
        <div class="job-title">求职意向：{{ resumeForm.jobTitle }}</div>
      </div>

      <!-- 基本信息 -->
      <div class="section basic-info">
        <div class="section-title">
          <div class="icon"></div>
          <span>基本信息</span>
        </div>
        <ul class="info-list">
          <li>性别：{{ resumeForm.gender }}</li>
          <li>籍贯：{{ resumeForm.origin }}</li>
          <li>现居：{{ resumeForm.currentResidence }}</li>
          <li>政治面貌：{{ resumeForm.politicalStatus }}</li>
          <li>出生年月：{{ formatDate(resumeForm.birthday) }}</li>
        </ul>
      </div>

      <!-- 联系方式 -->
      <div class="section contact-info">
        <div class="section-title">
          <div class="icon"></div>
          <span>联系方式</span>
        </div>
        <ul class="info-list">
          <li>联系电话：{{ resumeForm.contact }}</li>
          <li>电子邮箱：{{ resumeForm.email }}</li>
        </ul>
      </div>
    </div>

    <!-- 右侧部分 -->
    <div class="right-panel">
      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>教育背景</span>
          <span class="title-en">Education</span>
        </div>
        <div class="content">
          <div class="education" v-for="(edu, index) in resumeForm.education" :key="index">
            <div>{{ formatDate(edu.time[0]) }} -- {{ formatDate(edu.time[1]) }}</div>
            <div>{{ edu.school }}</div>
            <div>{{ edu.major }}</div>
            <div>学历：{{ edu.degree }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>在校经历</span>
          <span class="title-en">Experience</span>
        </div>
        <ul class="content">
          <li>{{ resumeForm.campusExperience }}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>技能证书</span>
          <span class="title-en">Skill</span>
        </div>
        <ul class="content">
          <li v-for="(cert, index) in resumeForm.certifications.split(',')" :key="index">
            {{ cert.trim() }}
          </li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>自我评价</span>
          <span class="title-en">Evaluate</span>
        </div>
        <ul class="content">
          <li>{{ resumeForm.selfAssessment }}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>工作经验</span>
          <span class="title-en">Work Experience</span>
        </div>
        <ul class="content">
          <li v-for="(exp, index) in resumeForm.experience" :key="index">
            <div class="exp-header">
              <span class="company">{{ exp.company }}</span>
              <span class="position">{{ exp.position }}</span>
              <span class="time">{{ formatDate(exp.time[0]) }} -- {{ formatDate(exp.time[1]) }}</span>
            </div>
            <div class="description">{{ exp.description }}</div>
          </li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>荣誉奖励</span>
          <span class="title-en">Honors</span>
        </div>
        <ul class="content">
          <li>{{ resumeForm.honors }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import dayjs from 'dayjs'
import { ref } from 'vue'

const profilePic = ref('') // 保存上传的图片

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      profilePic.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }
}
const props = defineProps({
  resumeForm: {
    type: Object,
    required: true
  }
})

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return dayjs(date).format('YYYY.MM')
}
</script>

<style scoped>
.resume-container {
  display: flex;
  font-family: Arial, sans-serif;
  width: 800px;
  transform: scale(0.65);
  transform-origin: top left;
 
}

.left-panel {
  width: 35%;
  background-color: #f8f8f8;
  padding: 30px;
  border-right: 1px solid #e0e0e0;
}

.right-panel {
  width: 65%;
  padding: 30px;
}

.section {
  margin-bottom: 30px;
}

.profile {
  text-align: center;
}
.avatar {
  width: 107px; /* 将宽高改成等比例 */
  height: 150px;
  margin: 0 auto 10px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.avatar:hover {
  border-color: #307360;
}

.upload-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.placeholder {
  text-align: center;
  color: #999;
  font-size: 12px;
}

.placeholder span {
  font-size: 32px;
  font-weight: bold;
}

.uploaded-photo {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
}

input[type='file'] {
  display: none;
}

.name {
  font-size: 20px;
  font-weight: bold;
}

.job-title {
  color: #666;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
}

.education {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 5px;
}

.education > div {
  margin-bottom: 8px;
}

.content li {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #fafafa;
  border-radius: 5px;
}

.section-title {
  display: flex;
  align-items: center;
  font-weight: bold;
  color: #307360;
  margin-bottom: 10px;
}

.section .content {
  line-height: 1.6;
  color: #333;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  margin-bottom: 5px;
}

.icon {
  width: 16px;
  height: 16px;
  background: #307360;
  margin-right: 10px;
}

.title-en {
  margin-left: auto;
  color: #aaa;
  font-size: 12px;
}

.education {
  margin-bottom: 20px;
}

.experience {
  margin-bottom: 20px;
}
.exp-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.company {
  font-weight: bold;
  color: #307360;
}

.position {
  color: #666;
}

.time {
  color: #999;
  margin-left: auto;
}

.description {
  color: #333;
  line-height: 1.5;
}
</style>
