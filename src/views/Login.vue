<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-left">
        <h1 class="platform-title">AI 职业助手</h1>
        <p class="platform-desc">智能规划你的职业生涯</p>
        <div class="feature-list">
          <div class="feature-item">
            <i class="el-icon-aim"></i>
            <span>精准职业定位</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-data-line"></i>
            <span>个性化发展规划</span>
          </div>
          <div class="feature-item">
            <i class="el-icon-reading"></i>
            <span>AI 简历优化</span>
          </div>
        </div>
      </div>

      <div class="login-box" v-if="isLogin">
        <h2 class="login-title">开启智能职业规划</h2>
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="账号登录" name="account">
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginrules" class="login-form">
              <el-form-item prop="username">
                <el-input
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                  class="custom-input"
                >
                  <template #prefix>
                    <el-icon><UserFilled /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  class="custom-input"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item
                prop="captcha_value"
                class="captcha-container custom-input"
                style="
                  width: auto;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                <el-input
                  v-model="loginForm.captcha_value"
                  placeholder="请输入验证码"
                  style="width: auto; flex: 1; margin-right: 10px"
                >
                  <template #prefix>
                    <el-icon><ChatSquare /></el-icon>
                  </template>
                </el-input>
                <img
                  :src="captchaUrl"
                  alt="验证码"
                  @click="refreshCaptcha"
                  style="cursor: pointer; width: 80px; margin-left: 10px"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  class="login-button"
                  @click="handleLogin(loginFormRef)"
                >
                  立即登录
                </el-button>
                <el-button class="register-button" @click="gotoRegister"> 注册账号 </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="邮箱登录" name="email">
            <el-form
              ref="loginFormEmailRef"
              :model="loginFormEmail"
              :rules="loginrulesEmail"
              class="login-form"
            >
              <el-form-item prop="email">
                <el-input
                  v-model="loginFormEmail.email"
                  placeholder="请输入邮箱地址"
                  class="custom-input"
                >
                  <template #prefix>
                    <el-icon><Message /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                prop="captchaValue"
                class="captcha-container custom-input"
                style="display: flex; align-items: center; justify-content: space-between"
              >
                <el-input
                  v-model="loginFormEmail.captchaValue"
                  placeholder="请输入验证码"
                  class="captcha-input"
                >
                  <template #prefix>
                    <el-icon><ChatSquare /></el-icon>
                  </template>
                </el-input>
                <el-button
                  type="primary"
                  :disabled="countdown.email > 0"
                  @click="sendEmailCaptcha"
                  class="captcha-button"
                >
                  {{ countdown.email > 0 ? `${countdown.email}s后重试` : '获取验证码' }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  :loading="loading"
                  class="login-button"
                  @click="handleEmailLogin(loginFormEmailRef)"
                >
                  立即登录
                </el-button>
                <el-button class="register-button" @click="gotoRegister"> 注册账号 </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="register-box" v-else>
        <h2 class="login-title">欢迎注册智航CareerAI</h2>
        <el-form
          class="register-form"
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerrules"
        >
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="请输入用户名"
              class="custom-input register-item"
            >
              <template #prefix>
                <el-icon><UserFilled /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
              show-password
              class="custom-input"
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="请输入邮箱地址"
              class="custom-input"
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="captcha"
            class="captcha-container custom-input"
            style="display: flex; align-items: center; justify-content: space-between"
          >
            <el-input
              v-model="registerForm.captchaValue"
              placeholder="请输入验证码"
              class="custom-input"
              style="width: auto; flex: 1; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><ChatSquare /></el-icon>
              </template>
            </el-input>
            <el-button
              type="primary"
              :disabled="countdown.register > 0"
              @click="sendRegisterEmailCaptcha"
              class="captcha-button"
            >
              {{ countdown.register > 0 ? `${countdown.register}s后重试` : '获取验证码' }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login-button"
              type="primary"
              id="register"
              :loading="loading"
              @click="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>

          <el-form-item>
            <span class="account-tip">
              已有账号？
              <el-link type="primary" class="back-to-login" @click="gotoLogin"> 立即登录 </el-link>
            </span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getCaptcha,
  getCaptchaKey,
  login,
  sendEmailCaptchaValue,
  sendRegisterEmailCaptchaValue,
  register,
  emailLogin
} from '@/api/user'
import { ApiResponse } from '@/api/types'

interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
  config: any
  request: any
}
// 添加类型定义
interface ValidateError {
  fields: {
    [field: string]: Array<{ message: string }>
  }
}

