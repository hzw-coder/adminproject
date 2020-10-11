<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert show-icon :closable="false" title="只允许为第三级分类设置相关参数!" type="warning"></el-alert>
      <el-row class="cat_row">
        <el-col>
          <span style="margin-right:10px;">选择商品分类:</span>
          <el-cascader
            clearable
            v-model="selectedCateKeys"
            :options="catelist"
            :props="catePro"
            @change="cateHandleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button size="mini" @click="addVisible=true" :disabled="isdisabled" type="primary">添加参数</el-button>
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClose(index,scope.row)"
                  closable
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                >{{item}}</el-tag>
                <!-- 文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="openEditDia(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button size="mini" @click="addVisible=true" :disabled="isdisabled" type="primary">添加属性</el-button>
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  @close="handleClose(index,scope.row)"
                  closable
                  :key="index"
                  v-for="(item,index) in scope.row.attr_vals"
                >{{item}}</el-tag>
                <!-- 文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  @click="openEditDia(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  type="danger"
                  @click="removeParams(scope.row.attr_id)"
                  size="mini"
                  icon="el-icon-delete"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog @close="closeAddDia" :title="'添加'+dialogText" :visible.sync="addVisible" width="50%">
      <el-form ref="addformRef" :rules="addFormRules" :model="addform" label-width="80px">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamsMethod">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      @close="closeEditDia"
      :title="'修改'+dialogText"
      :visible.sync="editVisible"
      width="50%"
    >
      <el-form ref="editformRef" :rules="editFormRules" :model="editform" label-width="80px">
        <el-form-item :label="dialogText" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsMethod">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Params',
  created() {
    this.getcatelist()
  },
  data() {
    return {
      //分类列表
      catelist: [],
      //动态参数列表
      manyData: [],
      //静态参数列表
      onlyData: [],
      catePro: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //添加参数
      addform: {
        attr_name: ''
      },
      //修改参数
      editform: {},
      //控制添加的显示
      addVisible: false,
      //修改显示
      editVisible: false,
      selectedCateKeys: [],
      activeName: 'many',
      //添加验证
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      //修改验证
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //获得分类列表
    getcatelist() {
      this.$http.get('/categories').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败')
        }
        this.catelist = result.data.data
      })
    },
    cateHandleChange() {
      this.getParamsData()
    },
    handleTabClick() {
      this.getParamsData()
    },
    //获取参数列表
    getParamsData() {
      if (this.selectedCateKeys.length != 3) {
        this.selectedCateKeys = []
        this.manyData = []
        this.onlyData = []
        return false
      } else {
        //获取参数列表
        this.$http
          .get(`/categories/${this.cateId}/attributes`, {
            params: {
              sel: this.activeName
            }
          })
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('获取失败')
            }
            result.data.data.forEach(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              item.inputVisible = false
              item.inputValue = ''
            })
            if (this.activeName == 'many') {
              this.manyData = result.data.data
            } else {
              this.onlyData = result.data.data
            }
          })
      }
    },
    //关闭添加框
    closeAddDia() {
      //重置
      this.$refs.addformRef.resetFields()
    },
    //添加
    addParamsMethod() {
      this.$refs.addformRef.validate(vali => {
        if (!vali) {
          return false
        }
        //发送请求
        this.$http
          .post(`/categories/${this.cateId}/attributes`, {
            attr_name: this.addform.attr_name,
            attr_sel: this.activeName
          })
          .then(result => {
            if (result.data.meta.status != 201) {
              return this.$message.error('请求失败')
            }
            this.$message.success('添加成功')
            this.addVisible = false
            //刷新
            this.getParamsData()
          })
      })
    },
    //打开修改
    openEditDia(id) {
      this.editVisible = true
      //查询单个信息
      this.$http
        .get(`/categories/${this.cateId}/attributes/${id}`, {
          params: { attr_sel: this.activeName }
        })
        .then(result => {
          if (result.data.meta.status != 200) {
            return this.$message.error('请求失败!!!')
          }
          this.editform = result.data.data
        })
    },
    //提交修改
    editParamsMethod() {
      //预校验
      this.$refs.editformRef.validate(vali => {
        if (!vali) {
          return false
        }
        //发送请求
        this.$http
          .put(
            `/categories/${this.cateId}/attributes/${this.editform.attr_id}`,
            {
              attr_name: this.editform.attr_name,
              attr_sel: this.activeName
            }
          )
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('修改失败!!!')
            }
            this.$message.success('修改成功')
            this.editVisible = false
            this.getParamsData()
          })
      })
    },
    //关闭修改框
    closeEditDia() {
      this.$refs.editformRef.resetFields()
    },
    //删除参数
    removeParams(id) {
      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(result => {
          console.log(result)
          //发送请求
          this.$http
            .delete(`/categories/${this.cateId}/attributes/${id}`)
            .then(res => {
              if (res.data.meta.status != 200) {
                return this.$message.error('删除失败!!!')
              }
              //刷新数据
              this.getParamsData()
              this.$message.success('删除成功')
            })
        })
        .catch(() => {
          this.$message.info('已取消删除')
        })
    },
    //文本框事件
    handleInputConfirm(row) {
      if (row.inputValue.trim().length == 0) {
        row.inputValue = ''
        row.inputVisible = false
        return false
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    saveAttrVals(row) {
      //发送请求
      this.$http
        .put(`/categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        .then(result => {
          if (result.data.meta.status != 200) {
            return this.$message.error('更新失败!!!')
          }
          this.$message.success('更新成功')
        })
    },
    showInput(row) {
      row.inputVisible = true
      //文本框聚焦
      this.$nextTick(_ => {
        //当页面元素重新渲染后才执行回调
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose(index, row) {
      row.attr_vals.splice(index, 1)
      //保存
      this.saveAttrVals(row)
    }
  },
  computed: {
    isdisabled() {
      if (this.selectedCateKeys.length != 3) {
        return true
      } else {
        return false
      }
    },
    cateId() {
      if (this.selectedCateKeys.length == 3) {
        return this.selectedCateKeys[2]
      } else {
        return null
      }
    },
    dialogText() {
      if (this.activeName == 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cat_row {
  margin: 10px 0;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>
