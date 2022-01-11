<template>
  <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
       <el-col>
         <el-button type="primary" @click="addGoods">添加商品</el-button>
       </el-col>
    </el-row>
      <!-- 商品表格区 -->
        <tree-table class="tree-table" :data="cateList" :columns="columns" 
        show-index index-text="#"
        border
         :selection-type="false" :expand-type="false">
         <!-- 自定义插槽 -->
         <template slot="isok" slot-scope="scope">
           <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted === false"></i>
           <i class="el-icon-error" style="color:red" v-else></i>
         </template>
         <template slot="order" slot-scope="scope">
           <el-tag size="mini" type="primary" v-if="scope.row.cat_level == 0">一级</el-tag>
           <el-tag size="mini" type="danger" v-else-if="scope.row.cat_level ==1 ">二级</el-tag>
           <el-tag size="mini" type="warning" v-else>三级</el-tag>
         </template>
         <template slot-scope="scope" slot="control">
           <el-button type="primary" size="small  " @click="editClick(scope.row.cat_id)"><i class="el-icon-edit"></i>编辑</el-button>
           <el-button type="danger" size="small  " @click="deleteClick(scope.row.cat_id)"><i class="el-icon-delete"></i>删除</el-button>
         </template>
         </tree-table>
         <!-- 分页区 -->
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cateTotal">
        </el-pagination>
      <!-- 商品分类区 -->
    </el-card>
    <!-- 添加分类的提示框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addVisible"
      width="50%" @close="addCateClose">
      <!-- 内容表单 -->
      <el-form :model="addForm" :rules="addrules" ref="addruleForm" label-width="100px" >
      <el-form-item label="分类名称 :" prop="cat_name">
        <el-input v-model="addForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="分类名称 :" >
        <el-cascader
          v-model="selectKeys"
          :options="parentList"
          :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly:'true' }"
          @change="selectChang" clearable ></el-cascader>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑提示框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="editvisible"
      width="50%" >
      <!-- 内容表单 -->
      <el-form :model="editForm"  ref="editruleForm" label-width="100px" >
      <el-form-item label="分类名称 :" >
        <el-input v-model="editForm.cat_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="分类级别 :" >
        <el-input v-model="editForm.cat_level" disabled></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editvisible = false">取 消</el-button>
        <el-button type="primary" @click="editvisible= false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品列表
      cateList:[],
      // 商品类数
      cateTotal:0,
      columns:[{
        label:"分类名称",
        prop:'cat_name'
      },
      {
        type:"template",
        label:"是否有效",
        template:"isok"
      },
      {
        type:"template",
        label:"排序",
        template:"order"
      },
      {
        type:"template",
        label:"操作",
        template:"control"
      }
      ],
      addForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      addrules:{
        cat_name:[ {required:"true",message:"请输入分类名称",tirrger:"blur"} ]
      },
      addVisible:false,
      parentList:[],
      selectKeys:[],
      editvisible:false,
      editForm:{},
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    // 请求商品数据
    async getCateList(){
     const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
     if(res.meta.status !== 200) return this.$message.error("商品数据请求失败")
    //  console.log(res);
    //  商品数据赋值
     this.cateList = res.data.result
     this.cateTotal = res.data.total
    },
    // 监听页面显示数量的改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页数的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addGoods(){
      this.addVisible = true
      // 获取列表
      this.getParentList()
    },
    // 获取父极分类的数组
    async getParentList(){
      const {data:res} = await this.$http.get('categories',{
        params:{type:2}
      })
      if(res.meta.status !== 200) return this.$message.error("获取父级列表失败")
      this.parentList = res.data
      // console.log(this.parentList);
    },
    // 添加分类的点击弹框事件
    selectChang(){
      // console.log(this.selectKeys);
      if(this.selectKeys.length>0){
        if(this.selectKeys.length==1) this.addForm.cat_pid = 1
        if(this.selectKeys.length==2) this.addForm.cat_pid = 2
        this.addForm.cat_level = this.selectKeys.length
        return
      }else{
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    // 添加分类确定按钮
    addClick(){
      this.$refs.addruleForm.validate(async valid=>{
        if(!valid) return
        const {data:res} = await this.$http.post('categories',this.addForm)
        // console.log(res);
        if(res.meta.status!==201) return this.$message.error("添加分类失败")
        this.$message.success("添加分类成功")
        this.getCateList()
      })
      this.addVisible = false
    },
    // 监听对话框的关闭,重置表单数据
    addCateClose(){
      this.$refs.addruleForm.resetFields()
      this.selectKeys=[]
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 编辑功能
    async editClick(id){
      const {data:res} = await this.$http.get('categories/'+id)
      this.editForm = res.data
      this.editvisible = true
    },
    // 删除功能
    async deleteClick(id){
      const data = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
        if(data=='cancel') {return this.$message.info("已取消该删除")}else{
          const {data:res} = await this.$http.delete('categories/'+id)
          if(res.meta.status !== 200) return this.$message.error("删除失败")
          this.$message.success("删除成功")
          this.getCateList()
        }
        
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table{
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>