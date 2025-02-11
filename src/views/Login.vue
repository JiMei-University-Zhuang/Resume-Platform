<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})

const loading = ref(false)

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const handleLogin = async (formEl: any) => {
  if (!formEl) return

  await formEl.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      // 这里添加登录逻辑
      setTimeout(() => {
        loading.value = false
        router.push('/dashboard')
      }, 1000)
    }
  })
}

const verifyCode = ref('')
const changeverifyCode = () => {
  //路径待改，先
  verifyCode.value = 'https://www.baidu.com/img/bd_logo1.png'
}
const gotoRegister = () => {
  //注册页面
  router.push('/register')
}

const activeTab = ref('account')

</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h2>AI管理平台</h2>
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="账号登录" name="account">
          <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-form">
            <el-form-item prop="username" label="用户名:">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password" label="密码:&emsp;">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item label="验证码:" prop="captcha" class="captcha-form-item">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="captcha-input" />
              <img :src="verifyCode" title="点击切换验证码" @click="changeverifyCode" class="captcha-img" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin(loginFormRef)">
                登录
              </el-button>
            </el-form-item>
            <el-form-item>
          <el-button class="login-button"  id="register"  @click="gotoRegister">
            注册
          </el-button>
        </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="人脸登录" name="face">
          <div class="face-login-container">
            <p>预留口子</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;

  display: flex;
  /* justify-content: center; */
  align-items: center;
  background-image: url('@/assets/images/login-bg.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}

.login-box {
  position: absolute;
  right: 150px;
  width: 400px;
  padding: 30px 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  color: #303133;
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  padding: 18px 0;
  margin-top: 18px;
}
#register {
  margin-top: 0px;
}

.captcha-form-item{
  display: flex;
  align-items: center;
}
.captcha-input{
  
  width: calc(100% - 90px);
  height: 40px;
}
.captcha-img{
  width: 80px;
  height: 40px;
  font-size: 8px;
  padding-left: 10px;
  
}


:deep(.el-input__wrapper) {
  padding: 0 11px;
}

:deep(.el-input__inner) {
  height: 40px;
}

.login-tabs {
  margin-bottom: 20px;
}

:deep(.el-tabs__nav) {
  width: 100%;
}

:deep(.el-tabs__item) {
  width: 50%;
  text-align: center;
}

.face-login-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
}
</style>