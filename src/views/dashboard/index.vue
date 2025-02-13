<template>
  <div class="home">
    <h1>仪表盘1</h1>
    <div class="home-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>数据统计</span>
              </div>
            </template>
            <div class="card-content">
              <el-statistic title="活跃用户" :value="1234" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>系统状态</span>
              </div>
            </template>
            <div class="card-content">
              <el-statistic title="系统运行时间" :value="99.9" suffix="%" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>任务完成</span>
              </div>
            </template>
            <div class="card-content">
              <el-progress type="dashboard" :percentage="80" />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home组件的逻辑代码
</script>

<style scoped>
.home {
  padding: 20px;
}

.home-content {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 20px 0;
  text-align: center;
}

.el-card {
  margin-bottom: 20px;
}
</style> 