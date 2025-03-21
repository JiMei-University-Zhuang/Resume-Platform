<template>
  <div class="exam-page">
    <div class="card-header">
      <h1 class="exam-title">考试开始</h1>
      <p class="exam-subtitle">本次考试科目：{{ subject }}，题目数量：{{ count }}</p>
    </div>
    <div v-if="questions.length > 0">
      <template v-if="subject === '行测'">
        <div class="question-list">
          <div v-for="(question, index) in questions" :key="index" class="question-item">
            <p>题目编号：{{ question.questionId }}</p>
            <p>题目内容：{{ question.questionContent }}</p>
            <p>选项A：{{ question.optionA }}</p>
            <p>选项B：{{ question.optionB }}</p>
            <p>选项C：{{ question.optionC }}</p>
            <p>选项D：{{ question.optionD }}</p>
            <el-radio-group v-model="answers[index]">
              <el-radio label="A"></el-radio>
              <el-radio label="B"></el-radio>
              <el-radio label="C"></el-radio>
              <el-radio label="D"></el-radio>
            </el-radio-group>
          </div>
          <el-button type="primary" @click="submitExam">提交试卷</el-button>
        </div>
      </template>
      <template v-else>
        <div class="essay-question">
          <div v-for="(question, index) in questions[0].expoundingOptionInfos" :key="index">
            <p>题目编号：{{ questions[0].questionId }} - {{ question.itemId }}</p>
            <p>题目内容：{{ question.itemContent }}</p>
            <textarea v-model="essayAnswers[index]" rows="10" cols="80"></textarea>
          </div>
          <el-button type="primary" @click="submitEssayExam">提交申论答案</el-button>
        </div>
      </template>
    </div>
    <div v-else>
      <p>正在加载题目，请稍候...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCSPractice } from '@/api/exam';

const route = useRoute();
const subject = ref(route.query.subject as string);
const count = ref(parseInt(route.query.count as string, 10));
const questions = ref<any[]>([]);
const answers = ref<string[]>([]);
const essayAnswers = ref<string[]>([]);

const fetchQuestions = async () => {
  try {
    const requestData = {
      subject: subject.value,
      count: count.value
    };
    const response = await getCSPractice(requestData);
    questions.value = response;
    if (subject.value === '行测') {
      answers.value = new Array(response.length).fill('');
    } else {
      essayAnswers.value = new Array(questions[0].expoundingOptionInfos.length).fill('');
    }
  } catch (error) {
    console.error('获取题目失败：', error);
  }
};

const submitExam = () => {
  // 行测提交逻辑
  console.log('提交的行测答案：', answers.value);
};

const submitEssayExam = () => {
  // 申论提交逻辑
  console.log('提交的申论答案：', essayAnswers.value);
};

onMounted(() => {
  fetchQuestions();
});
</script>

<style scoped>
.exam-title {
  text-align: center;
}

.exam-subtitle {
  text-align: center;
  color: gray;
}

.question-list {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.question-item {
  border: 1px solid #e4e7ed;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 15px;
}

.essay-question {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>