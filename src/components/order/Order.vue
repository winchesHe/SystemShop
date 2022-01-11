<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-input placeholder="请输入内容" >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>

      <!-- 表单 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="95px">
        </el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="95px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_price == 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="95px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="160px">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改订单信息" placement="top" :enterable="false">
            <el-button class="el-icon-edit" type="primary" size="mini" @click="editClick"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看运送情况" placement="top" :enterable="false">
              <el-button class="el-icon-s-promotion" type="success" size="mini" @click="positionClick"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="editVisible"
      width="50%" @close="editClose">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" >
        <el-form-item label="省市区/县" prop="address1">
        <!-- 级联选择框 -->
        <el-cascader
          v-model="editForm.address1"
          :options="cityData"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 定位对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="positionVisible"
      width="50%" >
      <!-- TimeLine -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in addreesData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="positionVisible = false">取 消</el-button>
        <el-button type="primary" @click="positionVisible = false">确 定</el-button>
      </span>
    </el-dialog>



    
  </div>
</template>

<script>
import cityData from './citydata'

export default {
  data(){
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10,
      },
      orderList:[],
      total:0,
      editVisible:false,
      editForm:{
        address1:[],
        address2:''
      },
      editFormRules:{
        address1:[{required:true,message:"请选择地址",trigger:'blur'}],
        address2:[{required:true,message:"请输入地址",trigger:'blur'}]
      },
      cityData,
      addreesData:[
    {
      "time": "2018-05-10 09:39:00",
      "ftime": "2018-05-10 09:39:00",
      "context": "已签收,感谢使用顺丰,期待再次为您服务",
      "location": ""
    },
    {
      "time": "2018-05-10 08:23:00",
      "ftime": "2018-05-10 08:23:00",
      "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
      "location": ""
    },
    {
      "time": "2018-05-10 07:32:00",
      "ftime": "2018-05-10 07:32:00",
      "context": "快件到达 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-10 02:03:00",
      "ftime": "2018-05-10 02:03:00",
      "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
      "location": ""
    },
    {
      "time": "2018-05-09 23:05:00",
      "ftime": "2018-05-09 23:05:00",
      "context": "快件到达 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 21:21:00",
      "ftime": "2018-05-09 21:21:00",
      "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
      "location": ""
    },
    {
      "time": "2018-05-09 13:07:00",
      "ftime": "2018-05-09 13:07:00",
      "context": "顺丰速运 已收取快件",
      "location": ""
    },
    {
      "time": "2018-05-09 12:25:03",
      "ftime": "2018-05-09 12:25:03",
      "context": "卖家发货",
      "location": ""
    },
    {
      "time": "2018-05-09 12:22:24",
      "ftime": "2018-05-09 12:22:24",
      "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
      "location": ""
    },
    {
      "time": "2018-05-08 21:36:04",
      "ftime": "2018-05-08 21:36:04",
      "context": "商品已经下单",
      "location": ""
    }
      ],
      positionVisible:false
    }
  },
  created(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})
      if(res.meta.status!==200) return this.$message.error("获取订单列表失败")
      this.orderList = res.data.goods
      this.total = res.data.total
      // console.log(this.orderList);
    },
    // 分页
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 编辑按钮点击
    editClick(){
      this.editVisible = true
    },
    // 级联选择点击函数
    handleChange(){

    },
    // 编辑对话框重置
    editClose(){
      this.$refs.editFormRef.resetFields()
    },
    positionClick(){
      this.positionVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-input{
  width: 400px;
}
.el-cascader{
  width: 100%;
}
.el-input{
  width: 100%;
}
</style>