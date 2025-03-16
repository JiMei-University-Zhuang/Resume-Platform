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
                <el-input v-model="loginForm.username" placeholder="请输入用户名" class="custom-input">
                  <template #prefix>
                    <i class="el-icon-user"></i>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password
                  class="custom-input">
                  <template #prefix>
                    <i class="el-icon-lock"></i>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="captcha_value" class="captcha-container custom-input">
                <el-input v-model="loginForm.captcha_value" placeholder="请输入验证码" style="width: auto;" />
                <img :src="captchaUrl" alt="验证码" @click="refreshCaptcha"
                  style="cursor: pointer;width: 80px; margin-left: 10px;">
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin(loginFormRef)">
                  立即登录
                </el-button>
                <el-button class="register-button" @click="gotoRegister">
                  注册账号
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="人脸登录" name="face">
            <div class="face-login-container">
              <div class="video-container">
                <video ref="videoRef" autoplay playsinline class="face-video"></video>
                <canvas ref="canvasRef" class="face-canvas"></canvas>
              </div>
              <el-button type="primary" class="face-login-button" :loading="isProcessing" :disabled="!isModelLoaded"
                @click="handleFaceLogin">
                {{ isModelLoaded ? '开始识别' : '加载中...' }}
              </el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="register-box" v-else>
        <h2 class="login-title">注册新用户</h2>
        <el-tabs v-model="registerActiveTab" class="register-tabs">
          <el-tab-pane label="手机号注册" name="phone">
            <el-form-item prop="telephone">
              <el-input v-model="registerForm.telephone" placeholder="请输入手机号" class="custom-input">
                <template #prefix>
                  <i class="el-icon-phone"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="邮箱注册" name="email">
            <el-form-item prop="email">
              <el-input v-model="registerForm.email" placeholder="请输入邮箱" class="custom-input">
                <template #prefix>
                  <i class="el-icon-mail"></i>
                </template>
              </el-input>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form class="register-form" ref="registerFormRef" :model="registerForm" :rules="registerrules">
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" class="custom-input">
              <template #prefix>
                <i class="el-icon-user"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password
              class="custom-input">
              <template #prefix>
                <i class="el-icon-lock"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="registerForm.name" placeholder="请输入昵称" class="custom-input">
              <template #prefix>
                <i class="el-icon-user"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha" class="captcha-container custom-input">
            <el-input v-model="registerForm.captcha_value" placeholder="请输入验证码" style="width: auto;" />
            <img :src="captchaUrl" alt="验证码" @click="refreshCaptcha"
              style="cursor: pointer;width: 80px; margin-left: 10px;">
          </el-form-item>
          <el-form-item>
            <el-button class="login-button" type="primary" id="register" @click="handleRegister">
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
import { ref, reactive, onUnmounted, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCaptcha, getCaptchaKey, login } from '@/api/user'
import axios from 'axios'
import * as faceapi from 'face-api.js'

const router = useRouter()
const loginFormRef = ref()
const registerFormRef = ref()
// const registerFormRef = ref<InstanceType<typeof ElForm> | null>(null);
const loading = ref(false)
const registerActiveTab = ref('phone')
const activeTab = ref('account')
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const isModelLoaded = ref(false)
const isProcessing = ref(false)

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

const registerForm = reactive({
  username: '',
  password: '',
  name: '',
  telephone: '',
  email: '',
  captcha_key: '',
  captcha_value: ''
})
const registerrules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  telephone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: '邮箱格式不正确', trigger: 'blur' }
  ],
  captcha_value: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
}

const captchaKey = ref('')
const captchaUrl = ref('')

