<template>
  <div class="wrong-question-record">
    <el-card>
      <h2>错题记录</h2>
      <el-row>
        <el-col :span="12">
          <el-form :model="recordCountForm" label-width="80px">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="recordCountForm.userId" placeholder="请输入用户ID"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="recordCountForm.type" placeholder="请选择类型">
                <el-option label="练习" value="练习"></el-option>
                <el-option label="考试" value="考试"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getRecordCount">获取错题记录数</el-button>
            </el-form-item>
          </el-form>
          <div v-if="recordCount">
            <p>错题记录数: {{ recordCount }}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <el-table :data="wrongQuestionList" style="width: 100%">
            <el-table-column prop="questionId" label="题目编号"></el-table-column>
            <el-table-column prop="itemId" label="小题编号"></el-table-column>
            <el-table-column prop="userAnswer" label="用户答案"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getWrongQuestionRecordCount, saveWrongQuestion } from '@/api/exam';
import { ElMessage } from 'element-plus';

// 获取错题记录数表单数据
const recordCountForm = ref({
  userId: '',
  type: ''
});

// 错题记录数
const recordCount = ref(null);

// 错题列表
const wrongQuestionList = ref([]);

// 获取错题记录数
const getRecordCount = async () => {
  try {
    const response = await getWrongQuestionRecordCount(recordCountForm.value);
    if (response.code === 200) {
      recordCount.value = response.data.length;
    } else {
      ElMessage.error('获取错题记录数失败');
    }
  } catch (error) {
    ElMessage.error('请求出错，请检查网络');
  }
};

// 模拟保存错题（可根据实际情况完善逻辑）
const saveMockWrongQuestion = async () => {
  const mockData = {
    userId: recordCountForm.value.userId,
    type: recordCountForm.value.type,
    records: [
      {
        questionId: 1,
        itemId: null,
        userAnswer: 'A'
      }
    ]
  };
  try {
    const response = await saveWrongQuestion(mockData);
    if (response.code === 200) {
      ElMessage.success('保存错题成功');
    } else {
      ElMessage.error('保存错题失败');
    }
  } catch (error) {
    ElMessage.error('保存错题请求出错，请检查网络');
  }
};
</script>

<style scoped>
.wrong-question-record {
  padding: 20px;
}
</style>