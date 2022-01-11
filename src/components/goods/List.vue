<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="querInfo.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search"  @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addNewGood">添加商品</el-button></el-col
        >
      </el-row>

      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间"  width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini"><i class="el-icon-edit"></i></el-button>
            <el-button type="danger" size="mini" @click="deleteClick(scope.row)"><i class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querInfo.pagenum"
      :page-sizes="[5, 10, 15, 30]"
      :page-size="querInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return {
      goodsList:[],
      querInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:0
    }
  },
  created(){
    this.getGoodsList()
  },
  methods:{
    async getGoodsList(){
      const {data:res} = await this.$http.get('goods',{ params:this.querInfo})
      if(res.meta.status!==200) return this.$message.error("获取商品列表失败")
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 分页函数
    handleSizeChange(newSize){
      this.querInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage){
      this.querInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除按钮
    async deleteClick(row){
      const data = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(data=="cancel") return this.$message.info("已取消删除")
      const {data:res} = await this.$http.delete(`goods/${row.goods_id}`)
      if(res.meta.status!==200) return this.$$message.error("删除商品失败")
      this.getGoodsList()
      this.$message.success("已成功删除该商品")
    },
    //跳转到新添加商品
    addNewGood(){
      this.$router.push('goods/add')
    } 
  }
};
</script>

<style lang="less" scoped>

</style>