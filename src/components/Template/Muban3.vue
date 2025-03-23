<template>
    <div class="resume">
      <!-- 左侧栏 -->
      <div class="left-column">
        <div class="profile">
          <img :src="resume.avatar" alt="avatar" class="avatar" />
          <div class="info">
            <h2>{{ resume.name }}</h2>
            <p>{{ resume.jobIntent }}</p>
          </div>
        </div>
        <div class="details">
          <div class="detail">
            <div class="icon" />
            <p>生日: {{ resume.birthDate }}</p>
          </div>
          <div class="detail">
            <div class="icon" />
            <p>籍贯: {{ resume.hometown }}</p>
          </div>
          <div class="detail">
            <div class="icon" />
            <p>现居: {{ resume.currentCity }}</p>
          </div>
          <div class="detail">
            <div class="icon" />
            <p>政治面貌: {{ resume.politicalStatus }}</p>
          </div>
          <div class="detail">
            <div class="icon" />
            <p>电话: {{ resume.phone }}</p>
          </div>
          <div class="detail">
            <div class="icon" />
            <p>邮箱: {{ resume.email }}</p>
          </div>
          <h3>荣誉奖励</h3>
          <div class="detail" v-for="award in resume.awards" :key="award">
            <div class="icon" />
            <span>{{ award }}</span>
          </div>
        </div>
      </div>
  
      <!-- 右侧栏 -->
      <div class="right-column">
        <div class="section" v-for="section in rightContent" :key="section.title">
          <div class="section-header">
            <div class="icon" />
            <h3>{{ section.title }}</h3>
            <div class="under-line"></div>
          </div>
          <div class="section-content">
            <div v-html="section.content"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Resume",
    data() {
      return {
        resume: {
          name: "张宇",
          avatar: "img/test.jpg",
          jobIntent: "求职意向: 前端开发工程师",
          birthDate: "1990.05.09",
          hometown: "广东深圳",
          currentCity: "北京",
          politicalStatus: "中共党员",
          phone: "88888888888",
          email: "888@qq.com",
          awards: [
            "获得微软认证系统系统",
            "全国计算机等级考试二级B",
            "大学英语六级",
            "获得校一等奖学金",
          ],
        },
        rightContent: [
          {
            title: "教育背景",
            content: `
              <span >2011.9-2015.6 深圳大学 —— 计算机科学与技术专业（本科)</span>
              <ul>
                <li>掌握 Java 编程语言，JSP, HTML</li>
                <li>熟悉 JavaScript、JavaBean、XML 等常用 web 开发技术</li>
                <li>熟悉 Struts、Hibernate、Spring 等框架</li>
                <li>熟悉 Oracle, MySQL 等数据库使用</li>
              </ul>
            `,
          },
          {
            title: "工作经验",
            content: `
              <span calss="time">2014.5-2015.5 —— 多彩科技集团 —— 软件开发工程师</span>
              <ul>
                <li>MES 系统 PC 端软件开发</li>
                <li>PDF 软件开发，实现 MES数据提取及数据采集文件处理</li>
                <li>SQL Server 数据库维护，MES 系统转化 Oracle 数据库维护</li>
              </ul>
              <span>2015.12-2016.1 —— 格力电器 EMS 项目 —— 软件开发工程师</span>
              <ul>
                <li>MES 数据库数据转化 SQL Server 的维护</li>
                <li>PDA 扫描器，无线便携打印机自动扫描设备的选型配置</li>
              </ul>
            `,
          },
          {
            title: "专业技能",
            content: `
              <ul>
                <li>语言技能: 英语CET6，粤语</li>
                <li>专业技能: 熟悉 Web、iOS 和 Android 开发，精通数据库，C++ 及 Java 编程</li>
                <li>办公软件: 熟悉使用 Office 办公软件、Axure RP、Visio</li>
              </ul>
            `,
          },
          {
            title: "自我评价",
            content: `
              <p>本人具备较强的专业理论知识，基础扎实的乐于学习，为人诚恳、勤奋务实，
              有较强的适应能力和动手能力。有人合作、能胜任不同复杂的工作岗位对需求，
              有高度的责任心和团队协作的专业精神和能力。</p>
            `,
          },
        ],
      };
    },
  };
  </script>
  
  
  <style>
  .resume {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
    margin: 20px auto;
    max-width: 800px;
  }
  
  .right-column {
    padding: 40px;
  }
  
  .left-column {
    height: 900px;
    width: 40%;
    background-color: #e4e4e4;
    text-align: center;
     display: flex; /* 启用Flex布局 */
    flex-direction: column; /* 垂直排列子元素 */
    justify-content: center; /* 垂直方向居中 */
    align-items: center; /* 水平方向居中 */
   
  }
  
  .avatar {
    width: 100px;
    height: 120px;
    object-fit: cover;
  }
  
  .profile .info {
      margin-top: 20px;
      background-color: #174a7c;
      width: 263px;
      height: 100px;
       display: flex; /* 启用Flex布局 */
    flex-direction: column; /* 垂直排列子元素 */
    justify-content: center; /* 垂直方向居中 */
    align-items: center; /* 水平方向居中 */
  
  }
  
  .under-line {
    margin-left: 5px;
    width: 340px;
    height: 3px;
    background-color: #2c3e50;
    border-radius: 5px;
  }
  
  .section-content span {
    color: #174a7c;
    font-weight: bold;
  }
  
  .profile h2 {
    margin: 0;
  }
  
  .profile  {
    color: white;
  
  }
  
  .details {
      padding: 4px;
  }
  
  .details .detail {
    margin: 10px 0;
    display: flex;
    align-items: center;
  }
  
  .detail .icon {
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 50%;
    background-color: #174a7c;
  }
  
  .awards h3 {
    margin-top: 20px;
  }
  
  .right-column {
    width: 70%;
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
    width: 18px;
    height: 18px;
    margin-right: 10px;
    background-color: #174a7c;
  }
  
  .section-content ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  .section-content ul li {
    list-style: disc;
  }
  </style>
  