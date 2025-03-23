<template>
  <div class="resume">
    <!-- 简历头部 -->
    <div class="resume-header">
      <div class="title">个人简历</div>
    </div>

    <!-- 个人信息 -->
    <div class="section">
      <h2 class="section-title">个人信息</h2>
      <div class="personal-info">
        <div>
          <p>
            姓名：<span>{{ resumeForm.name }}</span>
          </p>
          <p>
            性别：<span>{{ resumeForm.gender }}</span>
          </p>
          <p>
            生日：<span>{{ formatDate(resumeForm.birthday) }}</span>
          </p>
          <p>
            籍贯：<span>{{ resumeForm.origin }}</span>
          </p>
          <p>
            现居：<span>{{ resumeForm.currentResidence }}</span>
          </p>
          <p>
            政治面貌：<span>{{ resumeForm.politicalStatus }}</span>
          </p>
          <p>
            电话：<span>{{ resumeForm.contact }}</span>
          </p>
          <p>
            邮箱：<span>{{ resumeForm.email }}</span>
          </p>
          <p>
            QQ：<span>{{ resumeForm.qq }}</span>
          </p>
        </div>
       <div class="photo" @click="uploadPhoto">
  <img v-if="resumeForm.photoUrl" :src="resumeForm.photoUrl" alt="头像" />
  <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" hidden />
  <div v-if="!resumeForm.photoUrl" class="upload-placeholder">
    <button class="upload-button">上传头像</button>
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
      <ul>
        <li v-for="(edu, index) in resumeForm.education" :key="index">
          <p>
            {{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }} - {{ edu.school }} -
            {{ edu.major }} （{{ edu.degree }}）
          </p>
        </li>
      </ul>
    </div>

    <!-- 工作经验 -->
    <div class="section">
      <h2 class="section-title">工作经验</h2>
      <ul>
        <li v-for="(job, index) in resumeForm.experience" :key="index">
          <p>
            {{ formatDate(job.time[0]) }} - {{ formatDate(job.time[1]) }} - {{ job.company }} -
            {{ job.position }}
          </p>
          <p>{{ job.description }}</p>
        </li>
      </ul>
    </div>

    <!-- 在校经历 -->
    <div class="section">
      <h2 class="section-title">在校经历</h2>
      <ul>
        <li
          v-for="(activity, index) in resumeForm.campusExperience.split('\n').filter(a => a)"
          :key="index"
        >
          <p>{{ activity }}</p>
        </li>
      </ul>
    </div>

    <!-- 专业技能 -->
    <div class="section">
      <h2 class="section-title">专业技能</h2>
      <ul>
        <li v-for="(skill, index) in resumeForm.skills" :key="index">
          <p>{{ skill }}</p>
        </li>
      </ul>
    </div>

    <!-- 自我评价 -->
    <div class="section">
      <h2 class="section-title">自我评价</h2>
      <p>{{ resumeForm.selfAssessment }}</p>
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
    reader.onload = (e) => {
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
  display: block;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: auto;
  border: 1px solid #ddd;
  padding: 20px;
}
.resume-header {
  text-align: center;
  background-color: #557a95;
  color: #fff;
  padding: 10px 0;
}
.title {
  font-size: 24px;
  font-weight: bold;
}
.section {
  margin-top: 20px;
}
.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #557a95;
}
.personal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.personal-info div {
  flex: 1;
}
.photo {
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;

}
.photo img {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.upload-placeholder {
  display: flex;
  justify-content: flex-end;
  align-items: center;

}
.upload-button {
  background-color: #557a95;
  color: #fff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}
.upload-button:hover {
  background-color: #4a6984;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
p {
  margin: 0;
}
</style>
