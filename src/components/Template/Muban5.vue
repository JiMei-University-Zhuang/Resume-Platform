<template>
  <div class="resume">
    <header class="header">
      <h1>PERSONAL RESUME</h1>
    </header>

    <div class="personal-info">
      <div class="name">
        <h2>{{ personal.name }}</h2>
        <p>求职意向：{{ personal.intendedPosition }}</p>
      </div>
      <div class="contact">
        <div class="icon" style="background-color: grey"></div>
        {{ personal.phone }}
        <div class="icon" style="background-color: grey"></div>
        {{ personal.email }}
        <div class="icon" style="background-color: grey"></div>
        {{ personal.location }}
      </div>
      <div class="photo" @click="triggerFileInput">
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept="image/*"
          style="display: none"
        />
        <div v-if="photoUrl" class="photo-preview">
          <img :src="photoUrl" alt="个人照片" />
        </div>
        <div v-else class="fake-photo">
          <span>点击上传照片</span>
        </div>
      </div>
    </div>

    <section class="section">
      <h3>教育背景 / Education</h3>
      <p>
        {{ education.startDate }} - {{ education.endDate }}
        <span class="school">{{ education.school }}</span>
        <span class="details"> {{ education.subject }} / {{ education.degree }}</span>
      </p>
      <p>主修课程：{{ education.majorCourses }}</p>
    </section>

    <section class="section">
      <h3>工作经验 / Experience</h3>
      <div v-for="exp in experiences" :key="exp.id">
        <p>
          {{ exp.startDate }} - {{ exp.endDate }}
          <span class="company">{{ exp.company }}</span>
          <span class="details"> {{ exp.department }} / {{ exp.position }}</span>
        </p>
        <p v-for="item in exp.details" :key="item">- {{ item }}</p>
      </div>
    </section>

    <section class="section">
      <h3>在校经历 / School</h3>
      <div v-for="schoolExp in schoolExperience" :key="schoolExp.id">
        <p>
          {{ schoolExp.startDate }} - {{ schoolExp.endDate }}
          <span class="organization">{{ schoolExp.organization }}</span>
          <span class="details">{{ schoolExp.role }}</span>
        </p>
        <p>{{ schoolExp.description }}</p>
      </div>
    </section>

    <section class="section">
      <h3>荣誉奖励 / Certificate</h3>
      <p v-for="certificate in certificates" :key="certificate">- {{ certificate }}</p>
    </section>

    <section class="section">
      <h3>自我评价 / Assessment</h3>
      <p>{{ assessment }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  resumeForm: {
    type: Object,
    required: true
  }
})

const personal = computed(() => ({
  name: props.resumeForm.name,
  intendedPosition: props.resumeForm.jobTitle,
  phone: props.resumeForm.contact,
  email: props.resumeForm.email,
  location: props.resumeForm.currentResidence
}))

const education = computed(() => {
  if (props.resumeForm.education && props.resumeForm.education.length > 0) {
    const edu = props.resumeForm.education[0]
    return {
      startDate: dayjs(edu.time[0]).format('YYYY.MM'),
      endDate: dayjs(edu.time[1]).format('YYYY.MM'),
      school: edu.school,
      degree: edu.degree,
      subject: edu.major,
      majorCourses: ''
    }
  }
  return null
})

const experiences = computed(() =>
  props.resumeForm.experience.map((exp, index) => ({
    id: index + 1,
    startDate: dayjs(exp.time[0]).format('YYYY.MM'),
    endDate: dayjs(exp.time[1]).format('YYYY.MM'),
    company: exp.company,
    department: '',
    position: exp.position,
    details: exp.description.split('\n')
  }))
)

const schoolExperience = computed(() => [
  {
    id: 1,
    startDate: '',
    endDate: '',
    organization: '',
    role: '',
    description: props.resumeForm.campusExperience
  }
])

const certificates = computed(() =>
  props.resumeForm.certifications.split('\n').filter(cert => cert.trim())
)

const assessment = computed(() => props.resumeForm.selfAssessment)

const fileInput = ref<HTMLInputElement | null>(null)
const photoUrl = ref<string>('')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      photoUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.resume {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

.header {
  background-color: #333;
  color: #fff;
  padding: 10px;
  text-align: center;
}

.personal-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}

.name h2 {
  font-size: 24px;
  margin: 0;
}

.contact {
  display: flex;
  flex-direction: column;
}

.photo {
  cursor: pointer;
}

.photo .fake-photo {
  width: 100px;
  height: 120px;
  background-color: #eee;
  border: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
}

.photo .photo-preview {
  width: 100px;
  height: 120px;
  border: 1px solid #333;
  overflow: hidden;
}

.photo .photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.section {
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}

.section h3 {
  font-weight: bold;
  margin-bottom: 10px;
}

.school,
.company,
.organization {
  font-weight: bold;
}

.details {
  font-style: italic;
}
</style>
