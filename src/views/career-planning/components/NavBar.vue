<template>
  <nav class="navbar">
    <div class="logo">
      <img src="@/assets/logo.svg" alt="Logo" />
      <span>职业星图</span>
    </div>

    <div class="nav-links">
      <router-link to="/career-planning" class="active">职业探索</router-link>
      <router-link to="/career-planning/roadmap">学习路线</router-link>
      <router-link to="/career-planning/recommendation">职业推荐</router-link>
    </div>

    <div class="nav-controls">
      <button class="ai-assistant-btn" @click="toggleAssistant">
        <div class="ai-icon">AI</div>
        <span>职业助手</span>
      </button>

      <div class="user-profile"></div>
    </div>
  </nav>
</template>

<script setup lang="ts">
const emit = defineEmits(['toggle-assistant'])

const toggleAssistant = () => {
  emit('toggle-assistant')
}
</script>

<style scoped>
.navbar {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: rgba(18, 24, 40, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo img {
  height: 28px;
}

.logo span {
  font-weight: 600;
  font-size: 18px;
  background: linear-gradient(135deg, #3498db, #5983ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-links a {
  color: rgba(224, 224, 255, 0.7);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  padding: 6px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.active {
  color: rgba(224, 224, 255, 1);
  background: rgba(255, 255, 255, 0.05);
}

.nav-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ai-assistant-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.2), rgba(89, 131, 255, 0.2));
  border: 1px solid rgba(89, 131, 255, 0.3);
  border-radius: 20px;
  padding: 8px 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: #e0e0ff;
}

.ai-assistant-btn:hover {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.3), rgba(89, 131, 255, 0.3));
  transform: translateY(-1px);
}

.ai-icon {
  background: linear-gradient(135deg, #3498db, #5983ff);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

.user-profile img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.user-profile img:hover {
  border-color: rgba(89, 131, 255, 0.5);
}
</style>
