<template>
  <div class="resume">
    <!-- 个人信息部分 -->
    <div class="left-section">
      <div class="photo">
        <div class="photo-placeholder">照片区域</div>
      </div>
      <div class="name-info">
        <h2>{{ resumeForm.name }}</h2>
        <p>{{ resumeForm.jobTitle }}</p>
      </div>
      <div class="info-section">
        <h3>基本信息</h3>
        <ul>
          <li>性别：{{ resumeForm.gender }}</li>
          <li>籍贯：{{ resumeForm.origin }}</li>
          <li>现居：{{ resumeForm.currentResidence }}</li>
          <li>政治面貌：{{ resumeForm.politicalStatus }}</li>
          <li>出生年月：{{ formatDate(resumeForm.birthday) }}</li>
        </ul>
      </div>
      <div class="info-section contact">
        <h3>联系方式</h3>
        <ul>
          <li>联系电话：{{ resumeForm.contact }}</li>
          <li>电子邮箱：{{ resumeForm.email }}</li>
        </ul>
      </div>
    </div>

    <!-- 主要内容部分 -->
    <div class="right-section">
      <div class="section">
        <div class="section-header">
          <div class="icon-placeholder"></div>
          <h3>教育背景</h3>
          <span>Education</span>
        </div>
        <div class="section-content">
          <div v-for="(edu, index) in resumeForm.education" :key="index" class="education">
            <div>{{ formatDate(edu.time[0]) }} 至 {{ formatDate(edu.time[1]) }}</div>
            <div>{{ edu.school }}</div>
            <div>{{ edu.major }}</div>
            <div>学历：{{ edu.degree }}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="icon-placeholder"></div>
          <h3>在校经历</h3>
          <span>Experience</span>
        </div>
        <div class="section-content">
          <div v-html="resumeForm.campusExperience"></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="icon-placeholder"></div>
          <h3>技能证书</h3>
          <span>Skill</span>
        </div>
        <div class="section-content">
          <div v-html="resumeForm.certifications"></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <div class="icon-placeholder"></div>
          <h3>自我评价</h3>
          <span>Evaluate</span>
        </div>
        <div class="section-content">
          <div v-html="resumeForm.selfAssessment"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import dayjs from 'dayjs'

// 定义 props
const props = defineProps({
  resumeForm: {
    type: Object,
    required: true
  }
})

// 将 props 解构为可响应式变量
const { resumeForm } = toRefs(props)

// 格式化日期
const formatDate = (date: Date | null) => {
  if (date) {
    return dayjs(date).format('YYYY.MM')
  }
  return ''
}
</script>

<style scoped>
/* 整体布局样式 */
.resume {
  display: flex;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: #333;
}

/* 左侧部分样式 */
.left-section {
  width: 30%;
  background-color: #f9f9f9;
  padding: 15px;
  border-right: 1px solid #ddd;
}
.photo-placeholder {
  width: 100%;
  height: 150px;
  background-color: #ddd;
  text-align: center;
  line-height: 150px;
  font-size: 14px;
  color: #666;
  border-radius: 5px;
}
.name-info {
  text-align: center;
}
.name-info h2 {
  margin: 10px 0 5px;
}
.info-section h3 {
  margin-top: 20px;
  font-size: 16px;
  color: #ba826f;
  border-bottom: 2px solid #ba826f;
}
ul {
  padding: 0;
  list-style-type: none;
  margin: 15px 0 0;
}
li {
  margin-bottom: 10px;
}

/* 右侧部分样式 */
.right-section {
  width: 70%;
  padding: 15px;
}
.section {
  margin-bottom: 30px;
}
.section-header {
  display: flex;
  align-items: center;
}
.icon-placeholder {
  width: 30px;
  height: 30px;
  background-color: #ba826f;
  margin-right: 10px;
  border-radius: 50%;
}
.section-header h3 {
  margin: 0;
  color: #ba826f;
  font-size: 16px;
}
.section-header span {
  margin-left: auto;
  font-size: 14px;
  color: #999;
}
.section-content {
  margin-top: 10px;
}
</style>
