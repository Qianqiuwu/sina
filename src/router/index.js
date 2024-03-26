import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 解决控制台重复传值的问题
//添加以下代码
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const orginalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return orginalReplace.call(this, location).catch((err) => err)
}
const routes = [
  { path: '/', redirect: 'ViHome/MyHome', meta: { title: `校园活动管理系统` } },
  {
    path: '/ViHome',
    component: () => import('../views/VistHome.vue'),
    children: [
      {
        path: 'MyHome',
        component: () => import('../components/MyHome.vue'),
      },
      {
        path: 'ViArticle',
        component: () => import('../views/ViArticle.vue'),
      },
      {
        name: 'VolPage',
        path: 'VolPage/:id/:actid',
        component: () => import('../views/VolPage.vue'),
        props({ params: { id, actid } }) {
          return { id, actid }
        },
      },
      { path: 'Myerreo', component: () => import('../components/Myerreo.vue') },
    ],
  },
  {
    path: '/AdLogin',
    component: () => import('../views/admin/AdLogin.vue'),
    meta: { title: `管理员登录中心` },
  },
  {
    path: '/AdHome',
    component: () => import('../views/admin/AdminHome.vue'),
    meta: { roles: 'admin', title: `管理员主页`, isKeepAlive: true },
    children: [
      {
        path: 'MyHome',
        component: () => import('../components/MyHome.vue'),
        meta: { title: `管理员主页`, rolue: 'admin' },
      },
      {
        path: 'AdminInfo',
        component: () => import('../views/admin/AdminInfo.vue'),
        meta: { title: `管理员个人中心页` },
      },
      {
        path: 'AdVolunteer',
        component: () => import('../views/admin/AdVolunteer.vue'),
        meta: { title: `用户管理中心` },
      },
      {
        path: 'Supplierimfo',
        component: () => import('../views/admin/Supplierimfo.vue'),
        meta: { title: `用户管理中心` },
      },
      {
        path: 'AdActiapply',
        component: () => import('../views/admin/AdActiapply.vue'),
        meta: { title: `活动报名页` },
      },
      {
        path: 'AdActivitys',
        component: () => import('../views/admin/AdActivitys.vue'),
        meta: { title: `活动统计页` },
      },
      {
        path: 'ComModity',
        component: () => import('../views/admin/ComModity.vue'),
        meta: { title: `商品管理` },
      },
      {
        path: 'CategoryTable',
        component: () => import('../views/admin/CategoryTable.vue'),
        meta: { title: `商品类型管理` },
      },
      {
        path: 'purchase',
        component: () => import('../views/admin/purchase.vue'),
        meta: { title: `采购单` },
      },

      {
        path: 'AdActiarticle',
        component: () => import('../views/admin/AdActiarticle.vue'),
        meta: { title: `文章管理` },
      },
      {
        path: 'AdActiartical',
        component: () => import('../views/admin/AdActiartical.vue'),
        meta: { title: `文章阅读量统计` },
      },
      {
        path: 'AdActinform',
        component: () => import('../views/admin/AdActinform.vue'),
        meta: { title: `活动通知管理` },
      },
    ],
  },
  {
    path: '/Uslogin',
    component: () => import('../views/user/UsLogin.vue'),
    meta: { title: `仓库管理员登录中心`, isKeepAlive: false },
  },

  {
    path: '/UserHome',
    component: () => import('../views/user/UserHome.vue'),
    meta: { title: `仓库管理员中心`, isKeepAlive: false },
    children: [
      {
        path: 'MyHome',
        component: () => import('../components/MyHome.vue'),
        meta: { title: `首页中心`, isKeepAlive: false },
      },
      {
        path: 'UserVolunteer',
        component: () => import('../views/user/UserVolunteer.vue'),
        meta: { title: `个人中心` },
      },
      {
        path: 'ComModity',
        component: () => import('../views/user/ComModity.vue'),
        meta: { title: `商品管理` },
      },
      {
        path: 'purchase',
        component: () => import('../views/user/purchase.vue'),
        meta: { title: `采购单管理` },
      },
      {
        path: 'sale',
        component: () => import('../views/user/sale.vue'),
        meta: { title: `销售单` },
      },
      
      {
        path: 'Inventory',
        component: () => import('../views/user/Inventory.vue'),
        meta: { title: `库存中心` },
      },
      {
        path: 'UserActiarticle',
        component: () => import('../views/user/UserActiarticle.vue'),
        meta: { title: `新闻文章中心` },
      },
      {
        name: 'UserPage',
        path: 'UserPage/:id/:actid',
        component: () => import('../views/user/UserPage.vue'),
        meta: { title: `文章详情页` },
        props({ params: { id, actid } }) {
          return { id, actid }
        },
      },
      {
        name: 'UserActpage',
        path: 'UserActpage/:id/:actid',
        component: () => import('../views/user/UserActpage.vue'),
        meta: { title: `活动详情页` },
        props({ params: { id, actid } }) {
          return { id, actid }
        },
      },
      {
        path: 'UserActinform',
        component: () => import('../views/user/UserActinform.vue'),
        meta: { title: `通知中心` },
      },
    ],
  },

  {
    path: '/EmployeesLogin',
    component: () => import('../views/Employees/AdLogin.vue'),
    meta: { title: `员工登录中心` },
  },
  {
    path: '/EmployeesHome',
    component: () => import('../views/Employees/AdminHome.vue'),
    meta: { roles: 'user', title: `员工主页`, isKeepAlive: true },
    children: [
      {
        path: 'MyHome',
        component: () => import('../components/MyHome.vue'),
        meta: { title: `员工主页`, rolue: 'user' },
      },
      {
        path: 'AdminInfo',
        component: () => import('../views/Employees/AdminInfo.vue'),
        meta: { title: `员工个人中心页` },
      },
      {
        path: 'ComModity',
        component: () => import('../views/Employees/ComModity.vue'),
        meta: { title: `商品管理` },
      },
      {
        path: 'sale',
        component: () => import('../views/Employees/sale.vue'),
        meta: { title: `销售单` },
      },
    ],
  },
  {
    path: '/SupplierLogin',
    component: () => import('../views/Supplier/AdLogin.vue'),
    meta: { title: `供应商登录中心` },
  },
  {
    path: '/SupplierHome',
    component: () => import('../views/Supplier/UserHome.vue'),
    meta: { roles: 'user', title: `供应商主页`, isKeepAlive: true },
    children: [
      {
        path: 'MyHome',
        component: () => import('../components/MyHome.vue'),
        meta: { title: `供应商主页`, rolue: 'user' },
      },
      {
        path: 'AdminInfo',
        component: () => import('../views/Supplier/AdminInfo.vue'),
        meta: { title: `供应商个人中心页` },
      },
      {
        path: 'ComModity',
        component: () => import('../views/Supplier/ComModity.vue'),
        meta: { title: `商品管理` },
      },
      {
        path: 'purchase',
        component: () => import('../views/Supplier/purchase.vue'),
        meta: { title: `采购管理` },
      },
    ],
  },
]

const router = new VueRouter({
  routes,
  // mode: "history",
  linkActiveClass: 'active',
})

/* router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from代表从哪个路径跳转而来
  //next是一个函数，表示放行
  //next() 放行 next('/login')强制跳转
  if (to.path === '/Uslogin') return next()
  //获取token
  const tokenutr = window.sessionStorage.getItem('userinfo')
  if (!tokenutr) return next('/Uslogin')
  next()
}) */

router.afterEach((to) => {
  document.title = to.meta.title || `宜家便利店的进销存管理系统`
})

export default router
