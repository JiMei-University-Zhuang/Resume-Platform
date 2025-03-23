<template>
  <div class="civil-service">
    <div class="card-header">
      <h1 class="welcome-title">欢迎来到考公中心</h1>
      <div class="countdown-container">
        <h2 class="countdown-title" style="color: #c0392b;text-shadow: 1px 1px 2px rgba(192, 57, 43, 0.1);background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
  -webkit-background-clip: text;
  background-clip: text;">国考倒计时</h2>
        <p class="days-count"
          style=" height: 40px;display: flex; justify-content: center;align-items: end; font-size: 26px;font-weight: bold;">
          {{ days }}
          <span class="days-unit" style="font-size: 18px;font-weight: 400;">天</span>
        </p>
        <p style=" color: gray;padding-top: 10px;">2025年11月30日 星期日
        </p>

      </div>
    </div>

    <div class="card-body">
      <el-card class="Specialized-exercises">
        <div class="exercise-title">专项练习</div>
        <div class="exercise-description ">
          无论你是<span style="font-size: 17px;color:#52BC90 ;"><b>&nbsp;考公小白&nbsp;</b></span>，还是<span
            style="font-size: 17px;color:#5EC89C ;">&nbsp;久经沙场的老将&nbsp;</span>。我们的专项练习，就是你上岸的<span
            style="color: #CB3F23;">
            秘密武器</span>
          ！通过行测和申论的专业训练，让你像超级英雄一样<span style="font-size: 17px;"><b>&nbsp;轻松攻克&nbsp;</b></span>每个考点。准备好了吗？快点击<span
            style="color: gray;font-weight: 600;font-size: 17px;">" 练习设置 "</span>，把考点收入囊中吧！
        </div>
        <div class="exercise-image">
          <img src="@/assets/images/exam_imgs/exercises.jpg" alt="专项练习"></img>
        </div>

        <el-button type="primary" @click="showDialog">练习设置</el-button>
        <el-dialog v-model="dialogVisible" title="定制你的公考练习，行测 or 申论，题量任选，速来开练！" width="600px"
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
        <!-- 组卷按钮 -->
        <el-button type="success" @click="showExamDialog" class="exam-button">
          <i class="iconfont icon-exam"></i>
          真题模考
        </el-button>
        <!-- 试卷选择弹窗 -->
        <el-dialog v-model="examDialogVisible" title="选择真题试卷" width="600px" append-to-body>
          <div class="exam-settings">
            <div class="setting-item">
              <span>试卷名称：</span>
              <el-select v-model="selectedExam" placeholder="请选择试卷" filterable style="width: 100%">
                <el-option v-for="exam in examList" :key="exam.value" :label="exam.label" :value="exam.value" />
              </el-select>
            </div>
          </div>
          <template #footer>
            <el-button @click="examDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="startRealExam" :loading="loadingExam" :disabled="!selectedExam">
              开始考试
            </el-button>
          </template>
        </el-dialog>

      </el-card>



    </div>



  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getCSPractice, getCSExam } from '@/api/exam';

const router = useRouter();
const dialogVisible = ref(false);
const selectedSubject = ref('行测');
const selectedCount = ref('10');
const targetDate = new Date('2025-11-30T00:00:00').getTime();
const timeDifference = ref(targetDate - new Date().getTime());
const examDialogVisible = ref(false)
const selectedExam = ref('')
const loadingExam = ref(false)


const showDialog = () => {
  dialogVisible.value = true;
};


// 预设试卷列表
const examList = [
  {
    value: '2020年国家公务员考试行测真题',
    label: '2020国考·行政职业能力测验真题'
  },
  {
    value: '2020年国家公务员考试申论真题',
    label: '2020国考·申论真题'
  },
  {
    value: '2021年国家公务员考试行测真题',
    label: '2021国考·行政职业能力测验真题'
  },
  {
    value: '2021年国家公务员考试申论真题',
    label: '2021国考·申论真题'
  }
]
// 显示选择弹窗
const showExamDialog = () => {
  examDialogVisible.value = true
  if (examList.length > 0) {
    selectedExam.value = examList[0].value // 默认选中第一个
  }
}

