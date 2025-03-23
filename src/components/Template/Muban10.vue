<template>
  <div class="resume-container">
    <!-- Header Section -->
    <div class="header">
      <div class="header-left">
        <h1>PERSONAL RESUME</h1>
        <h2>{{ info.name }}</h2>
        <p><span>出生年月：</span>{{ info.birth }}</p>
        <p><span>籍贯：</span>{{ info.hometown }}</p>
        <p><span>联系方式：</span>{{ info.phone }}</p>
        <p><span>求职意向：</span>{{ info.jobIntent }}</p>
        <p><span>政治面貌：</span>{{ info.politics }}</p>
        <p><span>学历：</span>{{ info.education }}</p>
        <p><span>邮箱：</span>{{ info.email }}</p>
      </div>
      <div class="header-right">
        <img :src="info.photo" alt="个人照片" />
      </div>
    </div>

    <!-- Sections -->
    <section v-for="section in sections" :key="section.title" class="section">
      <div class="section-header">
        <div class="icon"></div>
        <h2>{{ section.title }}</h2>
      </div>
      <div class="section-content">
        <div v-for="item in section.content" :key="item.subtitle" class="item">
          <div class="item-header">
            <span class="time">{{ item.time }}</span>
            <span>{{ item.subtitle }}</span>
            <span class="role">{{ item.role }}</span>
          </div>
          <p>{{ item.description }}</p>
          <ul v-if="item.list">
            <li v-for="listItem in item.list" :key="listItem">{{ listItem }}</li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {
        name: "傅司楚",
        birth: "2000.09.06",
        hometown: "北京朝阳区",
        phone: "159***5658",
        jobIntent: "法律相关岗位",
        politics: "中共党员",
        education: "本科",
        email: "123***@126.com",
        photo: "https://via.placeholder.com/100", // 示例照片 URL
      },
      sections: [
        {
          title: "教育背景",
          content: [
            {
              time: "2021.09-2025.06",
              subtitle: "北京****大学 | 法律专业本科",
              description:
                "主修课程：法理学、宪法、中国法制史、民法、刑法、国际法等。GPA:3.8/4.0，连续三年荣获国家一等奖学金。",
            },
          ],
        },
        {
          title: "工作经历",
          content: [
            {
              time: "2023.06-2024.09",
              subtitle: "北京****律师事务所",
              role: "律师助理",
              description:
                "负责案件准备、庭审协助等工作内容，保障文件有序管理，记录会议内容。",
              list: [
                "协助律师准备诉讼材料，包括收集证据、整理文件。",
                "督查客户或相关方的会谈内容。",
                "帮助完成客户案件归档工作。",
              ],
            },
          ],
        },
        {
          title: "荣誉技能",
          content: [
            {
              subtitle: "专业技能",
              description: "已取得法律从业人员资格证。",
            },
            {
              subtitle: "语言能力",
              description: "英语 CET-6，口语流利。",
            },
            {
              subtitle: "其他技能",
              description: "熟练使用 Word, Excel 等常用软件。",
            },
          ],
        },
        {
          title: "自我评价",
          content: [
            {
              description:
                "具备 1 年律师事务所经验，熟悉律师日常工作流程。理论知识扎实，动手能力强。",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.resume-container {
  font-family: "Arial", sans-serif;
  background-color: #f9fafa;
  max-width: 820px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  background-color: #daf1ed;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.header-left h1 {
  color: #2e817f;
  font-size: 1.5em;
}

.header-left h2 {
  font-size: 1.8em;
  font-weight: bold;
  margin: 10px 0;
}

.header-left p {
  margin: 5px 0;
}

.header-right img {
  width: 100px;
  height: 120px;
  border-radius: 5px;
  object-fit: cover;
}

.section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.section-header .icon {
  width: 20px;
  height: 20px;
  background-color: #2e817f;
  border-radius: 50%;
  margin-right: 10px;
}

.section-header h2 {
  font-size: 1.2em;
  font-weight: bold;
  color: #2e817f;
}

.item-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 5px;
}

.item-header .time {
  color: #2e817f;
}

.item-header .role {
  font-weight: normal;
  font-style: italic;
}

.section-content {
  padding-left: 30px;
}

ul {
  padding-left: 20px;
  list-style: disc;
}
</style>
