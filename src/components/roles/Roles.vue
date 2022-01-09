<template>
  <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="addvisible = true">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 角色内容 -->
    <el-table :data="rolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['tagBottom',i1 ===0?'tagTop':'','vcenter']">
            <!-- 一级权限 -->
            <el-col :span="5">
              <el-tag>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 二级权限 -->
            <el-col :span="19">
              <!-- 嵌套循环渲染二级权限 -->
              <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2 == 0?'':'tagTop','vcenter']">
                <el-col :span="6">
                  <el-tag type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                      <el-tag  v-for="(item3,i3) in item2.children":key="item3.id" type="warning">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <pre>
          <!-- {{scope.row}} -->
          </pre>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="editDelete(scope.row.id)">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="editControl(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <!-- 添加角色的提示框 -->
  <el-dialog
        title="添加用户"
        :visible.sync="addvisible"
        width="50%" @close="clearAdd"
        >
        <!-- 添加提示款主体内容 -->
        <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px" >
          <el-form-item label="用户名称" porp="roleName">
            <el-input v-model="addForm.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="用户描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addvisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
  </el-dialog>  
  <!-- 修改角色的提示框 -->
  <el-dialog
        title="修改用户"
        :visible.sync="editvisible"
        width="50%"
        >
        <!-- 添加提示款主体内容 -->
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="70px" >
          <el-form-item label="用户ID" porp="roleId" >
            <el-input v-model="editForm.roleId" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名称" porp="roleName">
            <el-input v-model="editForm.roleName" ></el-input>
          </el-form-item>
          <el-form-item label="用户描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editvisible = false">取 消</el-button>
          <el-button type="primary" @click="editChange">确 定</el-button>
        </span>
  </el-dialog>  
  <!-- 分配权限的提示框 -->
  <el-dialog
        title="分配用户权限"
        :visible.sync="controlvisible"
        width="50%" @close="controlDialogClose"
        >
        <!-- 添加提示款主体内容 -->
        <!-- 树形结构 -->
        <el-tree :data="rightsList" ref="TreeControl" :props="defaultProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="leafList"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="controlvisible = false">取 消</el-button>
          <el-button type="primary" @click="controlSetTree">确 定</el-button>
        </span>
  </el-dialog>  
  </div>
</template>

<script>
export default {
  data(){
    return {
      rolesList:[],
      addvisible:false,
      addForm:{
        roleName:'',
        roleDesc:''
      },
      addRules:{
        roleName:[{required:true,message:"请输入用户信息",trigger:'blur'}]
      },
      editvisible:false,
      editForm:{},
      editRules:{
      },
      childre:[{authName:"萨达阿三"},{authName:"as"},{authName:"as"},{authName:"as"},],
      controlvisible:false,
      rightsList:[],
      defaultProps:{
        label:'authName',
        children:'children'
      },
      leafList:[],
      leafId:""
    }
  },
  created(){
    this.getRolesList()
  },
  methods:{
    async getRolesList(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !==200) return this.$message.error("获取角色列表失败")
      this.rolesList = res.data
      // console.log(this.rolesList);
    },
    //添加用户的请求
    async addUser(){
    const {data:res} = await this.$http.post('roles',this.addForm)
    if(res.meta.status !=201) return this.$message.error("用户添加失败")
    this.getRolesList()
    this.$message.success("用户添加成功")
    this.addvisible = false
    // console.log(res);
    },
    // 编辑按钮点击事件
    async editClick(id){
      this.editvisible = true
      const {data:res} = await this.$http.get('roles/'+id)
        // console.log(res);
        if(res.meta.status !=200) return this.$message.error("获取用户失败")
        this.editForm = res.data
    },
    // 编辑按钮确定提交数据
    editChange(){
      // 提交前校验
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return 
        // console.log(valid);
        const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
          roleName:this.editForm.roleName,
          roleDesc:this.editForm.roleDesc
        })
        if(res.meta.status !== 200) return this.$message.error("更新用户数据失败")
        this.editvisible = false
        this.getRolesList()
        this.$message.success("用户数据更新成功")
      })
    },
    // 删除按钮事件
    async editDelete(id){
      const data = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        // console.log(data);
        if(data=="cancel") {return this.$message.info("已取消删除")}
        // 发送删除用户请求
        const {data:res} = await this.$http.delete('roles/' + id)
        if( res.meta.status !==200) return this.$message.error("删除用户失败")
        this.$message.success("已成功删除用户") 
        this.getRolesList()
    },
    // 重置添加角色事件
    clearAdd(){
      this.$refs.addFormRef.resetFields()
    },
    // 分配角色的按钮点击
    async editControl(role){
      this.leafId = role.id
      const {data:res} = await this.$http.get('rights/tree')
      if(res.meta.status!=200) return this.$message.error("获取用户权限失败")
      // console.log(res.data);
      this.rightsList = res.data
      // 获取三级权限
      this.getLeafList(role,this.leafList)
      this.controlvisible = true
    },
    // 递归获取三级权限
    getLeafList(node,arr){
      if(!node.children) return arr.push(node.id)

      node.children.forEach(item =>{
        this.getLeafList(item,arr)
      })
    },
    controlDialogClose(){
      this.leafList = []
    },
    // 分配权限的确定
    async controlSetTree(){
      const keys = [...this.$refs.TreeControl.getCheckedKeys(),...this.$refs.TreeControl.getHalfCheckedKeys()]
      // console.log(keys);
      const StrId = keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.leafId}/rights`,{ rids:StrId })
      if(res.meta.status !== 200 ) return this.$message.error("分配权限失败!")
      this.$message.success("分配权限成功")
      this.controlvisible = false
      this.getRolesList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag{
  margin: 7px;
}
.el-row{
  // padding: 10px;
}
.tagTop{
  border-top: 1px solid #eee;
}
.tagBottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>