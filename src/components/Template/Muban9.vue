<template>
  <div class="resume-container">
    <!-- 个人简历标题 -->
    <div class="header">
      <h1>个人简历</h1>
    </div>

    <!-- 基本信息 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>基本信息</h2>
      </div>
      <div class="info">
        <div>
          <p>姓 名：{{ basicInfo.name }}</p>
          <p>性 别：{{ basicInfo.gender }}</p>
          <p>民 族：{{ basicInfo.nation }}</p>
          <p>政治面貌：{{ basicInfo.political }}</p>
        </div>
        <div>
          <p>求职意向：{{ basicInfo.intention }}</p>
          <p>出生年月：{{ basicInfo.birth }}</p>
          <p>电子邮箱：{{ basicInfo.email }}</p>
          <p>联系方式：{{ basicInfo.phone }}</p>
        </div>
        <div class="photo">
          <!-- 模拟头像区域 -->
          <div class="placeholder"></div>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>教育背景</h2>
      </div>
      <div v-for="item in education" :key="item.time" class="info">
        <p>{{ item.time }} | {{ item.school }} | {{ item.major }}</p>
        <p>{{ item.details }}</p>
      </div>
    </div>

    <!-- 实习经历 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>实习经历</h2>
      </div>
      <div v-for="item in internships" :key="item.time" class="info">
        <p>{{ item.time }} | {{ item.company }} | {{ item.position }}</p>
        <p>{{ item.details }}</p>
      </div>
    </div>

    <!-- 校园经历 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>校园经历</h2>
      </div>
      <div v-for="item in campusExperience" :key="item.time" class="info">
        <p>{{ item.time }} | {{ item.organization }} | {{ item.role }}</p>
        <p>{{ item.details }}</p>
      </div>
    </div>

    <!-- 技能证书 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>技能证书</h2>
      </div>
      <div class="info">
        <p>{{ skills.certificates }}</p>
        <p>{{ skills.languages }}</p>
        <p>{{ skills.softwareSkills }}</p>
      </div>
    </div>

    <!-- 自我评价 -->
    <div class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>自我评价</h2>
      </div>
      <div class="info">
        <p>{{ selfEvaluation }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "Muban9",
  setup() {
    const basicInfo = ref({
      name: "周晓影",
      gender: "女",
      nation: "汉族",
      political: "中共党员",
      intention: "会计相关岗位",
      birth: "2003.03",
      email: "填写邮箱",
      phone: "XXX-XXXX-8848",
    });

    const education = ref([
      {
        time: "2021.09-2025.07",
        school: "东北财经大学",
        major: "会计学 / 本科",
        details:
          "大学期间，保持绩点3.8，专业排名前10%，多次荣获校级一等等学金。",
      },
    ]);

    const internships = ref([
      {
        time: "2024.06-2024.09",
        company: "大连显元XX科技有限公司",
        position: "会计实习生",
        details: "协助处理日常账务问题，编制报表，熟练运用财务软件。",
      },
    ]);

    const campusExperience = ref([
      {
        time: "2021.09-2022.06",
        organization: "学生会办公室",
        role: "财务会计",
        details: "负责活动资金的审批与支出管理，组织活动并提供详细活动报销记录。",
      }
    ]);

    const skills = ref({
      certificates: "已取得初级会计职称证书。",
      languages: "英语 CET-6，具有较强英语听说能力。",
      softwareSkills: "熟练使用财务软件及办公软件。",
    });

    const selfEvaluation = ref(
      "经过系统的会计学习掌握理论知识，熟悉财务报表分析等内容。"
    );

    return {
      basicInfo,
      education,
      internships,
      campusExperience,
      skills,
      selfEvaluation,
    };
  },
};
</script>

<style scoped>
.resume-container {
  width: 800px;
  margin: 20px auto;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  font-family: Arial, sans-serif;
  color: #333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.header {
  background-color: #e7e4f7;
  text-align: center;
  padding: 20px 0;
  border-bottom: 2px solid #7f66b2;
}

.header h1 {
  color: #7f66b2;
  font-weight: bold;
  margin: 0;
  font-size: 24px;
}

.section {
  margin: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
}

.section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.section-header .icon {
  width: 10px;
  height: 30px;
  background-color: #7f66b2;
  margin-right: 10px;
  border-radius: 5px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  color: #7f66b2;
  font-weight: bold;
  text-transform: capitalize;
}

.info {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-left: 4px solid #e7e4f7;
  padding-left: 15px;
}

.info > div {
  flex: 1;
}

.info > div:nth-child(2) {
  margin-left: 20px;
}

.photo {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 5px;
  margin-left: auto;
}

.photo .placeholder {
  width: 100px;
  height: 140px;
  background-color: #ccc;
  border-radius: 8px;
}

.info p {
  margin: 5px 0;
  line-height: 1.5;
  font-size: 14px;
}

.info p:first-child {
  font-weight: bold;
}

</style>

