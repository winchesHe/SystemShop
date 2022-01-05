<template>
  <div class="login-view">
    <div class="login-main">
      <div class="login-box">
        <img src="@/assets/img/logo.png" alt="">
      </div>
      <el-form ref="loginFormRes" label-width="" class="login-form" :model="loginForm" :rules="rules">
         <el-form-item prop="username">
         <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
         </el-form-item>
         <el-form-item prop="password" >
         <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"  ></el-input>
         </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="loginFormRes">重置</el-button>
        </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:"Login",
  data(){
    return {
      loginForm:{
        username:"admin",
        password:"123456"
      },
      rules:{
        username:[
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入密码名称', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    loginFormRes(){
      this.$refs.loginFormRes.resetFields()
    },
    login(){
      this.$refs.loginFormRes.validate(async value =>{
        if(!value) return 
        // 返回的promise 用awiat接受并对data进行解构赋值
        const {data:res} = await this.$http.post("login",this.loginForm)
        if(res.meta.status != 200 ) return this.$message.error("登录失败")
        this.$message.success("登录成功")
        // 将登录成功后服务器返回的toke保存到window的sessionStorage中
        window.sessionStorage.setItem("token",res.data.token)
        // 登录成功后切换到主页面
        this.$router.push("/home")
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-view{
  height: 100%;
  background-color: #2b4b6b;
  .login-main{
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);

    .login-box{
      border: 1px solid #aaa;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
        img{
          border-radius: 50%;
          width: 100%;
          height: 100%;
          background-color: #eee;
        }
    }
  }
  .login-form{
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
.btns{
  display: flex;
  justify-content: flex-end;
}
</style>