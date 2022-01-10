import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/login/Login')
const Home = () => import('../views/home/Home')
const Welcome = () => import('../views/home/welcome/Welcome')
const User = () => import('../views/home/user/User')
const Rights = () => import('../components/rights/Rights')
const Roles = () => import('../components/roles/Roles')
const Cate = () => import('../components/goods/Cate')

Vue.use(VueRouter)

const routes = [
  { path:'/',redirect:"/home"},
  { path:"/login",component:Login},
  { path:"/home",component:Home,
  redirect:'/welcome',
  children:[
    { path:'/welcome',component:Welcome},
    { path:'/users',component:User},
    { path:'/rights',component:Rights },
    { path:'/roles',component:Roles },
    { path:'/categories',component:Cate}
  ]},
]

const router = new VueRouter({
  routes
})
// 设置路由拦截守卫
router.beforeEach((to,from,next)=>{
  // to 要访问的路径
  // from代表从哪个路径跳转而来
  //next代表直接放放行
  // 如果访问登录页面直接放行
  // if(to.path === '/login') return next()
  // 查看用户有没token有token放行没toke跳回登录页
  // const tokenStr = window.sessionStorage.token
  // if(!tokenStr) return next('/login')
  next()
})

export default router
