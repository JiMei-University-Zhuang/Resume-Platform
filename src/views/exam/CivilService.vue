<template>
  <div class="civil-service">


    <div class="card-header">
      <h1 class="welcome-title">欢迎来到考公中心</h1>

    </div>
    <div class="card-body">
      <el-card class="CS_Exam">
        <h3>专项练习</h3>
        <select>
          <option value="">申论</option>
          <option value="">行测</option>
        </select>

      </el-card>
      <el-card class="CS_Specialize">
        <h3>往年真题</h3>
        <div class="CS_Specialize_title">
          <div v-for="(exam, index) in exams" :key="index" class="exam-item">
            <img src="@/assets/images/exam_imgs/examicon.png" alt="" class="examicon">
            <span class="exam-name">{{ exam.name }}</span>
            <el-button type="success" plain @click="CS_SpecializeTest(exam.name)">前往测试</el-button>
          </div>
        </div>

      </el-card>


    </div>



  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';


const loading = ref<boolean>(false)
const exams = ref([
  { name: '2023年试卷一' },
  { name: '2023年试卷申论' },
  { name: '2024年法律知识' },
  { name: '计算机基础' }
]);

const CS_SpecializeTest = (examName: string) => {
  ElMessageBox.confirm(
    `是否进入 ${examName} 练习`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      router.push({ name: 'ExamPage' });
      ElMessage({
        type: 'success',
        message: `已进入 ${examName} 练习`
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: `进入 ${examName} 练习已取消`
      });
    });
};

defineExpose({
  loading
})
</script>

<style scoped>
.civil-service {
  padding: 20px;
}

.welcome-title {
  text-align: center;
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-body {
  display: flex;
  width: 100%;

  justify-content: space-between;
  padding-top: 40px;
}

.CS_Specialize {
  width: 49%;
  height: 400px;
}

.CS_Exam {
  width: 49%;
}

.CS_Specialize_title {
  padding: 20px;
  padding-top: 40px;

}

.exam-item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam-item .examicon {
  margin-right: 10px;
}

.exam-item .exam-name {
  flex-grow: 1;
}

.exam-item>button {
  margin-left: auto;
  position: static;
}

.examicon {
  width: 30px;
  height: 30px;
  display: block;
}
</style>
