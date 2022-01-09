<template>
<div>
  <!-- 面包屑导航区域 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 搜索框 -->
  
  <el-card>
    <el-row :gutter="20">
    <el-col :span="8"><el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
      <el-button icon="el-icon-search" slot="append" @click="getUserList"></el-button></el-input>
      </el-col>
      <!-- 添加用户功能实现 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="50%"
        >
        <!-- 提示款主体内容 -->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
    <el-col :span="2"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
    </el-row>

    <!--用户列表区 -->
    <el-table :data="UserList" border stripe>
      <el-table-column label="#" type="index" ></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <!-- 作用域插槽  获取到该行的数据-->
        <template slot-scope="scope">
          <!-- {{scope.row}} -->
          <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" >
        <!-- 操作的作用域插槽 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="editDeleteId(scope.row.id)"></el-button>

          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="UserTotal">
    </el-pagination>
  </el-card>  

  <!-- 编辑提示框 -->
  <el-dialog
        title="修改用户信息"
        :visible.sync="editvisible"
        width="50%"
        >
        <!-- 编辑提示款主体内容 -->
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px" >
          <el-form-item label="用户名" >
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editvisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserClick">确 定</el-button>
        </span>
      </el-dialog>
</div>
</template>
<script>
export default {
  data(){
    // 定义校验规则 
    var checkEmail = (rule,value,cb)=>{
      const regMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if(regMail.test(value)){
        // 正确的邮箱
        return cb()
      }

      cb(new Error('请输入正确的邮箱'))
    }
    var checkMobile = (rule,value,cb)=>{
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        // 正确的邮箱
        return cb()
      }

      cb(new Error('请输入正确的手机'))
    }
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:2
      },
      UserList:[],
      UserTotal:0,
      dialogVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      addRules:{
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
        password:[{ required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }],
        email:[{ required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { validator:checkEmail,trigger:'blur'}],
        mobile:[{ required: true, message: '请输入用户手机', trigger: 'blur' },
        { validator:checkMobile,trigger:'blur'}],
      },
      editvisible:false,
      editForm:{},
      editRules:{
        email:[{ required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { validator:checkEmail,trigger:'blur'}],
        mobile:[{ required: true, message: '请输入用户手机', trigger: 'blur' },
        { validator:checkMobile,trigger:'blur'}],
      }
    }
  },
  created(){
    // 获取用户展示的数据
    this.getUserList()
  },
  methods:{
    async getUserList(){
    const {data:res} = await this.$http.get('users',{params:this.queryInfo})
    if( res.meta.status !== 200) return this.$message.error("获取用户列表失败")
    this.UserList = res.data.users
    this.UserTotal = res.data.total
    // console.log(res);
    },
    // 监听当前展示多少条数据
    handleSizeChange(newSize){
      // console.log(newSize);
      this.queryInfo.pagesize = newSize
      // 数据改变后刷新
      this.getUserList()
    },
    // 监听当前的页码值
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听用户状态点击事件
    async userStateChange(userInfo){
      // 向服务器发送修改请求
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status !== 200){
        // 保证更新失败时页面状态也不会改变
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error("更新用户状态失败!")
      }
      this.$message.success("更新用户状态成功")
    },
    //点击添加用户功能
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        // 发送添加用户的请求
        const {data:res} = await this.$http.post('users',this.addForm)

        if(res.meta.status !==201) this.$message.error("添加用户失败!")
        this.$message.success("添加用户成功")
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 打开修改用户属性框
    async editUser(id){
      this.editvisible = true
     const {data:res} = await this.$http.get('users/'+id)
     if(res.meta.status !==200) return this.$message.error("请求用户信息失败")
      this.editForm = res.data
    },
        // 修改用户的点击事件
    editUserClick(){
      // 校验信息是否合法
      this.$refs.editFormRef.validate(async value=>{
        if(!value) return 
        // 发送更改请求
        const {data:res} = await this.$http.put("users/"+this.editForm.id,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
        })
        // console.log(res);
        if(res.meta.status !== 200) return this.$message.error("更新用户数据失败")
        // 提示框关闭
        this.editvisible = false
        // 更新数据
        this.getUserList()
        this.$message.success("用户数据更新成功")
      })
    },
    // 打开删除用户的提示款
    async editDeleteId(id){
    const data = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        // console.log(data);
        if(data=="cancel") {return this.$message.info("已取消删除")}
        // 发送删除用户请求
        const {data:res} = await this.$http.delete('users/' + id)
        if( res.meta.status !==200) return this.$message.error("删除用户失败")
        this.getUserList()
        this.$message.success("已成功删除用户") 
    }
  },
}
</script>

<style>

</style>