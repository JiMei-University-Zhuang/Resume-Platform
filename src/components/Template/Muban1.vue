<template>
  <div class="resume">
    <!-- 简历头部 -->
    <div class="resume-header">
      <div class="title">个人简历</div>
    </div>

    <!-- 个人信息 -->
    <div class="section personal-section">
      <h2 class="section-title">个人信息</h2>
      <div class="personal-info">
        <div class="info-columns">
          <div class="info-column">
            <p>
              姓名：<span>{{ resumeForm.name }}</span>
            </p>
            <p>
              生日：<span>{{ formatDate(resumeForm.birthday) }}</span>
            </p>
            <p>
              电话：<span>{{ resumeForm.contact }}</span>
            </p>
            <p>
              QQ：<span>{{ resumeForm.qq }}</span>
            </p>
          </div>
          <div class="info-column">
            <p>
              籍贯：<span>{{ resumeForm.origin }}</span>
            </p>
            <p>
              邮箱：<span>{{ resumeForm.email }}</span>
            </p>
            <p>
              性别：<span>{{ resumeForm.gender }}</span>
            </p>
            <p>
              政治面貌：<span>{{ resumeForm.politicalStatus }}</span>
            </p>
          </div>
        </div>
        <div class="photo" @click="uploadPhoto">
          <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="头像" />
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
          <div v-if="!resumeForm.photoUrl" class="upload-placeholder">
            <span>点击上传证件照</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 荣誉奖励 -->
    <div class="section">
      <h2 class="section-title">荣誉奖励</h2>
      <ul>
        <li v-for="(honor, index) in resumeForm.honors.split('\n').filter(h => h)" :key="index">
          <p>{{ honor }}</p>
        </li>
      </ul>
    </div>

    <!-- 技能证书 -->
    <div class="section">
      <h2 class="section-title">技能证书</h2>
      <ul>
        <li
          v-for="(cert, index) in resumeForm.certifications.split('\n').filter(c => c)"
          :key="index"
        >
          <p>{{ cert }}</p>
        </li>
      </ul>
    </div>

    <!-- 教育背景 -->
    <div class="section">
      <h2 class="section-title">教育背景</h2>
      <ul class="timeline-list">
        <li v-for="(edu, index) in resumeForm.education" :key="index">
          <div class="timeline-item">
            <div class="timeline-date">
              {{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}
            </div>
            <div class="timeline-content">
              <div class="timeline-title">
                <div class="school">{{ edu.school }}</div>
                <div class="major">{{ edu.major }}</div>
                <div class="degree">{{ edu.degree }}</div>
              </div>
             
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 工作经验 -->
    <div class="section">
      <h2 class="section-title">实习经历</h2>
      <ul class="timeline-list">
        <li v-for="(job, index) in resumeForm.experience" :key="index">
          <div class="timeline-item">
            <div class="timeline-date">
              {{ formatDate(job.time[0]) }} - {{ formatDate(job.time[1]) }}
            </div>
            <div class="timeline-content">
              <div class="timeline-title">{{ job.company }} - {{ job.position }}</div>
              <div class="timeline-description">
                <ul class="bullet-list">
                  <li v-for="(line, i) in job.description.split('\n').filter(l => l)" :key="i">
                    {{ line }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 在校经历 -->
    <div class="section">
      <h2 class="section-title">校园经历</h2>
      <ul class="timeline-list">
        <li v-if="resumeForm.campusExperience">
          <div class="timeline-content">
            <ul class="bullet-list">
              <li
                v-for="(activity, index) in resumeForm.campusExperience.split('\n').filter(a => a)"
                :key="index"
              >
                {{ activity }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <!-- 专业技能 -->
    <div class="section">
      <h2 class="section-title">专业技能</h2>
      <ul class="bullet-list skill-list">
        <li v-for="(skill, index) in resumeForm.skills" :key="index">
          {{ skill }}
        </li>
      </ul>
    </div>

    <!-- 自我评价 -->
    <div class="section">
      <h2 class="section-title">自我评价</h2>
      <div class="self-assessment">
        <p>{{ resumeForm.selfAssessment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref } from 'vue'
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
  photoUrl: string // 添加新的属性来存储图片URL
}

const props = defineProps({
  resumeForm: {
    type: Object as PropType<ResumeForm>,
    required: true
  }
})

const fileInput = ref<HTMLInputElement | null>(null)

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
      // 更新 resumeForm 的 photoUrl 属性以显示新上传的图片
      props.resumeForm.photoUrl = result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.resume {
  transform: scale(0.65);
  transform-origin: top left;
  width: 800px;
  display: block;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: auto;
  border: 1px solid #ddd;
  padding: 0;
  background-color: #fff;
}

.resume-header {
  text-align: center;
  background-color: #6c8eb3;
  color: #fff;
  padding: 15px 0;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.section {
  margin: 0;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #6c8eb3;
  padding: 5px 10px;
  display: inline-block;
  margin-bottom: 15px;
}

.personal-section {
  background-color: #fff;
}

.personal-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.info-columns {
  display: flex;
  flex: 3;
}

.info-column {
  flex: 1;
  padding-right: 20px;
}

.photo {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 120px;
}

.photo img {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.upload-placeholder {
  width: 120px;
  height: 160px;
  border: 2px dashed #6c8eb3;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #6c8eb3;
  font-size: 12px;
  cursor: pointer;
  padding: 5px;
}

.timeline-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-item {
  display: flex;
  margin-bottom: 15px;
}

.timeline-date {
  flex: 1;
  font-weight: bold;
  color: #555;
  min-width: 150px;
}

.timeline-content {
  flex: 3;
}

.timeline-title {
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  gap: 20px;
}

.timeline-title > span {
  flex: 1;
  text-align: left;
}

.timeline-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
}

.timeline-title > * {
  flex-basis: 30%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.timeline-degree {
  color: #666;
  font-style: italic;
}

.timeline-description {
  margin-top: 5px;
}

.bullet-list {
  list-style-type: disc;
  padding-left: 20px;
  margin: 5px 0;
}

.bullet-list li {
  margin-bottom: 5px;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-list li {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 14px;
}

.self-assessment {
  background-color: #f9f9f9;
  padding: 10px;
  border-left: 3px solid #6c8eb3;
}

p {
  margin: 0 0 5px 0;
}
</style>
10{5hght.6
