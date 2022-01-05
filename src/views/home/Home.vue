<template>
  <div>
    <el-button type="info" @click="loginOut">退出登录</el-button>
  </div>
</template>

<script>
export default {
  methods:{
    loginOut(){
      // 清楚token
      window.sessionStorage.clear()
      // 跳回登录页面
      this.$router.replace("/login")
    }
  }
}
</script>

<style>

</style>