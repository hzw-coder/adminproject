import Vue from 'vue'
import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  Header,
  Aside,
  Main,
  Container,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Select,
  Option,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Upload,
  TimelineItem,
  Timeline
} from 'element-ui'

Vue.use(TimelineItem)
Vue.use(Timeline)
Vue.use(Steps)
Vue.use(Upload)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Step)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Button)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
//全局挂载
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