// 登录响应类型
type LoginResponse = AxiosResponse<ApiResponse<string>>
type LoginEmailResponse = AxiosResponse<ApiResponse<string>>

const router = useRouter()
const loginFormRef = ref()
const loginFormEmailRef = ref()
const registerFormRef = ref()
// const registerFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const loading = ref(false)
const activeTab = ref('account')
const sendingCaptcha = ref(false)

//登录表单
const loginForm = reactive({
  username: '',
  password: '',
  captcha_key: '',
  captcha_value: ''
})
const loginrules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha_value: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
//登录邮箱表单
const loginFormEmail = reactive({
  email: '',
  captchaValue: ''
})
const loginrulesEmail = {
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const registerForm = reactive({
  username: '',
  password: '',
  email: '',
  captchaValue: ''
})
const registerrules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      message: '邮箱格式不正确',
      trigger: 'blur'
    }
  ],
  captchaValue: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const captchaKey = ref('')
const captchaUrl = ref('')
//此处为账号密码登录的验证码获取
const getCaptchaData = async () => {
  try {
    const prepareResponse = (await getCaptchaKey()) as AxiosResponse<ApiResponse<string>>
    if (prepareResponse.data.code === 200) {
      captchaKey.value = prepareResponse.data.data
      const captchaResponse = await getCaptcha(captchaKey.value)
      if (captchaUrl.value) {
        window.URL.revokeObjectURL(captchaUrl.value)
      }
      const blob = new Blob([captchaResponse.data], {
        type: 'image/jpeg'
      })
      captchaUrl.value = window.URL.createObjectURL(blob)
      loginForm.captcha_key = captchaKey.value
    }
  } catch (error) {
    ElMessage.error('获取验证码失败，请刷新重试')
  }
}

// 添加倒计时状态
const countdown = reactive({
  email: 0,
  register: 0
})
// 通用倒计时方法
const startCountdown = (type: 'email' | 'register') => {
  countdown[type] = 60
  const timer = setInterval(() => {
    countdown[type]--
    if (countdown[type] <= 0) {
      clearInterval(timer)
    }
  }, 1000)
} // 邮箱登录发送的验证码
const sendEmailCaptcha = async () => {
  if (countdown.email > 0) return
  try {
    const valid = await loginFormEmailRef.value.validateField('email')
    if (!valid) {
      ElMessage.warning('请先输入有效的邮箱地址')
      return
    }
    sendingCaptcha.value = true
    const response = await sendEmailCaptchaValue({
      email: loginFormEmail.email
    })
    if (response.data.code === 200) {
      ElMessage.success('验证码发送成功')
      startCountdown('email')
    }
  } catch (error) {
    ElMessage.error('验证码发送失败，请输入正确的邮箱地址')
  } finally {
    sendingCaptcha.value = false
  }
}

// 发送注册邮箱验证码
// const sendRegisterEmailCaptcha = async () => {
//   if (countdown.register > 0) return
//   try {
//     // 验证必填字段
//     const isValid = await registerFormRef.value.validate(['username', 'password', 'email'])
//       .then(() => true)
//       .catch((error: ValidateError) => { // 显式声明错误类型
//         const invalidFields = error.fields
//         const firstErrorKey = Object.keys(invalidFields)[0]
//         const errorMessage = invalidFields[firstErrorKey][0].message
//         ElMessage.warning(errorMessage+'，请输入正确信息')
//         // 滚动到错误项
//         const errorElement = document.querySelector(`[prop="${firstErrorKey}"]`)
//         errorElement?.scrollIntoView({
//           behavior: 'smooth',
//           block: 'center'
//         })
//         return false
//       })

