<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns_info">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 校验规则
      loginRules: {
        username: [
          { required: true, message: '请输入有效的用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3到10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入有效的密码', trigger: 'blur' },
          { min: 4, max: 15, message: '密码长度在4到15之间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置表单方法
    resetLogin() {
      this.$refs.loginRef.resetFields()
    },
    login() {
      // 表单的预验证
      this.$refs.loginRef.validate(vali => {
        // 如果false,失败
        if (!vali) {
          return
        }
        // 发送post请求
        this.$http.post('/login', this.loginForm).then(result => {
          //console.log(result)
          if (result.data.meta.status == 200) {
            // console.log("登录成功");
            // 弹框提示
            this.$message.success('登录成功')
            window.sessionStorage.setItem('token', result.data.data.token)
            this.$router.push('/home')
          } else {
            // console.log("登录失败");
            this.$message.error('登录失败')
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;

  .login_box {
    width: 450px;
    height: 300px;
    position: absolute;
    background-color: #fff;
    left: 50%;
    top: 50%;
    border-radius: 3px;
    transform: translate(-50%, -50%);

    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid gray;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      background-color: #fff;
      left: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .login_form {
      bottom: 0;
      position: absolute;
      width: 100%;
      padding: 0 10px;
      //弹性盒子
      box-sizing: border-box;

      .btns_info {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
