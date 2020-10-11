<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-table :data="rightsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==1">等级二</el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'rights',
  created() {
    this.getRightsList()
  },
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    //获取权限列表
    getRightsList() {
      this.$http.get('/rights/list').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取列表失败')
        }
        this.rightsList = result.data.data
      })
    }
  }
}
</script>
<style scoped>
</style>
