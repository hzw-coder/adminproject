<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input v-model="paramsInfo.query" placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 表格区域 -->
    <el-table :data="usersList" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip effect="dark" content="修改用户" placement="top" :enterable="false">
            <el-button
              @click="showEdit(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
            <el-button
              @click="deleteUser(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </el-tooltip>
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button
              @click="openRoles(scope.row)"
              type="warning"
              icon="el-icon-setting"
              size="mini"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsInfo.pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="paramsInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加弹出对话框 -->
    <el-dialog @close="closeDialog" title="添加用户" :visible.sync="dialogVisible" width="50%">
      <el-form ref="addformRef" :rules="addFormRules" :model="addForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改弹出对话框 -->
    <el-dialog @close="closeEditDialog" title="修改用户" :visible.sync="editdialog" width="50%">
      <el-form :rules="editFormRules" ref="editformRef" :model="editForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog @close="resetRole" title="分配角色" :visible.sync="setRolesDialog" width="50%">
      <div>
        <p>当前用户名为:{{Role.username}}</p>
        <p>当前角色为:{{Role.role_name}}</p>
        <p>
          分配新角色:
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
              v-for="item in currentRole"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Users',
  created() {
    this.getUserList()
  },
  data() {
    //邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const email = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (email.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱'))
    }
    //手机号码验证规则
    var checkMobile = (rule, value, callback) => {
      const mobile = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      if (mobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      paramsInfo: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示的数量
        pagesize: 5
      },
      usersList: [],
      total: 0,
      //控制添加对话框的显示隐藏
      dialogVisible: false,
      //修改对话框的显示影藏
      editdialog: false,
      //添加用户
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //修改用户
      editForm: {},
      //添加验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在3到10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 15, message: '密码长度在4到15之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //修改验证
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //控制分配角色对话框
      setRolesDialog: false,
      //当前用户
      Role: {},
      //所有角色
      currentRole: [],
      //选中的
      selectValue: ''
    }
  },
  methods: {
    //   获取用户列表
    getUserList() {
      this.$http.get('/users', { params: this.paramsInfo }).then(result => {
        console.log(result.data)
        this.usersList = result.data.data.users
        this.total = result.data.data.total
      })
    },
    // 每页数量的改变
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize
      this.getUserList()
    },
    // 当前页码值的改变
    handleCurrentChange(newPage) {
      this.paramsInfo.pagenum = newPage
      this.getUserList()
    },
    //修改状态
    changeState(info) {
      //console.log(info)
      //发送请求
      this.$http
        .put(`/users/${info.id}/state/${info.mg_state}`)
        .then(result => {
          //console.log(result)
          if (result.data.meta.status != 200) {
            info.mg_state = !info.mg_state
            return this.$message.error('状态修改失败!')
          }
          this.$message.success('状态修改成功')
        })
    },
    //关闭添加表单
    closeDialog() {
      //重置表单
      this.$refs.addformRef.resetFields()
    },
    //关闭修改表单
    closeEditDialog() {
      this.$refs.editformRef.resetFields()
    },
    //添加用户
    addUsers() {
      //预校验
      this.$refs.addformRef.validate(vali => {
        if (!vali) {
          return
        }
        //发送请求
        this.$http.post('/users', this.addForm).then(result => {
          if (result.data.meta.status != 201) {
            return this.$message.error('添加用户失败!!!')
          }
          //添加成功
          this.$message.success('添加用户成功')
          //关闭弹出框
          this.dialogVisible = false
          //刷新列表
          this.getUserList()
        })
      })
    },
    //显示修改对话框
    showEdit(id) {
      //发送请求
      this.$http.get('/users/' + id).then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('查询失败!!')
        }
        this.editForm = result.data.data
      })
      this.editdialog = true
    },
    //修改
    editUser() {
      //预验证
      this.$refs.editformRef.validate(vali => {
        if (!vali) {
          return
        }
        //发送请求
        this.$http
          .put('/users/' + this.editForm.id, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          })
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('更新失败!!!')
            }
            //更新成功
            this.editdialog = false
            this.getUserList()
            this.$message.success('更新成功')
          })
      })
    },
    //删除
    deleteUser(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(result => {
          console.log(result)
          //发送请求
          this.$http.delete('/users/' + id).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除失败!!!')
            }
            //刷新数据
            this.getUserList()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    //打开分配角色框
    openRoles(role) {
      this.setRolesDialog = true
      //获取当前的用户
      this.Role = role
      //获取该用户的角色信息
      this.$http.get('/roles').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取角色信息失败')
        }
        this.currentRole = result.data.data
        //console.log('---' + this.currentRole)
      })
    },
    //提交分配角色
    commitRole() {
      //是否选择新角色
      if (!this.selectValue) {
        return this.$message.error('请选择新角色')
      }
      //发送请求
      this.$http
        .put(`/users/${this.Role.id}/role`, { rid: this.selectValue })
        .then(result => {
          if (result.data.meta.status != 200) {
            return this.$message.error('分配角色失败')
          }
          //成功
          this.$message.success('分配角色成功')
          this.setRolesDialog = false
          //刷新列表
          this.getUserList()
        })
    },
    //重置
    resetRole() {
      this.selectValue = ''
      this.currentRole = []
    }
  }
}
</script>
<style scoped>
</style>
