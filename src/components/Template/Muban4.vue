<template>
  <div class="resume">
    <!-- Header -->
    <header class="header">
      <div class="header-left">
        <div class="resume-title">RESUME</div>
        <div class="name-info">
          <h2>{{ personalInfo.name }}</h2>
          <p>{{ personalInfo.jobIntent }}</p>
        </div>
      </div>
      <div class="header-right">
        <div class="photo-placeholder"></div>
      </div>
    </header>

    <!-- Personal Information -->
    <section class="personal-info">
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>生日：{{ personalInfo.birth }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>现居：{{ personalInfo.location }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>电话：{{ personalInfo.phone }}</span>
      </div>
      <div class="info-item">
        <div class="icon-placeholder"></div>
        <span>邮箱：{{ personalInfo.email }}</span>
      </div>
    </section>

    <!-- Section: Education -->
    <section class="education">
      <div class="section-header">
        <div class="icon-placeholder"></div>
        <span>教育背景</span>
      </div>
      <div class="section-content">
        <div class="education-item">
          <span class="time">{{ education.date }}</span>
          <span class="school">{{ education.school }}</span>
          <span class="degree">{{ education.degree }}</span>
          <p class="details">{{ education.details }}</p>
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
        <div v-for="job in workExperiences" :key="job.id" class="work-item">
          <span class="time">{{ job.date }}</span>
          <span class="company">{{ job.company }}</span>
          <span class="position">{{ job.position }}</span>
          <p class="details">{{ job.description }}</p>
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
        <p>{{ skills.language }}</p>
        <p>{{ skills.profession }}</p>
        <p>{{ skills.tools }}</p>
      </div>
    </section>

    <!-- Section: Self Evaluate -->
    <section class="self-evaluation">
      <div class="section-header">
        <div class="icon-placeholder"></div>
        <span>自我评价</span>
      </div>
      <div class="section-content">
        <p>{{ selfEvaluation }}</p>
      </div>
    </section>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  name: "Muban4",
  setup() {
    // 响应式数据
    const personalInfo = reactive({
      name: "张悦然",
      jobIntent: "求职意向：市场销售相关工作岗位",
      birth: "1989.05.07",
      location: "江苏南通市",
      phone: "888888888888",
      email: "888@qq.com",
    });

    const education = reactive({
      date: "2012.09 - 2016.06",
      school: "西南石油大学",
      degree: "物流管理（本科）",
      details:
        "主修课程：石油及天然气运输模块、能源开发、中国能源地理；参与项目：克拉玛依油田节能清洁化项目等。",
    });

    const workExperiences = reactive([
      {
        id: 1,
        date: "2014.05 - 2015.05",
        company: "约克宠鲲源科技有限公司",
        position: "销售实习生",
        description:
          "拥有一定的能源专业知识，完成现场销售指标，与团队稳定客户合作。",
      },
      {
        id: 2,
        date: "2015.11 - 2016.04",
        company: "金山WPS 程序儿平台",
        position: "原创设计师",
        description:
          "完成简历PPT设计、研究互联网，产品开发，掌握效率设计工具。",
      },
    ]);

    const skills = reactive({
      language: "语言技能: 英语CET6、粤语",
      profession: "专业技能: 熟悉 Web / iOS / C++ Java 开发",
      tools: "办公技能: 熟练使用 Office, Axure RP, Visio",
    });

    const selfEvaluation =
      "工作积极认真，细心负责，能独立完成复杂项目，有较强问题解决能力；乐观开朗积极承担责任。";

    return {
      personalInfo,
      education,
      workExperiences,
      skills,
      selfEvaluation,
    };
  },
};
</script>

<style scoped>
/* 全局样式 */
.resume {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.6;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #1f3a93;
  padding-bottom: 10px;
}

.resume-title {
  font-size: 24px;
  font-weight: bold;
  color: white;
  background-color: #1f3a93;
  padding: 5px 10px;
}

.name-info h2 {
  font-size: 22px;
  margin: 0;
}

.name-info p {
  color: #666;
}

.photo-placeholder {
  width: 80px;
  height: 100px;
  background-color: #ccc;
  border-radius: 50%;
}

/* Personal Info */
.personal-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
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
  margin-top: 20px;
  margin-bottom: 10px;
  color: #1f3a93;
  font-weight: bold;
}

.section-content {
  padding-left: 20px;
}

.time,
.school,
.company,
.degree,
.position {
  font-weight: bold;
  color: #333;
}

.details {
  margin-left: 15px;
  color: #555;
  line-height: 1.4;
}
</style>
