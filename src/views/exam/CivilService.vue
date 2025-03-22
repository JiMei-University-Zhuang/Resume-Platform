<template>
  <div class="civil-service">
    <div class="card-header">
      <h1 class="welcome-title">欢迎来到考公中心</h1>
      <p class="welcome-subtitle">考公中心是一个在线考试平台，你可以在这里进行专项练习，也可以进行真题练习。</p>
    </div>
    <div class="card-body">
      <el-card class="Specialized-exercises">
        <div class="exercise-title">专项练习</div>
        <div class="exercise-description">针对不同科目的专项练习，可以练习数学、语文、英语、物理、化学、生物等科目的题目。</div>
        <img src="@/assets/images/exam_imgs/exercises.jpg" alt="专项练习" class="exercise-image"></img>
        <el-button type="primary" @click="showDialog">练习设置</el-button>
        <el-dialog v-model="dialogVisible" title="练习设置" width="600px"
          style="padding: 50px; margin: 0 auto; top: 50%; transform: translateY(-50%)" append-to-body>
          <div class="setting-item">
            <span>题目类型：</span>
            <el-radio-group v-model="selectedSubject">
              <el-radio label="行测">行测</el-radio>
              <el-radio label="申论">申论</el-radio>
            </el-radio-group>
          </div>
          <div class="setting-item">
            <span>题目个数：</span>
            <template v-if="selectedSubject === '行测'">
              <el-radio-group v-model="selectedCount">
                <el-radio label="10">10道题</el-radio>
                <el-radio label="20">20道题</el-radio>
                <el-radio label="50">50道题</el-radio>
              </el-radio-group>
            </template>
            <template v-else>
              <el-tooltip content="申论类型建议只选择1道题" placement="right">
                <el-radio-group v-model="selectedCount">
                  <el-radio label="1">1道题</el-radio>
                </el-radio-group>
              </el-tooltip>
            </template>
          </div>
          <template #footer>
            <el-button type="primary" @click="startExam" class="saveBtn">开始考试</el-button>
          </template>
        </el-dialog>
      </el-card>
      <el-card class="Train-realexam">
        <div class="exercise-title">真题训练</div>
        <img src="@/assets/images/exam_imgs/realexam.jpg" alt="">
      </el-card>



    </div>



  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import { getCSPractice } from '@/api/exam';
import { useRouter } from 'vue-router';

const router = useRouter();

const dialogVisible = ref(false);
const selectedSubject = ref('行测');
const selectedCount = ref('10');

const showDialog = () => {
  dialogVisible.value = true;
};

const startExam = () => {
  const requestData = {
    subject: selectedSubject.value,
    count: parseInt(selectedCount.value, 10)
  };
  router.push({ name: 'ExamPage', query: requestData });
};


</script>

<style scoped>
.welcome-title {
  text-align: center;
}

.welcome-subtitle {
  text-align: center;
  color: gray;
}

.card-body {
  width: 100%;
  display: flex;
  gap: 60px;
  padding: 50px 80px 10px 80px;
}

.Specialized-exercises {
  flex: 1 1 0;
  padding: 20px;

}

.exercise-image {
  width: 100%;
  padding: 2.5rem;
  margin-bottom: 20px;
}

.Train-realexam {
  flex: 1 1 0;
  padding: 20px;

}

.Specialized-exercises {
  position: relative;
}

.el-button--primary {
  position: absolute;
  right: 3.75rem;
  bottom: 2.5rem;
}
</style>
