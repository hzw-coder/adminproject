<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" placeholder="请输入内容" v-model="params.query">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goToAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column width="110px" label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column width="90px" label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column width="180px" label="创建时间" prop="add_time">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column width="180px" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button
              @click="deleteGood(scope.row.goods_id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'lists',
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      params: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    getGoodsList() {
      this.$http.get('/goods', { params: this.params }).then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败')
        }
        this.goodsList = result.data.data.goods
        this.total = result.data.data.total
        //console.log('==================', this.total, this.goodsList)
      })
    },
    handleSizeChange(newSize) {
      this.params.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage
      this.getGoodsList()
    },
    //删除商品
    deleteGood(id) {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(result => {
          console.log(result)
          //发送请求
          this.$http.delete('/goods/' + id).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除失败!!!')
            }
            //刷新数据
            this.getGoodsList()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    goToAdd() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style scoped>
</style>
