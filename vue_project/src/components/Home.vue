<template>
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <span>后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
          unique-opened
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
          :default-active="activaPath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="(item) in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+menuItem.path"
              v-for="(menuItem) in item.children"
              :key="menuItem.id"
              @click="savePath('/'+menuItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{menuItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'home',
  created() {
    this.getList()
    this.activaPath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      menuList: [],
      // 字体图标
      icons: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      activaPath: ''
    }
  },
  methods: {
    // 退出
    logout() {
      //清空session
      window.sessionStorage.clear()
      //跳转
      this.$router.push('/login')
    },
    // 获取下拉菜单
    getList() {
      //发起请求
      this.$http.get('/menus').then(result => {
        //console.log(result)
        if (result.data.meta.status != 200) {
          this.$message.error('获取信息失败')
        }
        this.menuList = result.data.data
        console.log(this.menuList)
      })
    },
    savePath(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activaPath = activePath
    }
  }
}
</script>
<style lang="less" scoped>
.home_container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    font-size: 20px;
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
  .iconfont {
    margin-right: 5px;
  }
}
</style>