const getCaptchaData = async () => {
  try {
    const prepareResponse = await getCaptchaKey();
    if (prepareResponse.code === 200) {
      captchaKey.value = prepareResponse.data
      const captchaResponse = await getCaptcha(captchaKey.value)
      if (captchaUrl.value) {
        window.URL.revokeObjectURL(captchaUrl.value)
      }
      const blob = new Blob([captchaResponse], { type: 'image/jpeg' })
      captchaUrl.value = window.URL.createObjectURL(blob)
      loginForm.captcha_key = captchaKey.value
      registerForm.captcha_key = captchaKey.value
    }

  } catch (error) {
    ElMessage.error('获取验证码失败，请刷新重试')
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
        const response = await login({
          username: loginForm.username,
          password: loginForm.password,
          captcha_key: captchaKey.value,
          captcha_value: loginForm.captcha_value
        })

        if (response.code === 200 && response.data) {
          ElMessage.success('登录成功')
          router.push('/dashboard')
          localStorage.setItem('token', JSON.stringify(response.data))
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || '登录失败，请检查用户名和密码'
        ElMessage.error(errorMessage)
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

const handleRegister = async () => {
  if (!registerFormRef.value) return

  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const registerUrl = registerActiveTab.value === 'phone'
        ? 'http://8.130.75.193:8081/auth/telephoneRegister'
        : 'http://8.130.75.193:8081/auth/emailRegister';

      axios.post(registerUrl, registerForm)
        .then(() => {
          ElMessage.success('注册成功');
          gotoLogin()
          refreshCaptcha()
          registerForm.username = '';
          registerForm.password = '';
          registerForm.name = '';
          registerForm.telephone = '';
          registerForm.email = '';
          registerForm.captcha_value = '';

        })
        .catch((error) => {
          console.error('注册失败:', error);
          if (error.response && error.response.status === 500) {
            const errorMessage = error.response.data.message;
            if (errorMessage) {
              if (errorMessage.includes('手机号参数错误')) {
                ElMessage.error('请输入11位的手机号码');
              } else if (errorMessage.includes('请输入包含英语和数字，在6-18位之间')) {
                ElMessage.error('密码需包含数字和字母长度，在 6 到 18 位之间哈');
              } else if (errorMessage.includes('账号已经存在')) {
                ElMessage.error('此用户名已被占用，重新取一个吧');
              } else if (errorMessage.includes('邮箱参数错误')) {
                ElMessage.error('请输入正确的邮箱地址');
              }
            }
          }
        });
    }
  })
}

const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
    }
  } catch (error) {
    console.error('摄像头调用失败:', error)
    ElMessage.error('摄像头调用失败，请检查设备权限')
  }
}
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
}

watch(activeTab, (newVal) => {
  if (newVal === 'face') {
    startCamera()
  } else {
    stopCamera()
  }
})

onUnmounted(() => {
  stopCamera(),
    getCaptchaData()
})

// 在组件挂载后延迟加载模型
onMounted(() => {
  // 给页面一些时间完成初始化
  setTimeout(loadFaceModels, 1500)
  getCaptchaData()

})

// 人脸识别相关
const loadFaceModels = async () => {
  try {
    const baseUrl = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL.slice(0, -1)
      : import.meta.env.BASE_URL
    const MODEL_URL = `${baseUrl}/models`

    console.log('开始加载模型...，路径:', MODEL_URL)

    // 预先检查模型文件是否可访问
    try {
      const manifestResponse = await fetch(`${MODEL_URL}/tiny_face_detector_model-weights_manifest.json`)
      if (!manifestResponse.ok) {
        throw new Error('无法访问模型文件，请检查文件路径是否正确')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`模型文件访问失败: ${error.message}`)
      } else {
        throw new Error('模型文件访问失败: 未知错误')
      }
    }

    // 设置 faceapi 参数
    faceapi.env.monkeyPatch({
      Canvas: HTMLCanvasElement,
      Image: HTMLImageElement,
      ImageData: ImageData,
      Video: HTMLVideoElement,
      createCanvasElement: () => document.createElement('canvas'),
      createImageElement: () => document.createElement('img')
    })

    await faceapi.nets.tinyFaceDetector.load(MODEL_URL)
    await faceapi.nets.faceLandmark68Net.load(MODEL_URL)

    if (!faceapi.nets.tinyFaceDetector.isLoaded || !faceapi.nets.faceLandmark68Net.isLoaded) {
      throw new Error('模型加载失败')
    }

    isModelLoaded.value = true
    ElMessage.success('人脸识别模型加载成功')
  } catch (error: unknown) {
    if (error instanceof Error) {
      ElMessage.error(`人脸识别模型加载失败: ${error.message}`)
    } else {
      ElMessage.error('人脸识别模型加载失败: 未知错误')
    }
    isModelLoaded.value = false
  }
}

