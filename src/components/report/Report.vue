<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
  <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from "lodash"

export default {
  data(){
    return {
      // 需要合并的配置
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created(){},
  async mounted(){
    // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // 发送数据表请求
      const {data:res} = await this.$http.get('reports/type/1')
      // if()
      // console.log(res.data);
      // 指定图表的配置项和数据
      // 用loadsh 将对象合并
      const newOption = _.merge(res.data,this.options)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(newOption);
  },
  methods:{}
}
</script>

<style>

</style>