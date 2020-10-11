<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialog=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['botclass',index1==0?'topclass':'','rowcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  :class="[index2==0?'':'topclass','rowcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRight(scope.row,item3.id)"
                      type="warning"
                      :key="item3.id"
                      v-for="(item3) in item2.children"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button @click="showEditRole(scope.row.id)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" @click="openRights(scope.row)" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog @close="closeRightsDia" title="分配权限" :visible.sync="rightsDialog" width="50%">
      <el-tree
        show-checkbox
        ref="rightsRef"
        node-key="id"
        default-expand-all
        :default-checked-keys="treeArr"
        :data="rightsTree"
        :props="treeProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog @close="resetAddRole" title="添加角色" :visible.sync="addDialog" width="50%">
      <el-form ref="addRoleRef" :rules="addRoleRules" :model="addRole" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色对话框 -->
    <el-dialog @close="closeEditDialog" title="修改角色" :visible.sync="editRoledialog" width="50%">
      <el-form :rules="editRoleRules" ref="editRoleRef" :model="editRole" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledialog = false">取 消</el-button>
        <el-button type="primary" @click="editRoleMethod">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'roles',
  created() {
    this.getRolesList()
  },
  data() {
    return {
      //添加角色
      addRole: {
        roleName: '',
        roleDesc: ''
      },
      //添加校验
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名长度在3到10之间', trigger: 'blur' }
        ]
      },
      //修改角色
      editRole: {},
      //修改验证
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '角色名长度在3到10之间', trigger: 'blur' }
        ]
      },
      rolesList: [],
      //控制分配权限对话框的显示隐藏
      rightsDialog: false,
      //控制添加角色对话框
      addDialog: false,
      //控制编辑对话框
      editRoledialog: false,
      //树形权限
      rightsTree: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      treeArr: [],
      rightId: ''
    }
  },
  methods: {
    //获取角色列表
    getRolesList() {
      this.$http.get('/roles').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取角色失败!!')
        }
        this.rolesList = result.data.data
      })
    },
    //删除权限
    removeRight(role, id) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(result => {
          console.log(result)
          //发送请求
          this.$http.delete(`/roles/${role.id}/rights/${id}`).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除失败!!!')
            }
            //刷新数据
            role.children = result.data.data
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    //打开分配权限对话框
    openRights(role) {
      //获取当前id
      this.rightId = role.id
      //发送请求
      this.$http.get('/rights/tree').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('请求数据失败')
        }
        this.rightsTree = result.data.data
      })
      this.getThiedRirhts(role, this.treeArr)
      this.rightsDialog = true
    },
    //获取所有的三级权限
    getThiedRirhts(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      //遍历
      node.children.forEach(item => {
        return this.getThiedRirhts(item, arr)
      })
    },
    closeRightsDia() {
      this.treeArr = []
    },
    //提交权限
    commitRights() {
      const idArr = [
        ...this.$refs.rightsRef.getHalfCheckedKeys(),
        ...this.$refs.rightsRef.getCheckedKeys()
      ]
      const idStr = idArr.join(',')

      //发送请求
      this.$http
        .post(`/roles/${this.rightId}/rights`, { rids: idStr })
        .then(result => {
          if (result.data.meta.status != 200) {
            return this.$message.error('分配权限失败!!!')
          }
          //成功
          this.rightsDialog = false
          this.getRolesList()
          this.$message.success('分配权限成功')
        })
    },
    //关闭添加对话框
    resetAddRole() {
      //重置
      this.$refs.addRoleRef.resetFields()
    },
    //提交添加角色
    addRoles() {
      //预校验
      this.$refs.addRoleRef.validate(vali => {
        if (!vali) {
          return
        }
        //发送请求
        this.$http.post('/roles', this.addRole).then(result => {
          if (result.data.meta.status != 201) {
            return this.$message.error('添加角色失败!!!')
          }
          //添加成功
          this.$message.success('添加角色成功')
          //关闭弹出框
          this.addDialog = false
          //刷新列表
          this.getRolesList()
        })
      })
    },
    //打开编辑框
    showEditRole(id) {
      //发送请求
      this.$http.get('/roles/' + id).then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('查询失败!!')
        }
        this.editRole = result.data.data
        //console.log(this.editRole)
      })
      this.editRoledialog = true
    },
    //关闭修改对话框
    closeEditDialog() {
      this.$refs.editRoleRef.resetFields()
    },
    //修改提交
    editRoleMethod() {
      //预验证
      this.$refs.editRoleRef.validate(vali => {
        if (!vali) {
          return
        }
        //发送请求
        this.$http
          .put('/roles/' + this.editRole.roleId, {
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc
          })
          .then(result => {
            if (result.data.meta.status != 200) {
              console.log(result.data)
              return this.$message.error('更新失败!!!')
            }
            //更新成功
            this.editRoledialog = false
            this.getRolesList()
            this.$message.success('更新成功')
          })
      })
    },
    //删除角色
    deleteRole(id) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(result => {
          console.log(result)
          //发送请求
          this.$http.delete('/roles/' + id).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除失败!!!')
            }
            //刷新数据
            this.getRolesList()
            this.$message.success('删除成功')
          })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>
<style lang="less" scoped>
.botclass {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.topclass {
  border-top: 1px solid #eee;
}
.rowcenter {
  display: flex;
  align-items: center;
}
</style>
