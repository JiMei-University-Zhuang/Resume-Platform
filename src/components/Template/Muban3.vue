<template>
  <div class="resume-template">
    <div class="resume">
      <!-- 左侧栏 -->
      <div class="left-column">
        <div class="photo-section">
          <div :class="['photo-container', profilePic ? 'photo-container-finished' : '']">
            <label class="upload-container">
              <div v-if="!profilePic" class="placeholder">
                <span>+</span>
                <p>上传照片</p>
              </div>
              <img v-else class="uploaded-photo" :src="profilePic" alt="个人照片" />
              <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" />
            </label>
          </div>
        </div>

        <div class="info-section">
          <div class="section-title">
            <h2>{{ resumeForm.name }}</h2>
            <p class="job-title">{{ resumeForm.jobTitle }}</p>
          </div>

          <div class="personal-info">
            <h3>个人资料</h3>
            <ul>
              <li><span>性　　别：</span>{{ resumeForm.gender }}</li>
              <li><span>出生年月：</span>{{ formatDate(resumeForm.birthday) }}</li>
              <li><span>籍　　贯：</span>{{ resumeForm.origin }}</li>
              <li><span>政治面貌：</span>{{ resumeForm.politicalStatus }}</li>
              <li><span>专　　业：</span>{{ resumeForm.education[0]?.major || '' }}</li>
              <li><span>学　　历：</span>{{ resumeForm.education[0]?.degree || '' }}</li>
            </ul>
          </div>

          <div class="contact-info">
            <h3>联系方式</h3>
            <ul>
              <li><span>手机：</span>{{ resumeForm.contact }}</li>
              <li><span>邮箱：</span>{{ resumeForm.email }}</li>
              <li><span>地址：</span>{{ resumeForm.currentResidence }}</li>
            </ul>
          </div>

          <div class="honors-info">
            <h3>荣誉奖励</h3>
            <ul>
              <li v-for="(honor, index) in resumeForm.honors.split('\n')" :key="index">
                {{ honor }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 右侧栏 -->
      <div class="right-column">
        <div class="section education-section">
          <div class="section-header">
            <div class="icon education-icon"></div>
            <h3>教育背景</h3>
          </div>
          <div class="section-content">
            <div class="timeline-item" v-for="(edu, index) in resumeForm.education" :key="index">
              <div class="timeline-date">
                {{ formatDate(edu.time[0]) }} -
                {{ formatDate(edu.time[1]) }}
              </div>
              <div class="timeline-content">
                <div class="school">{{ edu.school }}</div>
                <div class="major">{{ edu.major }}</div>
                <div class="degree">{{ edu.degree }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section work-section">
          <div class="section-header">
            <div class="icon work-icon"></div>
            <h3>工作经历</h3>
          </div>
          <div class="section-content">
            <div class="timeline-item" v-for="(exp, index) in resumeForm.experience" :key="index">
              <div class="timeline-date">
                {{ formatDate(exp.time[0]) }} -
                {{ formatDate(exp.time[1]) }}
              </div>
              <div class="timeline-content">
                <div class="company">{{ exp.company }}</div>
                <div class="position">{{ exp.position }}</div>
                <div class="description">
                  {{ exp.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section skills-section">
          <div class="section-header">
            <div class="icon skills-icon"></div>
            <h3>专业技能</h3>
          </div>
          <div class="section-content">
            <div class="skills-list">
              <div class="skill-tag" v-for="(skill, index) in resumeForm.skills" :key="index">
                {{ skill }}
              </div>
            </div>
            <div class="certifications" v-if="resumeForm.certifications">
              <h4>技能证书</h4>
              <p>{{ resumeForm.certifications }}</p>
            </div>
          </div>
        </div>

        <div class="section self-assessment-section">
          <div class="section-header">
            <div class="icon assessment-icon"></div>
            <h3>自我评价</h3>
          </div>
          <div class="section-content">
            <p>{{ resumeForm.selfAssessment }}</p>
          </div>
        </div>
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
  margin: 0 auto;
  font-family: 'Microsoft YaHei', 'Arial', sans-serif;
  color: #333;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transform: scale(0.65);
  transform-origin: top left;
}

.resume {
  display: flex;
  min-height: 1000px;
}

/* 左侧栏样式 */
.left-column {
  width: 30%;
  background-color: #1e3a5f;
  color: #fff;
  padding: 30px 20px;
}

.photo-section {
  text-align: center;
  margin-bottom: 30px;
}
.photo-container {
  width: 107px; /* 将宽高改成等比例 */
  height: 150px;
  margin: 0 auto;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
}
.photo-container-finished {
  border: none; /* 去掉边框 */
  background-color: transparent; /* 可替换为透明背景 */
}

.photo-container:hover {
  border-color: #1e3a5f;
}

.upload-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  color: #999;
}

.placeholder span {
  font-size: 40px;
  font-weight: bold;
}

.placeholder p {
  font-size: 14px;
  margin-top: 8px;
}

.uploaded-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

input[type='file'] {
  display: none;
}

.profile-pic {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  margin-top: 15px;
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.section-title {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.section-title h2 {
  font-size: 28px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
}

.job-title {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 8px;
}

.info-section h3 {
  font-size: 18px;
  color: #fff;
  margin: 20px 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.personal-info ul,
.contact-info ul,
.honors-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.personal-info li,
.contact-info li {
  margin: 10px 0;
  font-size: 14px;
  display: flex;
  color: rgba(255, 255, 255, 0.9);
}

.personal-info li span,
.contact-info li span {
  font-weight: 500;
  margin-right: 8px;
  min-width: 75px;
  color: rgba(255, 255, 255, 0.7);
}

.honors-info li {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 15px;
  position: relative;
}

.honors-info li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  background-color: #fff;
  border-radius: 50%;
}

/* 右侧栏样式 */
.right-column {
  width: 70%;
  padding: 30px;
  background-color: #fff;
}

.section {
  margin-bottom: 35px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  background-color: #1e3a5f;
  border-radius: 50%;
  position: relative;
}

.icon::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -20px;
  width: 2px;
  height: calc(100% + 30px);
  background-color: #1e3a5f;
  transform: translateX(-50%);
}

.section-header h3 {
  font-size: 20px;
  margin: 0;
  color: #1e3a5f;
  font-weight: 600;
}

.timeline-item {
  margin-bottom: 25px;
  position: relative;
  padding-left: 30px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 12px;
  height: 12px;
  background-color: #1e3a5f;
  border-radius: 50%;
  z-index: 1;
}

.timeline-date {
  font-weight: 600;
  color: #1e3a5f;
  margin-bottom: 8px;
  font-size: 15px;
}

.timeline-content {
  padding-left: 20px;
  border-left: 2px solid #e0e0e0;
}

.school,
.company {
  font-weight: 600;
  font-size: 16px;
  color: #1e3a5f;
}

.major,
.position {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}

.description {
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  margin-top: 8px;
  text-align: justify;
}

.skills-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.skill-tag {
  background-color: #1e3a5f;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  transition: all 0.3s ease;
}

.skill-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(30, 58, 95, 0.2);
}

.certifications h4 {
  font-size: 16px;
  margin: 15px 0 10px;
  color: #1e3a5f;
  font-weight: 600;
}

.certifications p {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.self-assessment-section p {
  font-size: 14px;
  line-height: 1.7;
  color: #555;
  text-align: justify;
  padding: 0 15px;
}
</style>
