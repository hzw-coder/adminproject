import Vue from 'vue'
import Router from 'vue-router'

// const Login = () => import( /* webpackChunkName: "login_home_welcome" */ './components/Login.vue')
import Login from './components/Login.vue'
// const Home = () => import( /* webpackChunkName: "login_home_welcome" */ './components/Home.vue')
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
// const Welcome = () => import( /* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')
import Users from './components/user/Users.vue'
// const Users = () => import( /* webpackChunkName: "users_rights_roles" */ './components/user/Users.vue')
// const Rights = () => import( /* webpackChunkName: "users_rights_roles" */ './components/power/Rights.vue')
import Rights from './components/power/Rights.vue'
// const Roles = () => import( /* webpackChunkName: "users_rights_roles" */ './components/power/Roles.vue')
import Roles from './components/power/Roles.vue'
// const Cate = () => import( /* webpackChunkName: "cate_params" */ './components/goods/Cate.vue')
import Cate from './components/goods/Cate.vue'
// const Params = () => import( /* webpackChunkName: "cate_params" */ './components/goods/Params.vue')
import Params from './components/goods/Params.vue'
// const Lists = () => import( /* webpackChunkName: "list_addgood" */ './components/goods/Lists.vue')
import Lists from './components/goods/Lists.vue'
// const AddGood = () => import( /* webpackChunkName: "list_addgood" */ './components/goods/AddGood.vue')
import AddGood from './components/goods/AddGood'
// const Order = () => import( /* webpackChunkName: "order_report" */ './components/order/Order.vue')
import Order from './components/order/Order.vue'
// const Report = () => import( /* webpackChunkName: "order_report" */ './components/report/Report.vue')
import Report from './components/report/Report.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    // 路由重定向
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: Lists
        },
        {
          path: '/goods/add',
          component: AddGood
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})

// 设置路由导航守卫控制登录权限
router.beforeEach((to, from, next) => {
  // 如果访问login页面，放行
  if (to.path == '/login') {
    return next()
  }
  // 获取token
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  } else {
    next()
  }
})

export default router
