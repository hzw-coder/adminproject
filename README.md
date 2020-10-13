# adminproject
# 后台管理系统

## 架构
+ 前端: axios、Element-UI、vue-cli3、vue-router、vue
+ 后端: node、express
+ 数据库: MySQL

## 功能
+ 登录
+ 用户管理
  + 查看用户列表
  + 添加用户
  + 修改用户信息
  + 删除用户
  + 为用户分配角色
+ 权限管理
  + 角色列表(添加角色、修改角色、删除角色、分配权限)
  + 查看权限列表
+ 商品管理
  + 查看商品
  + 添加商品
  + 修改商品
+ 订单管理
  + 查看订单详情
  + 查看物流
+ 数据统计  
  + 查看数据报表

## 运行
### 服务端
+ 进入config中的default.json修改数据库的配置
+ npm install 
+ node app.js

### 客户端
+ npm install
+ npm run serve
