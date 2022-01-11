<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <el-alert
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position='top' >
      <!-- tabs标签页 -->
      <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number" type="number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="goodList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
              @change="handleChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 渲染表单item项 -->
          <el-form-item :label="item.attr_name" v-for="item in goodParams" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="cb" v-for="(cb,c1) in item.attr_vals" :key="c1" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <!-- 渲染商品属性 -->
          <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
            {{item.attr_vals}}
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 上传图片 -->
          <el-upload
            action="https://lianghj.top:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="headersObj" :on-success="successLoad" >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="addForm.goods_introduce"></quill-editor>
          <el-button type="primary" class="quillBtn" @click="addGood">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览提示框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgPreviewVisible"
      width="50%">
      <img :src="imgUrl" alt="" class="imgUrl">
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data(){
    return {
      activeIndex:'0',
      addForm:{
        goods_name:'',
        goods_price:'',
        goods_weight:'',
        goods_number:'',
        // 商品索引的数组
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },
      addRules:{
        goods_name:[{required:true,message:'请输入商品信息',trigger:'blur'}],
        goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
        goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
        goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
        goods_cat:[{required:true,message:'请选中商品分类',trigger:'blur'}],
      },
      goodList:[],
      goodParams:[],
      onlyData:[],
      // 图片请求头
      headersObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      imgUrl:'',
      imgPreviewVisible:false
    }
  },
  created(){
    this.getGoodList()
  },
  methods:{
    async getGoodList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status!==200) return this.$message.error("获取商品数据失败")
      this.goodList = res.data
    },
    // 级联样式触发
    handleChange(){
      if(this.addForm.goods_cat.length!==3){
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(newName,oldName){
      if(oldName==0 && this.addForm.goods_cat.length!==3){
        this.$message.error("请选中商品分类")
        return false
      }
    },
    // 标签页点击
    async tabClicked(){
      if(this.activeIndex == '1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{ sel:'many'}})
        // 先将商品属性转成数组
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.length == 0?[]:item.attr_vals.split(' ')
        })
        this.goodParams = res.data
        // console.log(this.goodParams);
      }else if(this.activeIndex == '2'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{ sel:'only'}})
        this.onlyData = res.data
        // console.log(this.onlyData);
      }
    },
    // 图片事件
    handlePreview(res){
      const Path = res.response.data.url
      this.imgUrl = Path
      this.imgPreviewVisible = true
    },
    // 图片离开事件
    handleRemove(file){
      // 获取临时路径
        const filePath = file.response.data.tmp_path
        // 找到索引值
        const i = this.addForm.pics.findIndex(x=>x.pic == filePath)
        // 删除对应索引的值
        this.addForm.pics.splice(i,1)
        console.log(this.addForm);
    },
    // 图片上传成功函数
    successLoad(response){
      // console.log(response);
      // 自定义个一个上传对象push到addFompics数组中
      const pic = { pic:response.data.tmp_path}
      this.addForm.pics.push(pic)
      console.log(this.addForm);
    },
    // 添加商品
    addGood(){
      // 预验证
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid){ return this.$message.error("请填写必要的表单")}
        // 深拷贝原来的对象
      const obj = _.cloneDeep(this.addForm)
      obj.goods_cat = obj.goods_cat.join(',')
      // 处理动态参数
      this.goodParams.forEach(item=>{
        const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
        this.addForm.attrs.push(newInfo)
        })
        // 处理静态参数
        this.onlyData.forEach(item=>{
          const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addForm.attrs.push(newInfo)})

          obj.attrs = this.addForm.attrs
          // 发送添加商品请求
          const {data:res} = await this.$http.post('goods',obj)
          if(res.meta.status !== 201) return this.$message.error("添加商品失败")
          this.$message.success("添加商品成功")
          this.$router.push('/goods')

      })
    }
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length == 3){
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox{
  margin: 0 8px 0 0  !important;
}
.imgUrl{
  width: 100%;
}
.quillBtn{
  margin-top: 15px;
}
</style>