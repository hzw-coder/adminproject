<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 1000px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
// 导入echarts
import echarts from 'echarts'
import _ from 'lodash'
export default {
  name: 'report',
  created() {},
  //页面的元素渲染完毕
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    this.$http.get('/reports/type/1').then(result => {
      if (result.data.meta.status != 200) {
        return this.$message.error('获取数据失败!!!')
      }
      var res = _.merge(result.data.data, this.options)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(res)
    })
  },
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      }
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
</style>
