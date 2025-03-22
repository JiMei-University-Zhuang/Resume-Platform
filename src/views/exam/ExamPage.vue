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
            <el-radio-group v-model="answers[index]" class="option-group">
              <div class="options-row">
                <div class="option-item">
                  <el-radio label="A">{{ question.optionA }}</el-radio>
                </div>
                <div class="option-item">
                  <el-radio label="B">{{ question.optionB }}</el-radio>
                </div>
              </div>
              <div class="options-row">
                <div class="option-item">
                  <el-radio label="C">{{ question.optionC }}</el-radio>
                </div>
                <div class="option-item">
                  <el-radio label="D">{{ question.optionD }}</el-radio>
                </div>
              </div>
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
.exam-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 20px;
}

.card-header {
  margin-bottom: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.exam-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 12px;
  color: #303133;
}

.exam-subtitle {
  text-align: center;
  color: #606266;
  font-size: 16px;
}

.question-list {
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}

.question-item {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
  transition: box-shadow 0.3s;
}

.question-item:hover {
  box-shadow: 0 4px 15px 0 rgba(0, 0, 0, 0.09);
}

.question-item p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.question-item p:first-child {
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 20px;
}

.question-item p:nth-child(2) {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 25px;
}

.question-item .el-radio-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
}

.question-item .options-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.question-item .option-item {
  flex: 1;
  max-width: calc(50% - 10px);
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 10px 15px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.question-item .option-item:hover {
  background-color: #f0f7ff;
}

.question-item .el-radio {
  margin-right: 0;
  font-size: 15px;
  line-height: 1.6;
  display: flex;
  align-items: center;
  width: 100%;
}

.question-item .el-radio__input {
  display: flex;
  align-items: center;
}

.question-item .el-radio__label {
  white-space: normal;
  line-height: 1.6;
  color: #606266;
  padding-left: 8px;
}

.question-item .el-radio.is-checked .el-radio__label {
  color: #409EFF;
}

.essay-question {
  width: 100%;
  margin: 0 auto;
  padding: 20px 0;
}

.essay-question > div {
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
}

.essay-question p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.essay-question p:first-child {
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 20px;
}

.essay-question textarea {
  width: 100%;
  margin-top: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
}

.el-button {
  display: block;
  margin: 30px auto;
  padding: 12px 30px;
  font-size: 16px;
}
</style>