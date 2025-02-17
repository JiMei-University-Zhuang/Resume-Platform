<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { watch } from 'vue'
import { login } from '@/api/user'

const router = useRouter()

//登录表单
const loginFormRef = ref()
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
})
const loginrules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}


//注册表单
const registerFormRef = ref()
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})
const registerrules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'change' },
    {
      validator:
        (_rule: any, value: string, callback: (error?: string | Error) => void, source: any) => {
          if (value !== source.password) {
            callback(new Error('两次输入的密码不一致!'));
          } else {
            callback();
          }
        }, trigger: 'change'
    }
  ]

}
const loading = ref(false)

const activeTab = ref('account')

const handleLogin = async (formEl: any) => {
  if (!formEl) return;

  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      try {
        // 调用 login 方法发送登录请求
        const response = await login({
          username: loginForm.username,
          password: loginForm.password,
        });
        
        // 登录成功，处理返回的 token
        const token = response;
        localStorage.setItem('token', token); // 将 token 存储到本地
        ElMessage.success('登录成功');
        router.push('/dashboard');
      } catch (error: any) {
        // 登录失败，提示错误信息
        const errorMessage = error.response?.data?.message || '登录失败，请检查用户名和密码';
        ElMessage.error(errorMessage);
      } finally {
        loading.value = false; }
    }
  });
};
//注册逻辑
const handleRegister = async (formEl: any) => {
  if (!formEl) return

  await formEl.validate((valid: boolean) => {
    if (valid) {
      // 模拟注册成功逻辑
      ElMessage.success('注册成功，请登录！')
      setTimeout(() => {
        gotoLogin() // 跳转到登录页面
      }, 1500) // 延迟 1.5 秒跳转
    }
  })
}

const isLogin = ref(true)
const gotoRegister = () => {
  //切换到注册页面
  isLogin.value = false

}
const gotoLogin = () => {
  //切换到登录页面
  isLogin.value = true
}

watch(isLogin, (newVal) => {
  if (!newVal) {
    // 当切换到注册页面时，清空注册表单
    registerForm.username = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-box" v-if="isLogin">
      <h2>AI管理平台</h2>
      <el-tabs v-model="activeTab" class="login-tabs">
        <el-tab-pane label="账号登录" name="account">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginrules" class="login-form">
            <el-form-item prop="username" label="用户名:">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item prop="password" label="密码:&emsp;">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <!-- <el-form-item label="验证码:" prop="captcha" class="captcha-form-item">
              <el-input v-model="loginForm.captcha" placeholder="请输入验证码" class="captcha-input" />
              <img :src="verifyCode" title="点击切换验证码" @click="changeverifyCode" class="captcha-img" />
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin(loginFormRef)">
                登录
              </el-button>
              <el-button class="login-button" @click="gotoRegister" style="margin-left: 0;">
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

    <!-- 注册页面 -->
    <div class="register-box" v-else>
      <h2>新用户注册</h2>
      <el-form class="register-form" ref="registerFormRef" :model="registerForm" :rules="registerrules">
        <el-form-item prop="username" label="用户名:&emsp;">
          <el-input v-model="registerForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password" label="密码:&emsp;&emsp;">
          <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码:">
          <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" id="register" @click="handleRegister(registerFormRef)">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <span class="account-tip">
            已有账号？
            <el-link type="primary" class="back-to-login" @click="gotoLogin">
              立即登录
            </el-link>
          </span>
        </el-form-item>
      </el-form>
    </div>




  </div>
</template>

<style scoped>
.el-form-item {
  width: 100%;
}

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

.login-box,
.register-box {
  position: absolute;
  right: 150px;
  width: 350px;
  padding: 30px 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 8px rgba(148, 183, 205, 0.4);

}
.login-box h2, .register-box h2 {
  text-align: center;
  /* 遗留问题，字体颜色 */
  /* background-color:linear-gradient(160deg, #6CF9D3, #1849ea); */

  margin-bottom: 50px;
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
  margin-top: 30px;
  background: linear-gradient(160deg, #6CF9D3, #1849ea);
  border: none;
  margin-bottom: 10px;
}
.captcha-form-item {
  display: flex;
  align-items: center;
}

.captcha-input {

  width: calc(100% - 90px);
  height: 40px;
}

.captcha-img {
  width: 80px;
  height: 40px;
  font-size: 8px;
  padding-left: 10px;

}

.account-tip {

  position: absolute;
  right: 0;

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