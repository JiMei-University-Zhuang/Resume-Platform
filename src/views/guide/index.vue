<template>
  <div class="guide">
    <h1>引导页</h1>
    <div class="guide-content">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="步骤 1" description="基础功能介绍" />
        <el-step title="步骤 2" description="高级功能说明" />
        <el-step title="步骤 3" description="完成引导" />
      </el-steps>

      <div class="step-content">
        <div v-if="active === 1">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>基础功能介绍</span>
              </div>
            </template>
            <div class="card-content">
              <p>内容</p>
              <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
              </ul>
            </div>
          </el-card>
        </div>

        <div v-else-if="active === 2">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>高级功能</span>
              </div>
            </template>
            <div class="card-content">
              <p>内容</p>
              <ul>
                <li>zzz</li>
                <li>acjxanxs</li>
                <li>ackax</li>
              </ul>
            </div>
          </el-card>
        </div>

        <div v-else>
          <el-card>
            <template #header>
              <div class="card-header">
                <span>完成引导</span>
              </div>
            </template>
            <div class="card-content">
              <el-result
                icon="success"
                title="引导完成"
                sub-title="您已完成所有引导步骤"
              >
                <template #extra>
                  <el-button type="primary" @click="finishGuide">返回首页</el-button>
                </template>
              </el-result>
            </div>
          </el-card>
        </div>
      </div>

      <div class="step-actions">
        <el-button :disabled="active <= 1" @click="prev">上一步</el-button>
        <el-button type="primary" :disabled="active >= 3" @click="next">下一步</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const active = ref(1)

const next = () => {
  if (active.value++ > 3) active.value = 3
}

const prev = () => {
  if (active.value-- < 1) active.value = 1
}

const finishGuide = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
.guide {
  padding: 20px;
}

.guide-content {
  margin-top: 20px;
}

.step-content {
  margin: 40px 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  padding: 20px 0;
}

.step-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

ul {
  padding-left: 20px;
  line-height: 2;
}
</style> 