// 头部姿态检测
const detectHeadPose = (landmarks: any) => {
  const nose = landmarks.getNose()
  const jawOutline = landmarks.getJawOutline()
  const leftEye = landmarks.getLeftEye()
  const rightEye = landmarks.getRightEye()

  // 眼睛之间的距离
  const eyeDistance = Math.sqrt(
    Math.pow(leftEye[0].x - rightEye[3].x, 2) +
    Math.pow(leftEye[0].y - rightEye[3].y, 2)
  )

  // 鼻子相对于脸部中心的偏移
  const faceCenter = {
    x: (jawOutline[0].x + jawOutline[16].x) / 2,
    y: (jawOutline[0].y + jawOutline[16].y) / 2
  }

  const noseOffset = {
    x: nose[0].x - faceCenter.x,
    y: nose[0].y - faceCenter.y
  }

  // 根据偏移量判断头部姿态
  const threshold = eyeDistance * 0.2 // 眼距的20%作阈值

  if (noseOffset.x < -threshold) return 'left'
  if (noseOffset.x > threshold) return 'right'
  return 'center'
}

// 提取人脸特征
const extractFaceFeatures = async () => {
  try {
    if (!videoRef.value) return null
    const descriptor = await faceapi.detectSingleFace(videoRef.value)
      .withFaceLandmarks()
      .withFaceDescriptor()
    return descriptor ? new Float32Array(descriptor.descriptor) : null
  } catch (error) {
    console.error('提取人脸特征失败:', error)
    return null
  }
}

// 人脸登录
const handleFaceLogin = async () => {
  if (!videoRef.value || !canvasRef.value || isProcessing.value || !isModelLoaded.value) return

  isProcessing.value = true
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  try {
    // 清除之前的绘制
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 设置画布尺寸与视频一致
    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight

    // 检测人脸
    const detection = await faceapi.detectSingleFace(
      videoRef.value,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5
      })
    ).withFaceLandmarks()

    if (!detection) {
      ElMessage.warning('未检测到人脸，请正对摄像头')
      isProcessing.value = false
      return
    }

    // 绘制检测框和关键点
    ctx.lineWidth = 3
    ctx.strokeStyle = '#6cf9d3'
    ctx.fillStyle = '#6cf9d3'

    // 扩大检测框尺寸
    const box = detection.detection.box
    const padding = 20
    ctx.beginPath()
    ctx.rect(
      box.x - padding,
      box.y - padding,
      box.width + (padding * 2),
      box.height + (padding * 2)
    )
    ctx.stroke()

    // 添加半透明遮罩
    ctx.fillStyle = 'rgba(108, 249, 211, 0.1)'
    ctx.fill()

    // 绘制关键点
    const landmarks = detection.landmarks
    const points = landmarks.positions
    ctx.fillStyle = '#1849ea'
    points.forEach(point => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
      ctx.fill()
    })

    // 检测头部姿态
    const pose = detectHeadPose(landmarks)
    if (pose !== 'center') {
      ElMessage.warning('请保持头部正对摄像头')
      isProcessing.value = false
      return
    }

    // 提取人脸特征
    const features = await extractFaceFeatures()
    if (!features) {
      ElMessage.error('人脸特征提取失败，请重试')
      isProcessing.value = false
      return
    }

    ElMessage.success('人脸识别成功！')
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)

  } catch (error) {
    console.error('人脸识别失败:', error)
    ElMessage.error('人脸识别过程出错，请重试')
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(151.5deg,
      #f5f7fa 0%,
      #f5f7fa 50%,
      #e4e7eb 50%,
      #e4e7eb 100%);
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

:deep(.custom-input .el-input__wrapper) {
  background-color: #f5f7fa;
  border: 2px solid transparent;
  border-radius: 12px;
  box-shadow: none;
  transition: all 0.3s ease;
  padding: 0 15px;
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

.face-login-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
  color: #909399;
}

.video-container {
  position: relative;
  width: 340px;
  height: 260px;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
  /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
  padding: 10px 50px;
}

.face-video {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 18px;
  object-fit: cover;
}

.face-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.face-login-button {
  width: 200px;
  height: 40px;
  background: linear-gradient(45deg, #1849ea, #6cf9d3);
  border: none;
  font-size: 16px;
  margin-top: 5px;
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
