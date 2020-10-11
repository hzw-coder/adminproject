<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-alert :closable="false" center title="添加商品信息" type="info" show-icon></el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        ref="addformRef"
        label-position="top"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
      >
        <el-tabs
          :before-leave="beforeLeave"
          @tab-click="tabClick"
          v-model="activeIndex"
          :tab-position="'left'"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                clearable
                v-model="addForm.goods_cat"
                :options="goodsCateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="it" :key="index" v-for="(it,index) in item.attr_vals"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" :key="index" v-for="(item,index) in onlyData">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button style="margin-top:15px;" type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="提示" :visible.sync="pictureVisible" width="50%">
      <img :src="previewPath" alt style="width:100%;" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'

export default {
  name: 'addgood',
  created() {
    this.getGoodsCate()
  },
  data() {
    return {
      activeIndex: '0',
      //动态参数
      manyData: [],
      pictureVisible: false,
      previewPath: '',
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //静态属性
      onlyData: [],
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //分类列表
      goodsCateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      //添加校验
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    catId() {
      return this.addForm.goods_cat[2]
    }
  },
  methods: {
    //获取商品分类
    getGoodsCate() {
      this.$http.get('/categories').then(result => {
        if (result.data.meta.status != 200) {
          return this.$message.error('获取失败!!!')
        }
        this.goodsCateList = result.data.data
      })
    },
    handleChange() {
      console.log('a', this.addForm.goods_cat)
    },
    beforeLeave(activeName, oldActiveName) {
      if (this.addForm.goods_cat.length != 3) {
        return false
      }
    },
    //标签页切换事件
    tabClick() {
      if (this.activeIndex == '1') {
        //获取参数
        this.$http
          .get(`/categories/${this.catId}/attributes`, {
            params: {
              sel: 'many'
            }
          })
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('获取失败!!!')
            }
            result.data.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
            })
            this.manyData = result.data.data
          })
      } else if (this.activeIndex == '2') {
        //获取属性
        this.$http
          .get(`/categories/${this.catId}/attributes`, {
            params: {
              sel: 'only'
            }
          })
          .then(result => {
            if (result.data.meta.status != 200) {
              return this.$message.error('获取失败!!!')
            }

            this.onlyData = result.data.data
          })
      }
    },
    //图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.pictureVisible = true
    },
    //移除图片
    handleRemove(file) {
      //找到路径
      let filePath = file.response.data.tmp_path
      //找到索引
      let index = this.addForm.pics.findIndex(item => {
        return item.pic == filePath
      })
      //移除
      this.addForm.pics.splice(index, 1)
    },
    //上传成功
    handleSuccess(response) {
      let picInfo = {
        pic: response.data.tmp_path
      }
      this.addForm.pics.push(picInfo)
    },
    //添加
    add() {
      this.$refs.addformRef.validate(vali => {
        if (!vali) {
          return this.$message.error('请正确填写!!')
        }
        let form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        //处理参数和属性
        this.manyData.forEach(item => {
          let newData = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newData)
        })
        this.onlyData.forEach(item => {
          let newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        //发起请求
        this.$http.post('/goods', form).then(result => {
          console.log(result)
          if (result.data.meta.status != 201) {
            return this.$message.error('添加商品失败!!')
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