// 开始真题考试
const startRealExam = async () => {
  try {
    loadingExam.value = true
    const { data } = await getCSExam({
      examName: selectedExam.value
    })

    router.push({
      name: 'ExamPage',
      query: {
        examId: data.examId,
        examType: selectedExam.value.includes('行测') ? 'xingce' : 'shenlun'
      }
    })
  } catch (error) {
    console.error('试卷获取失败:', error)
  } finally {
    loadingExam.value = false
    examDialogVisible.value = false
  }
}



const days = computed(() => Math.floor(timeDifference.value / (1000 * 60 * 60 * 24)));
let timerId: any = null;
const startCountdown = () => {
  timerId = setInterval(() => {
    timeDifference.value = targetDate - new Date().getTime();
    if (timeDifference.value < 0) {
      clearInterval(timerId);
      timeDifference.value = 0; // 确保时间不会变成负数
    }
  }, 1000);
};


const startExam = () => {
  const requestData = {
    subject: selectedSubject.value,
    count: parseInt(selectedCount.value, 10)
  };
  router.push({ name: 'ExamPage', query: requestData });
};

onMounted(() => {
  startCountdown();
});

</script>

<style scoped>
.card-body {
  width: 100%;
  display: flex;
  gap: 60px;
  padding: 20px 80px 0 80px;
}

.card-header {
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 50px;
}

.welcome-title {
  text-align: center;
  margin: 0;
  font-size: 2.5rem;
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 2px 2px 4px rgba(45, 52, 54, 0.1);
  position: relative;
  padding-bottom: 15px;
  margin: 0.5rem 0;
}

.welcome-title:hover {
  text-shadow: 3px 3px 6px rgba(45, 52, 54, 0.15);
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* 装饰线 */
.welcome-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #5EC89C 50%, transparent);
  transform: translateX(-50%);
}

.countdown-container {
  background: linear-gradient(145deg, #fff0f0 0%, #ffe5e5 100%);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  box-shadow: 0 6px 20px rgba(206, 83, 83, 0.08);
  position: absolute;
  top: 90%;
  right: 8%;
  border: none;
  transform: translateY(-50%);
  transition: all 0.3s ease;
  text-align: center;
}

.countdown-container:hover {
  transform: translateY(-50%) scale(1.02);
}

.Specialized-exercises {
  flex: 1 1 0;
  padding: 10px 20px 50px 20px;
  position: relative;
}

.exercise-title {
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0.2px 0.2px 1.5px rgb(92, 91, 91);
}

.exercise-description {
  text-indent: 2em;
  font-size: 14px;
  color: gray;
  padding: 10px 5px 0 5px;
}

.exercise-image {
  margin: 0 auto;
  width: 100%;
  text-align: center;
}

.exercise-image>img {
  width: 80%;
  padding: 20px;

}

.Train-realexam {
  flex: 1 1 0;
  padding: 20px;

}

.el-button--primary {
  position: absolute;
  right: 2.75rem;
  bottom: 1.5rem;
  background: linear-gradient(60deg, #5EC89C, #67C23A);
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px #67C23A;
}

.date-info {
  font-size: 0.9rem;
  color: #95a5a6;
  letter-spacing: 1px;
  margin-top: 8px;
  opacity: 0.8;
  font-family: 'Microsoft YaHei', sans-serif;
}

/* 添加数字跳动动画 */
@keyframes jump {
  0% {
    transform: translateY(0) rotate(-2deg);
  }

  50% {
    transform: translateY(-8px) rotate(2deg);
  }

  100% {
    transform: translateY(0) rotate(-2deg);
  }
}


.days-count {
  position: relative;
  display: inline-block;
  animation: jump 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

/* 添加数字装饰线 */
.days-count::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 50%;
  width: 70%;
  height: 2px;
  background: linear-gradient(90deg, var(--primary-red), var(--secondary-red));
  transform: translateX(-50%);
  opacity: 0.5;
}


/* 按钮样式 */
.exam-button {
  position: absolute;
  right: 2rem;
  bottom: 1.5rem;
  background: linear-gradient(135deg, #5EC89C, #67C23A);
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(94, 200, 156, 0.2);
}

.exam-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(94, 200, 156, 0.3);
}

/* 设置项样式 */
.exam-settings {
  padding: 16px 0;
}
.setting-item {
  display: flex;
  align-items: center;
  gap: 16px;

  >span {
    width: 80px;
    text-align: right;
    font-size: 14px;
    color: #606266;
  }
}
</style>
