<template>
  <div class="resume">
    <!-- 个人信息部分 -->
    <div class="left-section">
      <div class="photo">
        <div class="photo-placeholder">照片区域</div>
      </div>
      <div class="name-info">
        <h2>{{ personalInfo.name }}</h2>
        <p>{{ personalInfo.intent }}</p>
      </div>
      <div class="info-section">
        <h3>基本信息</h3>
        <ul>
          <li>民族：{{ personalInfo.ethnicity }}</li>
          <li>专业：{{ personalInfo.major }}</li>
          <li>学历：{{ personalInfo.education }}</li>
          <li>性别：{{ personalInfo.gender }}</li>
          <li>籍贯：{{ personalInfo.origin }}</li>
          <li>毕业院校：{{ personalInfo.school }}</li>
          <li>政治面貌：{{ personalInfo.politicalStatus }}</li>
          <li>出生年月：{{ personalInfo.birth }}</li>
        </ul>
      </div>
      <div class="info-section contact">
        <h3>联系方式</h3>
        <ul>
          <li>联系电话：{{ personalInfo.phone }}</li>
          <li>电子邮箱：{{ personalInfo.email }}</li>
        </ul>
      </div>
    </div>

    <!-- 主要内容部分 -->
    <div class="right-section">
      <div v-for="section in sections" :key="section.title" class="section">
        <div class="section-header">
          <div class="icon-placeholder"></div>
          <h3>{{ section.title }}</h3>
          <span>{{ section.subtitle }}</span>
        </div>
        <div class="section-content">
          <div v-html="section.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const personalInfo = ref({
      name: "王旸旸",
      intent: "求职意向：工作岗位",
      ethnicity: "汉",
      major: "填写专业",
      education: "本科",
      gender: "女",
      origin: "北京 XXX",
      school: "填写学校",
      politicalStatus: "中共党员",
      birth: "C25-1",
      phone: "00000000000",
      email: "00000@126.com",
    });

    const sections = ref([
      {
        title: "教育背景",
        subtitle: "Education",
        content: `
          <p>2013/08--2016/09 北京 XX 学院 填写专业</p>
          <p>主修课程：填写课程，填写课程，填写课程，填写课程，填写课程。</p>
        `,
      },
      {
        title: "在校经历",
        subtitle: "Experience",
        content: `
          <p>1. 负责学校公众号运营，策划宣传报道 10 余个，完成 20 余篇推文的撰写发布。</p>
          <p>2. 担任学生干部，负责组织活动、组织培训。</p>
          <p>3. 组织主题团活动，参与赛事等校级学术活动。</p>
        `,
      },
      {
        title: "技能证书",
        subtitle: "Skill",
        content: `
          <p>语言技能：英语四级证书、普通话一级甲等；</p>
          <p>办公技能：熟练掌握 Office 办公软件，包括 Word、Excel、PPT。</p>
        `,
      },
      {
        title: "自我评价",
        subtitle: "Evaluate",
        content: `
          <p>学习上：勤奋刻苦，认真好学，具备较强的吸收知识能力。</p>
          <p>工作上：具有较强的团队管理能力和协调能力。</p>
        `,
      },
    ]);

    return {
      personalInfo,
      sections,
    };
  },
};
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
