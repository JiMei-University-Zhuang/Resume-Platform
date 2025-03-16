<template>
  <div class="exam-page">
    <el-container>
      <el-header class="header">
        <h1>模拟考试</h1>
        <el-button-group class="category-buttons">
          <el-button :type="currentCategory === 'all' ? 'primary' : ''" @click="filterCards('all')">
            全部
          </el-button>
          <el-button :type="currentCategory === 'civil_service' ? 'primary' : ''" @click="filterCards('civil_service')">
            考公
          </el-button>
          <el-button :type="currentCategory === 'postgraduate' ? 'primary' : ''" @click="filterCards('postgraduate')">
            考研
          </el-button>
        </el-button-group>
      </el-header>
      <el-main>
        <div class="card-container">
          <el-card v-for="(paper, index) in filteredPapers" :key="index" class="exam-card">
            <template #header>
              <span>{{ paper.title }}</span>
            </template>
            <img :src="paper.imageUrl" alt="试卷封面" />
            <p>{{ paper.description }}</p>
            <el-button type="primary" @click="startExam(paper.id)">
              使用试卷
            </el-button>
            <el-button @click="previewPaper(paper.id)">预览</el-button>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElContainer, ElHeader, ElMain, ElButton, ElButtonGroup, ElCard } from 'element-plus';

// 模拟试卷数据
const papers = ref([
  {
    id: 1,
    title: '考公试卷1',
    description: '涵盖考公基础题型',
    category: 'civil_service',
    imageUrl: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 2,
    title: '考公试卷2',
    description: '聚焦考公难点题目',
    category: 'civil_service',
    imageUrl: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 3,
    title: '考研试卷1',
    description: '考研数学模拟卷',
    category: 'postgraduate',
    imageUrl: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 4,
    title: '考研试卷2',
    description: '考研英语专项练习',
    category: 'postgraduate',
    imageUrl: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },
  {
    id: 5,
    title: '考研试卷2',
    description: '考研英语专项练习',
    category: 'postgraduate',
    imageUrl: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.pYapKznQKH66UYxie9jeVAHaHa?w=179&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
  },

]);

const currentCategory = ref('all');
const filterCards = (category: string) => {
  currentCategory.value = category;
};

const filteredPapers = computed(() => {
  if (currentCategory.value === 'all') {
    return papers.value;
  }
  return papers.value.filter((paper) => paper.category === currentCategory.value);
});

// 模拟开始考试的方法
const startExam = (paperId: number) => {
  console.log('开始考试，试卷id：', paperId);
  // 这里后续可以添加跳转考试页面等逻辑
};

// 模拟预览试卷的方法
const previewPaper = (paperId: number) => {
  console.log('预览试卷，试卷id：', paperId);
  // 这里后续可以添加预览试卷内容等逻辑
};
</script>

<style scoped>
.exam-page {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-buttons {
  margin-left: auto;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 100%;
}


.exam-card {
  flex: 1 1 calc(300px + 20px);
  max-width: calc(300px + 20px);
  box-sizing: border-box;
}

.exam-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  margin-bottom: 10px;
  display: block;
}

.exam-card p {
  margin-bottom: 10px;
}

.el-main {
  margin: 0;
  padding: 0;
  /* 去除 el-main 的内边距 */
  overflow: hidden;
  /* 确保内容不会超出容器 */
}

.content {
  padding: 0;
  margin: 0;
  box-sizing: border-box;

}

.card-container {
  padding: 0 20px;
}
</style>