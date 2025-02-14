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
        meta: { title: '首页' }
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
    ]
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
