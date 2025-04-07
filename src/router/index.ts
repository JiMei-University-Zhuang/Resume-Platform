// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { BasicLayout } from '../layout'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useExamStore } from '@/stores/examStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/datascreen',
    name: 'DataScreen',
    component: () => import('../views/datascreen/index.vue'),
    meta: {
      title: '数据大屏',
      icon: 'DataLine',
      roles: ['admin', 'user']
    }
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue')
      },
      {
        path: '/error',
        name: 'Error',
        meta: { title: '错误页面' },
        children: [
          {
            path: '/error/error401',
            name: 'Error401',
            component: () => import('@/views/error/error401.vue'),
            meta: { title: '401' }
          },
          {
            path: '/error/error404',
            name: 'Error404',
            component: () => import('@/views/error/error404.vue'),
            meta: { title: '404' }
          }
        ]
      },
      {
        path: '/chat',
        name: 'Chat',
        component: () => import('../views/chat/AIChat.vue'),
        meta: {
          title: 'AI助手',
          icon: 'ChatDotRound',
          roles: ['admin', 'user']
        }
      },
      {
        path: 'resume',
        name: 'Resume',
        redirect: '/resume/create',
        meta: {
          title: 'AI简历中心',
          icon: 'Document'
        },
        children: [
          {
            path: 'create/:template?',
            name: 'ResumeCreate',
            component: () => import('@/views/resume/Create.vue'),
            meta: { title: '创建简历' }
          },
          {
            path: 'templates',
            name: 'ResumeTemplates',
            component: () => import('@/views/resume/Templates.vue'),
            meta: { title: '简历模板' }
          },
          {
            path: 'analysis',
            name: 'ResumeAnalysis',
            component: () => import('@/views/resume/Analysis.vue'),
            meta: { title: '简历分析' }
          },
          {
            path: 'insights',
            name: 'ResumeInsights',
            component: () => import('@/views/resume/Insights.vue'),
            meta: { title: '行业洞察' }
          }
        ]
      },
      {
        path: 'id-photo',
        name: 'IDPhoto',
        component: () => import('@/views/id-photo/index.vue'),
        meta: {
          title: 'AI证件照',
          icon: 'Camera'
        }
      },
      {
        path: 'career-planning',
        name: 'CareerPlanning',
        redirect: '/career-planning/analysis',
        meta: {
          title: 'AI职业规划',
          icon: 'Compass'
        },
        children: [
          {
            path: 'analysis',
            name: 'CareerAnalysis',
            component: () => import('@/views/career-planning/Analysis.vue'),
            meta: { title: '职业分析' }
          },
          {
            path: 'roadmap',
            name: 'CareerRoadmap',
            component: () => import('@/views/career-planning/Roadmap.vue'),
            meta: { title: '发展规划' }
          },
          {
            path: 'recommendation',
            name: 'CareerRecommendation',
            component: () => import('@/views/career-planning/Recommendation.vue'),
            meta: { title: '职业推荐' }
          }
        ]
      },
      {
        path: 'exam',
        name: 'Exam',
        redirect: '/exam/civil-service',
        meta: {
          title: '考试中心',
          icon: 'Reading'
        },
        children: [
          {
            path: 'civil-service',
            name: 'CivilService',
            component: () => import('@/views/exam/CivilService.vue'),
            meta: { title: '公务员考试' }
          },
          {
            path: 'postgraduate',
            name: 'Postgraduate',
            component: () => import('@/views/exam/Postgraduate.vue'),
            meta: { title: '考研备考' }
          },
          {
            path: 'scorePage',
            name: 'scorePage',
            component: () => import('@/views/exam/scorePage.vue'),
            meta: { title: '成绩页' }
          },
          {
            path: 'wrongPage',
            name: 'wrongPage',
            component: () => import('@/views/exam/WrongQuestionRecord.vue'),
            meta: { title: '错题也米娜' }
          },

          {
            path: 'ExamPage',
            name: 'ExamPage',
            component: () => import('@/views/exam/ExamPage.vue'),
            meta: { title: '考试页面' }
          },
          {
            path: 'politics-answer',
            name: 'PoliticsAnswer',
            component: () => import('@/views/exam/PoliticsAnswer.vue'),
            meta: { title: '政治答题' }
          }
        ]
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/error404.vue'),
    meta: { title: '页面未找到' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')
  const examStore = useExamStore()

  if (to.path !== '/login' && !isAuthenticated) {
    ElMessage.error('请先登录~')
    next('/login')
  } else if (examStore.isInExam && to.path !== from.path) {
    ElMessageBox.confirm('确定要退出吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        examStore.setExamStatus(false)
        next()
      })
      .catch(() => {
        next(false)
      })
  } else {
    next()
  }
})

export default router
