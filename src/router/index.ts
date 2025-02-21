import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { BasicLayout } from '../layout'

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
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
       
      },
      {
        path: '/guide',
        name: 'Guide',
        component: () => import('@/views/guide/index.vue'),
        meta: { title: '引导页' }
      },
      {
        path: 'permission',
        name: 'Permission',
        meta: { title: '权限测试页' },
        children: [
          {
            path: '/permission/page',
            name: 'Page',
            component: () => import('@/views/permission/Page.vue'),
            meta: { title: '页面权限' }
          },
          {
            path: '/permission/role',
            name: 'Role',
            component: () => import('@/views/permission/Role.vue'),
            meta: { title: '角色权限' }
          }
        ]
      },
      {
        path: '/charts',
        name: 'Charts',
        meta: { title: '图表' },
        children: [
          {
            path: '/charts/lineChart',
            name: 'LineChart',
            component: () => import('@/views/charts/lineChart.vue'),
            meta: { title: '折线图' }
          },
          {
            path: '/charts/pieChart',
            name: 'PieChart',
            component: () => import('@/views/charts/pieChart.vue'),
            meta: { title: '饼状图' }
          }
        ]
      },
      {
        path: '/nested',
        name: 'Nested',
        meta: { title: '路由嵌套' },
        children: [
          {
            path: '/nested/page1',
            name: 'Page1111',
            component: () => import('@/views/nested/page1.vue'),
            meta: { title: '代替' }
          }
        ]
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          roles: ['admin']  // 只允许管理员访问
        }
      },
      {
        path: '/example',
        name: 'Example',
        meta: { title: '综合案例' },
        children: [
          {
            path: '/example/dialogue',
            name: 'Dialogue',
            component: () => import('@/views/example/dialogue.vue'),
            meta: { title: '对话案例' }
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
        path: '/error-log',
        name: 'ErrorLog',
        meta: { title: '错误日志' },
        component: () => import('@/views/error-log/log.vue')
      },
      {
        path: '/mbti',
        name: 'MBTI',
        component: () => import('@/views/mbti/index.vue'),
        meta: {
          title: 'MBTI性格测试',
          icon: 'Aim',
          roles: ['admin', 'user']  // 允许admin和普通用户访问
        }
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
            path: 'create',
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
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/error/error404.vue'),
        meta: { title: '页面未找到' }
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
  routes
})

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token')

//   if (to.path !== '/login' && !isAuthenticated) {
//     next('/login')
//   } else {
//     next()
//   }
// })

export default router