//     if (!isValid) return
//     // 发送验证码请求
//     sendingCaptcha.value = true
//     const response = await sendRegisterEmailCaptchaValue({
//       email: registerForm.email
//     })
//     if (response.data.code === 200) {
//       ElMessage.success('验证码发送成功')
//       startCountdown('register')
//     }
//   } catch (error: unknown) {
//     let errorMessage = '验证码发送失败'
//     if (error instanceof Error) {
//       errorMessage = error.message
//     }
//     if (typeof error === 'object' && error !== null && 'response' in error) {
//       const axiosError = error as { response?: { data?: { message?: string } } }
//       if (axiosError.response?.data?.message) {
//         errorMessage += `：${axiosError.response.data.message}`
//       }
//     }
//     ElMessage.error(errorMessage)
//   } finally {
//     sendingCaptcha.value = false
//   }
// }
// 修改后的发送注册验证码方法（中文提示版）
const sendRegisterEmailCaptcha = async () => {
  if (countdown.register > 0) return

  try {
    // 验证必填字段（带中文提示）
    const isValid = await registerFormRef.value
      .validate(['username', 'password', 'email'])
      .then(() => true)
      .catch((error: ValidateError) => {
        if (!error.fields) {
          ElMessage.warning('请正确填写所有必填项')
          return false
        }

        const invalidFields = error.fields
        const firstErrorKey = Object.keys(invalidFields)[0]

        // 获取中文错误提示
        const errorMessage = invalidFields[firstErrorKey][0].message

        // 显示中文提示
        ElMessage.warning(`请检查输入：${errorMessage}`)

        // 滚动到错误项
        const errorElement = document.querySelector(`[prop="${firstErrorKey}"]`)
        errorElement?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        return false
      })

    if (!isValid) return

    // 发送验证码请求
    sendingCaptcha.value = true
    const response = await sendRegisterEmailCaptchaValue({
      email: registerForm.email
    })

    if (response.data.code === 200) {
      ElMessage.success('验证码发送成功')
      startCountdown('register')
    } else {
      ElMessage.error(response.data.message || '验证码发送失败，请重试')
    }
  } catch (error: unknown) {
    let errorMessage = '验证码发送失败'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      if (axiosError.response?.data?.message) {
        errorMessage += `：${axiosError.response.data.message}`
      }
    }
    ElMessage.error(errorMessage)
  } finally {
    sendingCaptcha.value = false
  }
}
const refreshCaptcha = () => {
  getCaptchaData()
}

const isLogin = ref(true)
const gotoRegister = () => {
  isLogin.value = false
}
const gotoLogin = () => {
  isLogin.value = true
}

watch(isLogin, newVal => {
  if (!newVal) {
    registerForm.username = ''
    registerForm.password = ''
  }
})

