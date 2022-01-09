<template>
  <el-container class="home-contain">
    <!-- 头部内容 -->
  <el-header>
    <div>
      <img src="@/assets/img/mochadandan.jpg" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="loginOut">退出登录</el-button> 
    </el-header>
  <el-container>
    <!-- 侧边内容 -->
    <el-aside width="200px">
      <el-menu
      background-color="#373d41"
      text-color="#fff"
      active-text-color="#409Eff" :unique-opened="true" router
      :default-active="submenuPath"
      >
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + '' " v-for="(item,index) in AisdeList" :key="index" >
        <template slot="title">
          <!-- 循环绑定图标 -->
          <i :class="iconList[index]" ></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index='"/"+subitem.path' v-for="(subitem,subindex) in item.children" :key="subitem.id" @click="pathClick(`/${subitem.path}`)">
          <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 主要内容 -->
    <el-main>
      <!-- 路由占位符 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>

<script>

export default {
  components:{
  },
  data(){
    return {
      AisdeList:[],
      iconList:['el-icon-s-custom','el-icon-box','el-icon-shopping-bag-1','el-icon-s-order','el-icon-data-analysis'],
      submenuPath:''
    }
  },
  created(){
    // 获取侧边栏数据
    this.getAsideMess()
    // 将数据保存在session中管理它的状态
    this.submenuPath = window.sessionStorage.getItem("activePath")
  },
  methods:{
    loginOut(){
      // 清楚token
      window.sessionStorage.clear()
      // 跳回登录页面
      this.$router.replace("/login")
    },
    async getAsideMess(){
      // 请求数据
    const {data:res} = await this.$http.get('menus')
      // 获取数据失败时
      if(res.meta.status !== 200 ) return this.$message.error("res.meta.msg")
      this.AisdeList = res.data
      // console.log(this.AisdeList);
    },
    // 二级菜单点击高亮
    pathClick(id){
      window.sessionStorage.setItem("activePath",id)
      this.submenuPath = id
    }
  },
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div{
    display: flex;
    align-items: center;
    span {
      color: #fff;
      margin-left: 15px;
      font-size: 18px;
    }
  }
  img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    // 去除边框突出
    border-right: none;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.home-contain{
  height: 100%;
}
</style>