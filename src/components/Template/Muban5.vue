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
        <div class="icon" style="background-color: grey"></div> {{ personal.phone }}
        <div class="icon" style="background-color: grey"></div> {{ personal.email }}
        <div class="icon" style="background-color: grey"></div> {{ personal.location }}
      </div>
      <div class="photo">
        <div class="fake-photo"></div>
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
      <p v-for="certificate in certificates" :key="certificate">
        - {{ certificate }}
      </p>
    </section>

    <section class="section">
      <h3>自我评价 / Assessment</h3>
      <p>{{ assessment }}</p>
    </section>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  setup() {
    const personal = reactive({
      name: "林洛然",
      intendedPosition: "人事行政岗位",
      phone: "138 0000 0000",
      email: "daoke@qq.com",
      location: "福建 福州",
    });

    const education = reactive({
      startDate: "2014.09",
      endDate: "2018.06",
      school: "福州大学经济管理学院管理系",
      degree: "本科",
      subject: "财务管理专业",
      majorCourses: "基础会计学、财务会计、财务管理学、高级财务管理、审计学等",
    });

    const experiences = reactive([
      {
        id: 1,
        startDate: "2013.09",
        endDate: "2017.06",
        company: "福州云声网络科技有限公司",
        department: "财务部",
        position: "财务会计",
        details: [
          "制定、调整费用开支标准",
          "实施内部财务控制制度",
          "制作定期财务报表等",
        ],
      },
      {
        id: 2,
        startDate: "2013.09",
        endDate: "2017.06",
        company: "福州小鹿网络科技有限公司",
        department: "新媒体运营",
        position: "组长",
        details: [
          "项目目标制定",
          "带领团队达成目标",
          "组织策划相关活动",
        ],
      },
    ]);

    const schoolExperience = reactive([
      {
        id: 1,
        startDate: "2013.09",
        endDate: "2017.06",
        organization: "工程院管理系办公室",
        role: "学生助教",
        description: "负责学术会议等事务",
      },
    ]);

    const certificates = reactive([
      "人力资源管理师",
      "CET4 英语四级证书",
      "普通话二级甲等证书",
    ]);

    const assessment = reactive(
      "本人具备一定负责心及较好的经验总结能力，适应能力强。"
    );

    return {
      personal,
      education,
      experiences,
      schoolExperience,
      certificates,
      assessment,
    };
  },
};
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

.photo .fake-photo {
  width: 100px;
  height: 120px;
  background-color: #eee;
  border: 1px solid #333;
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
