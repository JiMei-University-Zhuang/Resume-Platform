<template>
  <div class="resume-template">
    <div class="resume">
      <div class="column1">
        <header>
          <div class="profile-upload">
            <label class="upload-container">
              <div v-if="!profilePic" class="placeholder">
                <span>+</span>
                <p>上传照片</p>
              </div>
              <img v-else class="uploaded-photo" :src="profilePic" alt="Profile Picture" />
              <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" />
            </label>
          </div>
          <h2>{{ resumeForm.name }}</h2>
          <p>{{ resumeForm.jobTitle }}</p>
        </header>

        <section class="personal-info">
          <h3>个人资料</h3>
          <ul>
            <li>性别: {{ resumeForm.gender }}</li>
            <li>出生年月: {{ formatDate(resumeForm.birthday) }}</li>
            <li>籍贯: {{ resumeForm.origin }}</li>
            <li>政治面貌: {{ resumeForm.politicalStatus }}</li>
            <li v-for="(edu, index) in resumeForm.education" :key="index">
              学校: {{ edu.school }}<br />
              专业: {{ edu.major }}<br />
              学历: {{ edu.degree }}<br />
              时间: {{ formatDate(edu.time[0]) }} -
              {{ formatDate(edu.time[1]) }}
            </li>
          </ul>
        </section>

        <section class="contact">
          <h3>联系方式</h3>
          <ul>
            <li>手机: {{ resumeForm.contact }}</li>
            <li>邮箱: {{ resumeForm.email }}</li>
            <li>地址: {{ resumeForm.currentResidence }}</li>
          </ul>
        </section>

        <section class="skills">
          <h3>专业技能</h3>
          <ul>
            <li v-for="skill in resumeForm.skills" :key="skill">
              {{ skill }}
            </li>
          </ul>
        </section>
        <section class="skills">
          <h3>个人证书</h3>
          <ul>
            <li
              v-for="(certifications, index) in resumeForm.certifications.split('\n')"
              :key="index"
            >
              {{ certifications }}
            </li>
          </ul>
        </section>
      </div>
      <div class="column2">
        <section class="education">
          <h3>教育背景</h3>
          <div class="under-line"></div>
          <div class="text" v-for="(edu, index) in resumeForm.education" :key="index">
            <span>{{ formatDate(edu.time[0]) }} - {{ formatDate(edu.time[1]) }}</span>
            <span>{{ edu.school }}</span>
            <span>{{ edu.major }}</span>
            <span>{{ edu.degree }}</span>
          </div>
        </section>

        <section class="main-courses">
          <h3>在校经历</h3>
          <div class="under-line"></div>
          <p>{{ resumeForm.campusExperience }}</p>
        </section>

        <section class="work-experience">
          <h3>工作经历</h3>
          <div class="under-line"></div>
          <div v-for="(job, index) in resumeForm.experience" :key="index" class="text">
            <div class="column1">
              <p>
                {{ formatDate(job.time[0]) }} - {{ formatDate(job.time[1]) }}<br />
                {{ job.position }}
              </p>
            </div>
            <div class="column2">
              <p class="company">{{ job.company }}</p>
              <p>{{ job.description }}</p>
            </div>
          </div>
        </section>

        <section class="honors">
          <h3>个人荣誉</h3>
          <div class="under-line"></div>
          <ul>
            <li v-for="(honor, index) in resumeForm.honors.split('\n')" :key="index">
              {{ honor }}
            </li>
          </ul>
        </section>

        <section class="self-introduction">
          <h3>个人介绍</h3>
          <div class="under-line"></div>
          <p>{{ resumeForm.selfAssessment }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    resumeForm: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      profilePic: ''
    }
  },
  methods: {
    formatDate(date) {
      return date ? dayjs(date).format('YYYY.MM') : ''
    },
    showFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = e => {
          this.profilePic = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style scoped>
.resume-template {
    width: 800px;
    height: auto;
    overflow: hidden;
    transform-origin: top left;
    transform: scale(0.65);
}

.resume {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-family: Arial, sans-serif;
    margin: 0 auto;
    max-width: 100%;
}

.column1 {
    flex-basis: 35%;
    padding: 20px;
}

.profile-upload {
    text-align: center;
    margin-bottom: 20px;
}

.upload-container {
    width: 107px;
    height: 150px;
    margin: 0 auto;
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

.upload-container:hover {
    border-color: #307360;
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

.column2 {
    flex-basis: 65%; /* 调整列宽 */
    padding: 20px;
}

header {
    text-align: center;
    margin-bottom: 20px;
}

.profile-upload {
    position: relative;
}

.profile-pic {
    width: 100px;
    height: 120px;
    object-fit: cover;
}

.column1 h3 {
    background-color: #2c3e50;
    color: white;
    padding: 5px;
    margin-top: 20px;
    margin-bottom: 10px;
}

.under-line {
    width: 100%;
    height: 3px;
    background-color: #2c3e50;
    border-radius: 5px;
}

section {
    margin-bottom: 20px;
}

.education .text {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.work-experience .text {
    display: flex;
    justify-content: center;
}

.work-experience .column2 {
    padding: 0 !important;
}

.honors li {
    margin-left: 15px;
    list-style-type: disc;
}

.company {
    font-weight: bold;
}

ul {
    list-style: none;
    padding: 0;
}

ul li {
    margin: 5px 0;
}

h2,
p {
<<<<<<< HEAD
  margin: 5px 0;
  line-height: 1.5;
=======
    margin: 5px 0;
    line-height: 1.5;
>>>>>>> d4ab17887d8985d12ba3afd904811d0f6bfc5f95
}
</style>
