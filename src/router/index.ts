import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { BasicLayout } from '../layout'

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/",
    component: BasicLayout,
    meta: { title: '首页' },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("../views/Home.vue"),
        meta: { title: "首页" },
      },
      {
        path: "guide",
        name: "Guide",
        component: () => import("../views/Guide.vue"),
        meta: { title: "引导页" },
      },
      {
        path: "/permission",
        name: "Permission",
        meta: { title: "权限测试页" },
        children: [
          {
            path: "/permission/commandPermission",
            name: "commandPermission",
            component: () => import("@/views/CommandPermission.vue"),
            meta: { title: "页面权限" },
          },
        ],
      },
      {
        path: "/charts",
        name: "charts",
        meta: { title: "图表" },
        children: [
          {
            path: "/charts/lineChart",
            name: "lineChart",
            component: () => import("@/views/LineChart.vue"),
            meta: { title: "折线图" },
          },
          {
            path: "/charts/pieChart",
            name: "pieChart",
            component: () => import("@/views/PieChart.vue"),
            meta: { title: "折线图" },
          },
        ],
      },
      {
        path: "/nested",
        name: "nested",
        meta: { title: "路由嵌套" },
        children: [
          {
            path: "/nested/page1",
            name: "page1111",
            component: () => import("@/views/page1.vue"),
            meta: { title: "代替" },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
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