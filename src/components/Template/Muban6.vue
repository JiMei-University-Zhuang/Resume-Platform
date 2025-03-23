<template>
  <div class="resume-container">
    <!-- 左侧部分 -->
    <div class="left-panel">
      <!-- 头像、姓名及职位 -->
      <div class="profile">
        <div class="avatar">
          <!-- 模拟头像区域 -->
        </div>
        <div class="name">王XXXX</div>
        <div class="job-title">求职意向：工作岗位</div>
      </div>

      <!-- 基本信息 -->
      <div class="section basic-info">
        <div class="section-title">
          <div class="icon"></div>
          <span>基本信息</span>
        </div>
        <ul class="info-list">
          <li>民族：{{ basicInfo.ethnicity }}</li>
          <li>专业：{{ basicInfo.major }}</li>
          <li>学历：{{ basicInfo.education }}</li>
          <li>性别：{{ basicInfo.gender }}</li>
          <li>籍贯：{{ basicInfo.origin }}</li>
          <li>毕业院校：{{ basicInfo.graduation }}</li>
          <li>政治面貌：{{ basicInfo.political }}</li>
          <li>出生年月：{{ basicInfo.birth }}</li>
        </ul>
      </div>

      <!-- 联系方式 -->
      <div class="section contact-info">
        <div class="section-title">
          <div class="icon"></div>
          <span>联系方式</span>
        </div>
        <ul class="info-list">
          <li>联系电话：{{ contactInfo.phone }}</li>
          <li>电子邮箱：{{ contactInfo.email }}</li>
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
          <div class="education">
            <div>{{ education.period }}</div>
            <div>{{ education.school }}</div>
            <div>{{ education.major }}</div>
            <div>主修课程：{{ education.courses }}</div>
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
          <li v-for="(item, index) in experiences" :key="index">{{ item }}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>技能证书</span>
          <span class="title-en">Skill</span>
        </div>
        <ul class="content">
          <li v-for="(item, index) in skills" :key="index">{{ item }}</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">
          <div class="icon"></div>
          <span>自我评价</span>
          <span class="title-en">Evaluate</span>
        </div>
        <ul class="content">
          <li v-for="(item, index) in evaluations" :key="index">{{ item }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basicInfo: {
        ethnicity: "汉",
        major: "XXXX专业",
        education: "本科",
        gender: "女",
        origin: "北京XXX",
        graduation: "XXX学校",
        political: "中共党员",
        birth: "C25-1"
      },
      contactInfo: {
        phone: "00000000000",
        email: "00000@126.com"
      },
      education: {
        period: "2013/08--2016/09",
        school: "北京XX学院",
        major: "XXXX专业",
        courses: "填写课程，填写课程，填写课程"
      },
      experiences: [
        "负责学校公众号运营、策划宣传报道等主题10余个，结合社会及学校热点。",
        "担任社团骨干，参与项目及策展的全面阶段工作。",
        "组织参加校外辅导班，为学院争取荣誉。"
      ],
      skills: [
        "语言技能：英语四级证书；",
        "办公技能：熟练操作office办公软件。",
        "个人技能：擅长团队协作执行力强。"
      ],
      evaluations: [
        "学习上勤奋好学。",
        "对生活积极阳光，善于适应挑战。",
        "工作中，沟通良好，能独自完成目标。"
      ]
    };
  }
};
</script>

<style scoped>
.resume-container {
  display: flex;
  font-family: Arial, sans-serif;
}

.left-panel {
  width: 35%;
  background-color: #f8f8f8;
  padding: 20px;
  border-right: 1px solid #e0e0e0;
}

.right-panel {
  width: 65%;
  padding: 20px;
}

.profile {
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 10px;
  background: #ccc;
  border-radius: 50%;
}

.name {
  font-size: 20px;
  font-weight: bold;
}

.job-title {
  color: #666;
}

.section {
  margin-bottom: 20px;
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
</style>
