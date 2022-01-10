<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
      >
      </el-alert>

      <el-row class="fenlei">
        <el-col>
          <span>选择商品分类: </span>
          <!-- 选择框 -->
          <el-cascader
            v-model="cateKeys"
            :options="cataList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            @click="addVisible = true"
            type="primary"
            :disabled="cateKeys.length == 0 ? true : false"
            >添加属性</el-button
          >
          <!-- 动态属性的数据 -->
          <el-table :data="manyDate" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="attrClose(i,scope.row)">{{item}}</el-tag>
                <!-- 添加标签框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="动态属性"
              prop="attr_name"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit" @click="editClick(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" class="el-icon-delete" @click="deleteClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            @click="addVisible = true"
            :disabled="cateKeys.length == 0 ? true : false"
            >添加属性</el-button
          >
          <!-- 静态属性的数据 -->
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="attrClose(i,scope.row)">{{item}}</el-tag>
                <!-- 添加标签框 -->
              <el-input
                class="input-new-tag"
                v-if="scope.row.inputVisible"
                v-model="scope.row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="静态属性"
              prop="attr_name"
            ></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button type="primary" class="el-icon-edit" @click="editClick(scope.row.attr_id)">编辑</el-button>
                <el-button type="danger" class="el-icon-delete" @click="deleteClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加提示框 -->
    <el-dialog :title="'添加' + textTitle" :visible.sync="addVisible" width="50%" @close="addClose">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-width="120px" 
      >
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑提示框 -->
    <el-dialog :title="'修改' + textTitle" :visible.sync="editVisible" width="50%" @close="editClose">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="120px" 
      >
        <el-form-item :label="textTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cataList: [],
      cateKeys: [],
      // 默认选中第一个
      activeName: "many",
      manyDate: [],
      onlyData: [],
      addVisible: false,
      addForm:{
        attr_name:''
      },
      addRules:{
        attr_name:[{ required:true,message:"请输入参数名称",trigger:'blur'}]
      },
      editVisible: false,
      editForm:{
        attr_name:''
      },
      editRules:{
        attr_name:[{ required:true,message:"请输入参数名称",trigger:'blur'}]
      },
    };
  },
  created() {
    // 获取级联参数
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      this.cataList = res.data;
    },
    // 每次级联选择框选中回调这个函数
    handleChange() {
      this.getCate();
    },
    // 标签页回调函数
    handleTabsClick() {
      this.getCate();
    },
    async getCate() {
      if (this.cateKeys.length !== 3) {
        this.cateKeys = [];
        this.onlyData = []
        this.manyDate = []
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败");
      // console.log(res);
      // 空的字符串切割完会返回空的字符串数组
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals ?
        item.attr_vals.split(" "):[]
        // 给每个分类加一个判断属性
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName == "many") {
        this.manyDate = res.data;
      } else {
        this.onlyData = res.data;
      }
    },
    //添加表单关闭清空
    addClose(){
      this.$refs.addFormRef.resetFields()
    },
    // 添加商品参数确认
    addData(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return 
        const {data:res} =  await this.$http.post(`categories/${this.cateId}/attributes`,{
          'attr_name':this.addForm.attr_name,
          'attr_sel':this.activeName,
        })
        if(res.meta.status !==201 ) return this.$message.error("添加商品参数失败")
        this.$message.success("添加商品参数成功")
        // 刷新参数列表
        this.getCate()
        this.addVisible = false
      })
    },
    // 点击编辑按钮
    async editClick(attr_id){
      const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`)
      if(res.meta.status!==200) return this.$message.error("获取商品参数失败") 
      this.editForm = res.data
      this.editVisible = true
    },
    editClose(){
      this.$refs.editFormRef.resetFields()
    },
    editData(){
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return 
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`
        ,{'attr_name':this.editForm.attr_name,'attr_sel':this.activeName })
        if(res.meta.status!==200) return this.$message.error("修改分类属性失败")
        this.$message.success("修改分类属性成功")
        this.getCate()
      })
      this.editVisible = false
    },
    // 删除按钮点击
    async deleteClick(attrId){
      const data = await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err =>err)
      if(data=="cancel") {return this.$message.info("已取消该删除")}else{
        const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
        if(res.meta.status!==200 ) return this.$message.error("商品属性删除失败")
        this.$message.success("已将该属性删除")
        this.getCate()
      }
    },
    // 添加标签事件
    handleInputConfirm(row) {
      // 如果输出的字符串去除空格后为0说明是无效字符串
      if(row.inputValue.trim() == 0){
        row.inputValue = ''
        row.inputVisible = false
        return 
      }
      // 输入的是合法
      row.attr_vals.push(row.inputValue.trim())
      this.attrGet(row)     
      row.inputValue = ''
      row.inputVisible = false 
      },
    showInput(row){
      row.inputVisible = true
      // 自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    async attrGet(row){
       const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
      if(res.meta.status!==200) return this.$message.error("添加标签失败")
      this.$message.success("添加标签成功")
    },
    attrClose(i,row){
      row.attr_vals.splice(i,1)
      this.attrGet(row)
    }
  },
  computed: {
    cateId() {
      if (this.cateKeys.length == 3) {
        return this.cateKeys[2];
      }
      return null;
    },
    textTitle(){
      if(this.activeName=='many'){
        return '动态属性'
      }else{
        return '静态属性'
      }
    }
  },
};
</script>

<style lang="less" scoped>
.fenlei {
  margin-top: 15px;
}
.el-cascader {
  width: 300px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag {
    width: 120px;
    margin-left: 10px;
  }
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>