const handleLogin = async (formEl: any) => {
  if (!formEl) return

  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const response = (await login({
          username: loginForm.username,
          password: loginForm.password,
          captcha_key: captchaKey.value,
          captcha_value: loginForm.captcha_value
        })) as any as LoginResponse
        if (response.data.code === 200 && response.data.data) {
          ElMessage.success('登录成功')
          // router.push('/dashboard')
          // localStorage.setItem('token', response.data.data)
           handleLoginSuccess(response.data.data)
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || error.message || '登录失败，请检查用户名和密码'
        ElMessage.error(errorMessage)
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}
const handleEmailLogin = async (formEl: any) => {
  if (!formEl) return

  await formEl.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const response = (await emailLogin({
          email: loginFormEmail.email,
          captchaValue: loginFormEmail.captchaValue
        })) as any as LoginEmailResponse
        if (response.data.code === 200 && response.data.data) {
          ElMessage.success('登录成功')
          // router.push('/dashboard')
           handleLoginSuccess(response.data.data)
        }
      } catch (error: any) {
        let errorMessage = '登录失败，请检查邮箱和验证码'
        if (error.response && error.response.data) {
          if (error.response.data.message.includes('邮箱参数错误')) {
            errorMessage = '请输入正确的邮箱地址'
          } else if (error.response.data.message.includes('验证码错误')) {
            errorMessage = '请输入正确的验证码'
          } else if (error.response.data.message.includes('账号不存在')) {
            errorMessage = '账号不存在，请注册'
          }
        }
        ElMessage.error(errorMessage)
      } finally {
        loading.value = false
      }
    }
  })
}
//完善登录后处理
const handleLoginSuccess = (token: string) => {
  localStorage.setItem('token', token)
  // 推荐使用window.location.href实现硬刷新
  window.location.href = router.currentRoute.value.query.redirect?.toString() || '/dashboard'
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const response = await register({
          username: registerForm.username,
          password: registerForm.password,
          email: registerForm.email,
          captchaValue: registerForm.captchaValue
        })
        if (response.data.code === 200) {
          ElMessage.success('注册成功')
          gotoLogin()
          refreshCaptcha()
          registerForm.username = ''
          registerForm.password = ''
          registerForm.email = ''
          registerForm.captchaValue = ''
        } else {
          const errorMessage = response.data.message || '注册失败，请重试'
          ElMessage.error(errorMessage)
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || '注册失败，请重试'
        ElMessage.error(errorMessage)
      } finally {
        loading.value = false
      }
    }
  })
}
//统一表单重置方式
const resetRegisterForm = () => {
  registerFormRef.value?.resetFields()
}

// 在创建组件时加载验证码
onMounted(() => {
  getCaptchaData()
})
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(151.5deg, #f5f7fa 0%, #f5f7fa 50%, #e4e7eb 50%, #e4e7eb 100%);
}

.login-content {
  display: flex;
  align-items: center;
  gap: 80px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.login-left {
  flex: 1;
  padding: 40px;
  color: #1849ea;
}

.platform-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #1849ea, #6cf9d3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.platform-desc {
  font-size: 24px;
  color: #666;
  margin-bottom: 40px;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 18px;
  color: #333;
}

.feature-item i {
  font-size: 24px;
  color: #1849ea;
}

.login-box,
.register-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(24, 73, 234, 0.1);
  backdrop-filter: blur(10px);
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

.captcha-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.captcha-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.captcha-input {
  width: auto;
  flex: 1;
  margin-right: 10px;
}

.captcha-button {
  height: 44px;
}

:deep(.custom-input .el-input__wrapper) {
  background-color: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
  padding: 0 15px;
  height: 44px;
}

:deep(.custom-input .el-input__wrapper:hover) {
  background-color: #fff;
  border-color: #e4e7eb;
}

:deep(.custom-input .el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: #1849ea;
  box-shadow: 0 0 0 2px rgba(24, 73, 234, 0.1);
}

:deep(.custom-input .el-input__inner) {
  height: 44px;
  color: #333;
  font-size: 15px;
}

:deep(.custom-input .el-input__inner::placeholder) {
  color: #909399;
}

:deep(.custom-input .el-input__prefix) {
  color: #909399;
  font-size: 18px;
  margin-right: 10px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #e4e7eb;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  color: #606266;
  padding: 0 20px 12px;
}

:deep(.el-tabs__item.is-active) {
  color: #1849ea;
  font-weight: 500;
}

:deep(.el-tabs__active-bar) {
  background-color: #1849ea;
  height: 3px;
  border-radius: 3px;
}

.login-button {
  height: 44px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(45deg, #1849ea, #6cf9d3);
  border: none;
  border-radius: 12px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 73, 234, 0.2);
}

.register-button {
  height: 44px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  border: 2px solid #1849ea;
  color: #1849ea;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: transparent;
  margin-left: 0;
}

.register-button:hover {
  background: rgba(24, 73, 234, 0.05);
}

.el-form-item {
  width: 100%;
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
</style>
