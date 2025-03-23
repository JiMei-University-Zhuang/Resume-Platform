<template>
  <div class="resume">
    <!-- Header -->
    <div class="header">
      <h1>个人简历</h1>
      <div class="icons">
        <div class="icon red"></div>
        <div class="icon orange"></div>
        <div class="icon pink"></div>
      </div>
    </div>
    <!-- Basic Information -->
    <section class="section">
      <h2 class="section-title">基本信息</h2>
      <div class="section-content basic-info">
        <div class="info-item">
          <span>姓名:</span> {{ info.name }}
        </div>
        <div class="info-item">
          <span>性别:</span> {{ info.gender }}
        </div>
        <div class="info-item">
          <span>出生年月:</span> {{ info.birth }}
        </div>
        <div class="info-item">
          <span>民族:</span> {{ info.ethnicity }}
        </div>
        <div class="info-item">
          <span>政治面貌:</span> {{ info.politics }}
        </div>
        <div class="info-item">
          <span>求职意向:</span> {{ info.jobIntent }}
        </div>
        <div class="info-item">
          <span>电子邮箱:</span> {{ info.email }}
        </div>
        <div class="info-item">
          <span>联系方式:</span> {{ info.phone }}
        </div>
        <div class="photo">
          <img :src="info.photo" alt="个人头像" />
        </div>
      </div>
    </section>
    <!-- Sections -->
    <template v-for="section in sections" :key="section.title">
      <section class="section">
        <h2 class="section-title">{{ section.title }}</h2>
        <div class="section-content">
          <template v-for="item in section.content" :key="item.subtitle">
            <div class="item">
              <div class="item-header">
                <span class="time">{{ item.time }}</span>
                <span>{{ item.subtitle }}</span>
              </div>
              <p>{{ item.description }}</p>
              <ul v-if="item.list">
                <li v-for="listItem in item.list" :key="listItem">{{ listItem }}</li>
              </ul>
            </div>
          </template>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        name: "周晓影",
        gender: "女",
        birth: "2003.03",
        ethnicity: "汉族",
        politics: "共青团员",
        jobIntent: "会计相关岗位",
        email: "填写邮箱",
        phone: "XXX-XXXX-8848",
        photo: "https://via.placeholder.com/100", // 示例照片URL
      },
      sections: [
        {
          title: "教育背景",
          content: [
            {
              time: "2021.09-2025.07",
              subtitle: "东北财经大学 | 会计学 / 本科",
              description:
                "大学期间，保持绩点 3.8，专业排名前 10%，多次荣获校级一等奖学金。参与多门专业课程学习，具有全面的会计知识结构。",
            },
          ],
        },
        {
          title: "实习经历",
          content: [
            {
              time: "2024.06-2024.09",
              subtitle: "大连思元 XX 科技有限公司 | 会计实习生",
              description:
                "参与账务处理及报表整理，熟悉基础账务和公司运营需求，使用财务系统提高会计效率。",
              list: [
                "账务处理：协助会计完成账务核对及数据整理。",
                "税务申报：协助财务完成税务申报和报表优化。",
              ],
            },
          ],
        },
        {
          title: "校园经历",
          content: [
            {
              time: "2021.09-2022.06",
              subtitle: "学生会办公室 | 财务会计",
              description: "负责预算与报销管理，监督各项资金的使用情况和财务透明。",
            },
          ],
        },
        {
          title: "技能证书",
          content: [
            {
              time: "",
              subtitle: "专业证书",
              description:
                "已取得初级会计职称证书，熟悉财经法规及会计岗位实践技能。",
            },
          ],
        },
        {
          title: "自我评价",
          content: [
            {
              time: "",
              subtitle: "专业知识扎实，具备会计职业素养。",
              description:
                "热爱会计工作，善于团队协作，同时具备较高的工作效率。",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.resume {
  font-family: "Arial", sans-serif;
  color: #333;
  background-color: #fff;
  margin: 20px auto;
  padding: 20px;
  max-width: 900px;
  border: 1px solid #eee;
  border-radius: 5px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header h1 {
  color: #e26386;
}
.icons {
  display: flex;
  gap: 10px;
}
.icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.icon.red {
  background-color: #e26386;
}
.icon.orange {
  background-color: #f4a261;
}
.icon.pink {
  background-color: #f699c8;
}
.section {
  margin-bottom: 20px;
}
.section-title {
  font-size: 1.5em;
  color: #e26386;
  border-left: 5px solid #e26386;
  padding-left: 10px;
  margin-bottom: 10px;
}
.section-content {
  padding-left: 20px;
}
.basic-info {
  display: flex;
  flex-wrap: wrap;
}
.info-item {
  flex: 1 1 50%;
  margin-bottom: 5px;
}
.photo img {
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 5px;
  margin-top: 10px;
}
.item {
  margin-bottom: 15px;
}
.item-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}
ul {
  margin-top: 5px;
  padding-left: 20px;
  list-style: disc;
}
</style>
