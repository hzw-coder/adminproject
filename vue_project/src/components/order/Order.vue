<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- <el-row>
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="paramsInfo.query">
            <el-button @click="getOrderList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>-->
      <!-- 表格 -->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" width="250px" prop="order_number"></el-table-column>
        <el-table-column width="100px" label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.order_pay=='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="100px" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column width="200px" label="操作">
          <el-button type="primary" @click="showDialog" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="success" @click="showProgress" size="mini" icon="el-icon-location">物流</el-button>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog @close="closeDialog" title="修改地址" :visible.sync="addressVisible" width="50%">
      <el-form
        :model="adressForm"
        :rules="adressRules"
        ref="adressRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省市区/县" prop="adress1">
          <el-cascader
            clearable
            style="width:100%;"
            v-model="adressForm.adress1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="adress2">
          <el-input v-model="adressForm.adress2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressData"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata'

export default {
  name: 'order',
  created() {
    this.getOrderList()
  },
  data() {
    return {
      paramsInfo: {
        query: '',
        //当前页码
        pagenum: 1,
        //每页条数
        pagesize: 5
      },
      total: 0,
      orderList: [],
      //显示隐藏
      addressVisible: false,
      adressForm: {
        adress1: [],
        adress2: ''
      },
      adressRules: {
        adress1: [
          { required: true, message: '请输入省市区/县', trigger: 'blur' }
        ],
        adress2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      //控制物流
      progressVisible: false,
      progressData: []
    }
  },
  methods: {
    getOrderList() {
      this.$http.get('/orders', { params: this.paramsInfo }).then(result => {
        console.log(result)
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败!!!')
        }
        this.orderList = result.data.data.goods
        this.total = result.data.data.total
      })
    },
    // 改变每页条数
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize
      this.getOrderList()
    },
    // 改变页码
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage
      this.getOrderList()
    },
    showDialog() {
      this.addressVisible = true
    },
    closeDialog() {
      this.$refs.adressRef.resetFields()
    },
    showProgress() {
      //获取信息
      this.$http.get('/kuaidi/1106975712662').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败!!!')
        }
        this.progressData = result.data.data
        //console.log('aaaaa', this.progressData)
      })
      this.progressVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>
