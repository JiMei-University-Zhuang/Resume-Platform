// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { BasicLayout } from '../layout'
import { message, Modal } from 'ant-design-vue'
import { useExamStore } from '@/stores/examStore'
import { useUserStore } from '@/stores/userStore'

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
      i18n: 'breadcrumb.dataScreen',
      icon: 'DataLine',
      roles: ['admin', 'ADMIN']
    }
  },
  {
    path: '/career-star-map',
    name: 'CareerStarMapFull',
    component: () => import('../views/career-planning/CareerMapFull.vue'),
    meta: {
      title: '职业星图',
      i18n: 'breadcrumb.careerMap'
    }
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: {
          title: '控制台',
          i18n: 'breadcrumb.dashboard'
        }
      },
      {
        path: 'user-management',
        name: 'UserManagement',
        redirect: '/user-management/list',
        meta: {
          title: '用户管理',
          i18n: 'breadcrumb.userManagement',
          icon: 'User',
          roles: ['ADMIN']
        },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: () => import('@/views/user-management/UserList.vue'),
            meta: {
              title: '用户列表',
              i18n: 'breadcrumb.userList',
              roles: ['ADMIN']
            }
          },
          {
            path: 'add',
            name: 'UserAdd',
            component: () => import('@/views/user-management/UserForm.vue'),
            meta: {
              title: '添加用户',
              i18n: 'breadcrumb.userAdd',
              roles: ['ADMIN']
            }
          },
          {
            path: 'edit/:id',
            name: 'UserEdit',
            component: () => import('@/views/user-management/UserForm.vue'),
            meta: {
              title: '编辑用户',
              i18n: 'breadcrumb.userEdit',
              roles: ['ADMIN']
            }
          }
        ]
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
          i18n: 'breadcrumb.aiAssistant',
          icon: 'ChatDotRound'
        }
      },
      {
        path: '/chat/history',
        name: 'ChatHistory',
        component: () => import('../views/chat/ChatHistory.vue'),
        meta: {
          title: '聊天历史',
          i18n: 'breadcrumb.chatHistory',
          icon: 'ChatDotRound'
        }
      },
      {
        path: 'resume',
        name: 'Resume',
        redirect: '/resume/create',
        meta: {
          title: 'AI简历中心',
          i18n: 'breadcrumb.resumeModule',
          icon: 'Document'
        },
        children: [
          {
            path: 'create/:template?',
            name: 'ResumeCreate',
            component: () => import('@/views/resume/Create.vue'),
            meta: {
              title: '创建简历',
              i18n: 'breadcrumb.resumeCreate'
            }
          },
          {
            path: 'templates',
            name: 'ResumeTemplates',
            component: () => import('@/views/resume/Templates.vue'),
            meta: {
              title: '简历模板',
              i18n: 'breadcrumb.resumeTemplates'
            }
          },
          {
            path: 'analysis',
            name: 'ResumeAnalysis',
            component: () => import('@/views/resume/Analysis.vue'),
            meta: {
              title: '简历分析',
              i18n: 'breadcrumb.resumeAnalysis'
            }
          },
          {
            path: 'insights',
            name: 'ResumeInsights',
            component: () => import('@/views/resume/Insights.vue'),
            meta: {
              title: '行业洞察',
              i18n: 'breadcrumb.resumeInsights'
            }
          }
        ]
      },
      {
        path: 'id-photo',
        name: 'IDPhoto',
        component: () => import('@/views/id-photo/index.vue'),
        meta: {
          title: 'AI证件照',
          i18n: 'breadcrumb.aiIDPhoto',
          icon: 'Camera'
        }
      },
      {
        path: 'career-planning',
        name: 'CareerPlanning',
        redirect: '/career-planning/analysis',
        meta: {
          title: 'AI职业规划',
          i18n: 'breadcrumb.careerPlanning',
          icon: 'Compass'
        },
        children: [
          {
            path: 'map',
            name: 'CareerMap',
            component: () => import('@/views/career-planning/CareerMap.vue'),
            meta: {
              title: '职业星图',
              i18n: 'breadcrumb.careerMap'
            }
          },
          {
            path: 'learning-plan',
            name: 'LearningPlan',
            component: () => import('@/views/career-planning/LearningPlan.vue'),
            meta: {
              title: '学习计划',
              i18n: 'breadcrumb.learningPlan'
            }
          }
        ]
      },
      {
        path: 'exam',
        name: 'Exam',
        redirect: '/exam/civil-service',
        meta: {
          title: '考试中心',
          i18n: 'breadcrumb.examCenter',
          icon: 'Reading'
        },
        children: [
          {
            path: 'civil-service',
            name: 'CivilService',
            component: () => import('@/views/exam/CivilService.vue'),
            meta: {
              title: '公务员考试',
              i18n: 'breadcrumb.civilServiceExam'
            }
          },
          {
            path: 'postgraduate',
            name: 'Postgraduate',
            component: () => import('@/views/exam/Postgraduate.vue'),
            meta: {
              title: '考研备考',
              i18n: 'breadcrumb.postgraduatePrep'
            }
          },
          {
            path: 'scorePage',
            name: 'scorePage',
            component: () => import('@/views/exam/scorePage.vue'),
            meta: { title: '成绩页' }
          },
          {
            path: 'wrongquestionPage',
            name: 'wrongquestionPage',
            component: () => import('@/views/exam/WrongQuestion.vue'),
            meta: { title: '错题页面' }
          },
          {
            path: 'ExamPage',
            name: 'ExamPage',
            component: () => import('@/views/exam/ExamPage.vue'),
            meta: { title: '考试页面' }
          },
          {
            path: 'postgraduate-answer',
            name: 'PostgraduateAnswer',
            component: () => import('@/views/exam/PostgraduateAnswer.vue'),
            meta: { title: '考研答题' }
          },
          {
            path: 'politics-answer',
            name: 'PoliticsAnswer',
            component: () => import('@/views/exam/PoliticsAnswer.vue'),
            meta: { title: '政治答题' }
          },
          {
            path: 'professional-answer',
            name: 'ProfessionalAnswer',
            component: () => import('@/views/exam/ProfessionalAnswer.vue'),
            meta: { title: '计算机专业课答题' }
          },
          {
            path: 'psychology-answer',
            name: 'PsychologyAnswer',
            component: () => import('@/views/exam/PsychologyAnswer.vue'),
            meta: { title: '心理学专业课答题' }
          },
          {
            path: 'english-answer',
            name: 'EnglishAnswer',
            component: () => import('@/views/exam/EnglishAnswer.vue'),
            meta: { title: '英语答题' }
          },
          {
            path: 'history-answer',
            name: 'HistoryAnswer',
            component: () => import('@/views/exam/HistoryAnswer.vue'),
            meta: { title: '历史学专业课答题' }
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
  const userStore = useUserStore()

  const requiresRole = to.meta.roles as Array<string> | undefined

  if (to.path !== '/login' && !isAuthenticated) {
    message.error('请先登录~')
    next('/login')
  } else if (requiresRole && requiresRole.length) {
    if (!requiresRole.includes(userStore.userInfo.role)) {
      message.error('您没有权限访问该页面')
      next('/error/error401')
      return
    }
    checkExamStatus()
  } else {
    checkExamStatus()
  }

  function checkExamStatus() {
    if (examStore.isInExam && to.path !== from.path) {
      // 特殊处理：如果是从考试页面返回到考试中心主页，则不弹出确认对话框
      if (from.path.includes('/exam/ExamPage') && to.path === '/exam') {
        examStore.setExamStatus(false)
        next()
        return
      }

      // 其他情况：弹出确认对话框
      Modal.confirm({
        title: '提示',
        content: '确定要退出答题页吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          examStore.setExamStatus(false)
          next()
        },
        onCancel: () => {
          next(false)
        }
      })
    } else {
      next()
    }
  }
})

export default router
