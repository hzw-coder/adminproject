<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="openAddCateDialog" type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :show-index="true"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        border
      >
        <!-- 有效 -->
        <template slot="isok" slot-scope="scope">
          <i style="color:lightgreen;" v-if="scope.row.cat_deleted==false" class="el-icon-success"></i>
          <i style="color:red;" v-else class="el-icon-error"></i>
        </template>
        <!-- 等级 -->
        <template slot="level" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            size="mini"
            @click="showEditCate(scope.row.cat_id)"
            type="primary"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteCate(scope.row.cat_id)"
            icon="el-icon-delete"
          >删除</el-button>
        </template>
      </tree-table>
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
    <!-- 添加对话框 -->
    <el-dialog
      @close="closeAddCateDialog"
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <el-form
        ref="addCateFormRef"
        :rules="addCateFormRules"
        :model="addCateForm"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            style="width:100%;"
            clearable
            v-model="selectedKey"
            :options="parentCate"
            :props="cascaderPro"
            @change="cascaderHandleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹框 -->
    <el-dialog @close="closeEditCateDialog" title="修改分类" :visible.sync="editCatedialog" width="50%">
      <el-form :rules="editCateRules" ref="editCateRef" :model="editCate" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCate.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCatedialog = false">取 消</el-button>
        <el-button type="primary" @click="editCateMethod">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'cate',
  created() {
    this.getCateList()
  },
  data() {
    return {
      //分类列表
      cateList: [],
      //请求参数
      params: {
        type: 3,
        //当前页码值
        pagenum: 1,
        //每页条数
        pagesize: 5
      },
      //总数
      total: 0,
      //列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '等级',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      //添加框的控制
      addCateDialogVisible: false,
      //编辑框控制
      editCatedialog: false,
      editCate: {},
      //   添加分类
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      //添加校验
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      //修改验证
      editCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCate: [],
      cascaderPro: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectedKey: []
    }
  },
  methods: {
    //获取分类列表
    getCateList() {
      this.$http.get('/categories', { params: this.params }).then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败')
        }
        this.cateList = result.data.data.result
        this.total = result.data.data.total
      })
    },
    handleSizeChange(newSize) {
      this.params.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum) {
      this.params.pagenum = newNum
      this.getCateList()
    },
    openAddCateDialog() {
      this.getParentCate()
      this.addCateDialogVisible = true
    },
    //获取父级分类
    getParentCate() {
      this.$http.get('/categories', { params: { type: 2 } }).then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败')
        }
        //console.log('aaa')
        this.parentCate = result.data.data
      })
    },
    cascaderHandleChange() {
      //console.log(this.selectedKey)
      if (this.selectedKey.length > 0) {
        this.addCateForm.cat_pid = this.selectedKey[this.selectedKey.length - 1]
        this.addCateForm.cat_level = this.selectedKey.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    //关闭添加框
    closeAddCateDialog() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKey = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(vali => {
        if (!vali) {
          return
        }
        //发送请求
        this.$http.post('/categories', this.addCateForm).then(result => {
          if (result.data.meta.status != 201) {
            return this.$message.error('添加分类失败!!!')
          }
          //添加成功
          this.$message.success('添加分类成功')
          //关闭弹出框
          this.addCateDialogVisible = false
          //刷新列表
          this.getCateList()
        })
      })
    },
    //关闭编辑框
    closeEditCateDialog() {
      this.$refs.editCateRef.resetFields()
    },
    //打开编辑框
    showEditCate(id) {
      this.editCatedialog = true
      this.$http.get('/categories/' + id).then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败')
        }
        this.editCate = result.data.data
      })
    },
    //修改
    editCateMethod() {
      //预验证
      this.$refs.editCateRef.validate(vali => {
        if (!vali) {
          return
        }
        //发送请求
        this.$http
          .put('/categories/' + this.editCate.cat_id, {
            cat_name: this.editCate.cat_name
          })
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('更新失败!!!')
            }
            //更新成功
            this.editCatedialog = false
            this.getCateList()
            this.$message.success('更新成功')
          })
      })
    },
    //删除分类
    deleteCate(id) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(result => {
          //console.log(result)
          //发送请求
          this.$http.delete('categories/' + id).then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('删除失败!!!')
            }
            //刷新数据
            this.getCateList()
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
.el-row {
  margin-bottom: 10px;
}
</style>
