<template>
  <div class="content">
    <!--头部 -->
    <div class="same-head">
      <!-- <el-button
        @click="
          dialogFormVisible = true
          value1 = false
          value2 = true
        "
        ><i class="el-icon-circle-plus-outline">新增</i></el-button
      > -->
      <el-button @click="deleteSelectItem"
        ><i class="el-icon-delete">删除</i></el-button
      >
      <el-select
        v-model="ruleForm.audit_status"
        filterable
        placeholder="请选择审核类型"
        style="margin-left: 10px"
        @change="getcategory($event)"
      >
        <el-option
          v-for="item in status"
          :key="item.id"
          :label="item.audit_status"
          :value="item.audit_status"
        >
        </el-option>
      </el-select>
      <el-tooltip content="重置刷新" placement="top">
        <el-button @click="getactivity"
          ><i class="el-icon-loading"></i
        ></el-button>
      </el-tooltip>
    </div>
    <!-- 模态框 -->
    <el-dialog title="商品信息" :visible.sync="dialogFormVisible" class="">
      <div>
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          :inline="true"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm frame"
        >
          <el-form-item label="商品名称" prop="product_name">
            <el-select
              v-model="ruleForm.product_name"
              filterable
              :disabled="true"
              value-key="id"
              default-first-option
              class="inputStyle"
              ><template slot="prefix">
                {{ ruleForm.product_name }}
              </template>
              <el-option
                v-for="item in nameoptions"
                :key="item.productid"
                :value="item.product_name"
              ></el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="audit_status">
            <el-select
              v-model="ruleForm.audit_status"
              filterable
              allow-create
              value-key="id"
              default-first-option
              class="inputStyle"
              ><template slot="prefix">
                {{ ruleForm.audit_status }}
              </template>
              <el-option
                v-for="item in status"
                :key="item.id"
                :value="item.audit_status"
              >
              </el-option
            ></el-select>
          </el-form-item>
          <el-form-item label="订单类型" prop="order_type">
            <el-radio-group v-model="ruleForm.order_type">
              <el-radio
                label="采购订单"
                border
                style="margin-right: 0px"
              ></el-radio>
              <el-radio label="销售订单" border></el-radio> </el-radio-group
          ></el-form-item>
          <el-form-item
            label="销售单价"
            prop="sales_price"
            class="autowidth-sel"
          >
            <el-input-number
              v-model="ruleForm.sales_price"
              @change="handleChange"
              :disabled="true"
              :min="1"
              :max="10000"
              size="large"
              label="描述文字"
              width="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="供货数量"
            prop="supply_quantity"
            class="autowidth-sel"
          >
            <el-input-number
              v-model="ruleForm.supply_quantity"
              @change="handleChange"
              :disabled="true"
              :min="1"
              :max="10000"
              size="large"
              label="描述文字"
              width="100"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="进货日期" prop="sale_time">
            <div class="block">
              <el-date-picker
                v-model="ruleForm.sale_time"
                :disabled="true"
                type="datetime"
                value-format="yyyy年MM月dd日 HH:mm"
                placeholder="选择日期时间"
                size="small"
              >
              </el-date-picker></div
          ></el-form-item>
          <el-form-item label="审核日期" prop="audit_time">
            <div class="block">
              <el-date-picker
                v-model="date"
                :disabled="true"
                type="datetime"
                value-format="yyyy年MM月dd日 HH:mm"
                placeholder="选择日期时间"
                size="small"
              >
              </el-date-picker></div
          ></el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :disabled="value1"
              >立即创建</el-button
            >
            <el-button
              type="primary"
              :disabled="value2"
              @click="submitForm('ruleForm')"
              >编辑</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <div class="same-tabl">
      <el-table
        class="tableClass"
        max-height="730"
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.product_name.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 表头 -->
        <el-table-column label="销售单号" width="90" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sales_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.product_name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="销售单价" width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.sales_price + `元/` + scope.row.unit
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="供货数量(个)" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.supply_quantity + scope.row.unit
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总金额（元）" width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.supply_quantity + '元'
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="审核状态" width="160">
          <template slot-scope="scope">
            <h4 style="margin-left: 10px; color: rgb(40, 117, 211)">
              {{ scope.row.audit_status }}
            </h4>
          </template>
        </el-table-column>
        <el-table-column label="审核人" width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.auditor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="进货日期" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sale_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单类型" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.order_type }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" fixed="right" width="300">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入商品名搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="scope.row.actstates == true"
              @click="init(scope.row)"
              ><i class="el-icon-edit">调拨</i></el-button
            >
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true
                value2 = false
                value1 = true
                Edit(scope.row.sales_id)
              "
              ><i class="el-icon-edit">审核确认</i></el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.sales_id)"
              @size-change="handleSizeChange"
              ><i class="el-icon-delete">删除</i></el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部 -->
    <div class="pag_title">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentpage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
export default {
  data() {
    // 表单
    return {
      // 实时时间
      date: '',
      // 计数
      count: 0,
      // 数据id
      actid: 1,
      // 新增编辑
      value1: true,
      value2: true,
      // 高度
      tableHeight: '730',
      // 数据
      tableData: [],
      search: '',
      multipleSelection: [{}],
      // 分页数据
      total: 0, //总条数
      currentpage: 1, //当前所在页默认是第一页
      pagesize: 5, //每页显示多少行数据 默认设置为10
      alldata: [], //分页后的当前页数据
      // 模态框
      dialogTableVisible: false,
      dialogFormVisible: false,
      labelPosition: 'right',
      // 选择器
      options: [],
      // product_name选择器以及商品id
      nameoptions: [],
      //审核状态
      status: [
        { id: 1, audit_status: '审核通过' },
        { id: 2, audit_status: '审核未通过' },
      ],
      // 表单
      ruleForm: {
        /*  */
        actstates: false,
        product_name: [],
        sales_price: '',
        supply_quantity: '',
        // Sales_total: '',
        sale_time: '',
        audit_status: [],
        order_type: '',
      },
      // Sales_total: 0,
      rules: {
        product_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 1到 50 个字符',
            trigger: 'blur',
          },
        ],

        creation_time: [
          {
            required: true,
            message: '请输入采购时间',
            trigger: 'change',
          },
        ],
      },
    }
  },
  methods: {
    // 调拨
    async init(row) {
      await this.axios({
        method: 'get',
        url: `/foo/active/activityid/${row.productid}`,
      }).then(({ data }) => {
        this.axios({
          method: 'patch',
          url: `/foo/active/activitupdata`,
          data: {
            Inventory:
              Number(data.data.Inventory) - Number(row.supply_quantity) <= 0
                ? 0
                : Number(data.data.Inventory) - Number(row.supply_quantity),

            current_quantity:
              Number(data.data.current_quantity) + Number(row.supply_quantity),
            productid: row.productid,
          },
        })
      })
      await this.axios({
        method: 'get',
        url: `/foo/Inventory/inventoryname/${row.product_name}`,
      }).then(({ data }) => {
        this.axios({
          method: 'patch',
          url: `/foo/Inventory/activitupdatas`,
          data: {
            Inventory:
              Number(data.data.Inventory) - Number(row.supply_quantity) <= 0
                ? 0
                : Number(data.data.Inventory) - Number(row.supply_quantity),

            current_quantity:
              Number(data.data.current_quantity) + Number(row.supply_quantity),
            current_status:
              Number(data.data.Inventory) - Number(row.supply_quantity) > 0
                ? '正常'
                : '亏空',
            inventory_total:
              Number(data.data.sales_price) *
              (Number(data.data.Inventory) - Number(row.supply_quantity)),
            creation_times: `${this.moment(+new Date()).format(
              'YYYY年MM月DD日 HH:mm:ss'
            )}`,
            product_name: row.product_name,
          },
        })
        this.axios({
          method: 'patch',
          url: `/foo/sale/activitupdata`,
          data: {
            actstates: true,
            sales_id:row.sales_id,
          },
        }).then(({data}) => { console.log(data);
          this.getactivity()
          alert('已经送往便利店')
        })
      })
    },
    //change事件
    handleChange(value) {
      console.log(value)
    },
    // 审核
    shenghe(row) {
      if (row.audit_status === '审核通过') {
        alert('审核已完成')
      } else if (row.audit_status === '审核未通过') {
        alert('审核已完成')
      } else {
        this.axios({
          method: 'patch',
          url: `/foo/sale/activitupdata`,
          data: { audit_status: '审核中', sales_id: row.sales_id },
        }).then(() => {
          this.getactivity()
          alert('已送往审核')
        })
      }
    },
    // 发布
    async Activitypost(row) {
      // 发布给对应用户？？？？？？
      if (row.actstates == false || confirm('确认发布该活动吗？')) {
        await this.axios({
          method: 'patch',
          url: `/foo/active/activitupdata`,
          data: { actstates: true, activityid: row.activityid },
        }).then(() => {
          this.$nextTick(() => {
            this.axios({
              method: 'post',
              url: `/foo/uctivity/uctive`,
              data: {
                ...row,
                activityid: row.activityid,
                actstates: false,
                activitytime: this.moment(+new Date()).format(
                  'YYYY年MM月DD日 HH:mm'
                ),
              },
            }).then(({ data }) => {
              this.getactivity()
              if (data.state == 0) alert('发布成功')
            })
          })
        })
      }
    },

    // 获取编辑id存储在表单中
    Edit(id) {
      this.actid = id
      this.axios({
        method: 'get',
        url: `/foo/sale/activityid/${id}`,
      }).then(({ data }) => {
        console.log(data)
        this.ruleForm = data.data
      })
    },
    // 编辑
    handleEdit(id) {
      this.axios({
        method: 'patch',
        url: `/foo/sale/activitupdata`,
        data: {
          ...this.ruleForm,
          audit_time: this.moment(+new Date()).format('YYYY年MM月DD日 HH:mm'),
          Sales_total: this.Sales_total,
          sales_id: id,
          auditor: this.userinfo.Wname,
        },
      }).then(({ data }) => {
        if (data.state == 0) {
          alert('更新成功')
          // 数据编辑后刷新页面
          this.getactivity()
        }
      })
      this.resetForm('ruleForm')
    },
    // 全选功能键
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 单个删除
    handleDelete(id) {
      if (confirm('确认删除该条数据吗？')) {
        this.axios({
          method: 'delete',
          url: `/foo/sale/actives`,
          data: { sales_id: id },
        }).then(({ data }) => {})
        // 数据更新后刷新页面
        this.$nextTick(() => {
          this.getactivity()
        })
        alert('已删除')
      }
    },
    // 选择删除
    AllDelete(id) {
      this.axios({
        method: 'delete',
        url: `/foo/sale/actives`,
        data: { sales_id: id },
      }).then(() => {
        this.getactivity()
      })
    },
    deleteSelectItem() {
      if (confirm('确认删除数据吗？')) {
        this.multipleSelection.forEach((value) => {
          //遍历多选框获取的数据
          this.alldata.forEach((v) => {
            //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
            if (value.sales_id == v.sales_id) {
              this.AllDelete(v.sales_id)
            }
          })
        })
        alert('已删除')
        this.getactivity()
      }
    },
    // 分页
    //获取当前页的数据
    getTabelData() {
      // 方法1
      let data = JSON.parse(JSON.stringify(this.tableData))
      this.alldata = data
        .reverse()
        .splice((this.currentpage - 1) * this.pagesize, this.pagesize)
      this.total = this.tableData.length
    },
    // currentPage  页数改变时会触发
    handleCurrentChange(vals) {
      this.currentpage = vals
      this.getTabelData()
    },
    // pageSize 每页条数改变时会触发
    handleSizeChange(val) {
      this.pagesize = val
      this.currentpage = 1
      this.getTabelData()
    },
    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.value1) {
            this.setupActivity()
            this.dialogFormVisible = false
          } else {
            this.handleEdit(this.actid)
            this.dialogFormVisible = false
            this.resetForm(formName)
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    // 初始数据商品名称
    getcommodity() {
      this.axios({
        method: 'get',
        url: `/foo/sale/purchase`,
      }).then(({ data }) => {
        if (data.state == 0) {
          this.nameoptions = data.data
        }
      })
    },
    //  根据分类显示商品
    getcategory(values) {
      this.axios({
        method: 'get',
        url: `/foo/sale/categorys/${values}`,
      }).then(({ data }) => {
        if (data.state == 0) {
          this.tableData = data.data
          this.getTabelData()
        } else {
          this.tableData = []
          this.getTabelData()
        }
      })
    },
    // 获取商品类型
    getoptions() {
      this.axios({
        method: 'get',
        url: `/foo/type/actypeida/${this.admin.Adminid}`,
      }).then(({ data }) => {
        this.options = data.data
      })
    },
    // 初始数据获取当前管理员的信息数据
    getactivity() {
      this.axios({
        method: 'get',
        url: `/foo/sale/actives`,
      }).then(({ data }) => {
        if (data.state == 0) {
          this.tableData = data.data
          this.getTabelData()
          // this.PatchAdmin(this.admin.actid, data.data)
        }
      })
    },
    // 添加到活动信息库中
    AddActivity() {
      this.axios({
        method: 'get',
        url: `/foo/sale/purchase/${this.ruleForm.product_name}`,
      }).then(({ data }) => {
        this.axios({
          method: `post`,
          url: `/foo/sale/actives`,
          data: {
            ...this.ruleForm,
            productid: data.data.productid,
            Sales_total: this.Sales_total,
            creation_time: this.moment(new Date()).format(
              'YYYY年MM月DD日 HH:mm'
            ),
            Emid: this.Employees.Emid,
          },
        }).then(({ data }) => {
          console.log(data)
          this.getactivity()
          this.resetForm('ruleForm')
          alert('添加成功！')
        })
      })
    },
    // 判断标题
    IfActivity(actiname, userInfoList) {
      let flag = false
      for (const key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          if (userInfo.product_name === actiname) {
            flag = true
            break
          }
        }
      }
      return flag
    },
    // 获取当前管理员数据后添加活动信息
    async setupActivity() {
      await this.axios({
        method: 'get',
        url: `/foo/sale/actives/${this.Employees.Emid}`,
      }).then(({ data }) => {
        let flag = this.IfActivity(this.ruleForm.product_name, data.data)
        if (flag) {
          alert('该商品已存在，请重新输入')
        } else {
          this.AddActivity()
        }
      })
    },
    // 添加到对应管理员并且上传到vuex
    PatchAdmin(id, value) {
      this.axios({
        method: `patch`,
        url: `/api/admin/${id}`,
        data: { Activity: value },
      }).then(({ data }) => {
        this.$store.commit('admin/SET_COMPANY_AUTH_INFO', data)
      })
    },
  },
  watch: {
    total() {
      //注意这个函数的名字必须和你监听data中的属性的名字一样，这样才能当你data中的属性发生变化时，触发这个函数
      if (
        this.total == (this.currentPage - 1) * this.pageSize &&
        this.total != 0
      ) {
        //这一行是关键代码，倍数关系
        this.currentPage -= 1
        this.getTabelData() //获取表格数据的方法
      }
    },
  },
  computed: {
    ...mapState('Employees', ['Employees']),
    ...mapState('user', ['userinfo']),
    Sales_total() {
      return this.ruleForm.sales_price * this.ruleForm.supply_quantity
    },
  },
  watch: {},
  created() {
    this.date = this.moment(+new Date()).format('YYYY年MM月DD日 HH:mm')
    this.getcommodity()
  },
  mounted() {
    this.getactivity()
  },
  updated() {},
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
}
</script>
<style lang="less" scoped>
/deep/.el-table .el-table__cell {
  text-align: center;
}
// 布局
.content {
  height: auto;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  .same-table {
    height: calc(100% - 55px);
    position: relative;
  }
  .pag_title {
    // position: fixed;
    bottom: 0px;
    width: 100%;
    text-align: left;
  }
  // 增加按钮布局
  .same-head {
    text-align: left;
  }
  // 分页
  .el-pagination {
    padding: 0 0;
  }
}
// 模态框
.motaikuan {
  width: 50% !important;
}
// 表单

.el-form-item {
  /deep/.el-input {
    width: auto;
  }
  /* 文本框宽度自适应 */
  /deep/.inputStyle {
    // margin-top: 30px;
    text-align: start; // 这里一样要设置，否则不是对齐的居中状态
    min-width: 400px; //这里给一个最小宽度

    .el-input__prefix {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      padding: 0 30px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      padding-left: 30px;
      left: 0;
      visibility: hidden;
    }
    .el-input__inner {
      position: absolute;
    }
  }

  /deep/.el-switch__input {
    width: 100%;
    min-width: none;
  }
  // 日期
  /deep/.el-col-11 {
    width: 30%;
  }
  // 文本域
  /deep/.el-textarea__inner {
    width: 100%;
  }

  /deep/ .el-form-item__content {
    // float: left;
    margin-left: 0px !important;
  }
  //  日期宽度
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 190px;
  }
}
#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
}
#toolbar-container {
  touch-action: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
}
#editor-container {
  height: 310px;
  position: relative;
}
/deep/.el-dialog {
  width: 44%;
  margin: 10% 30% !important;
}
/deep/.el-form-item__label {
  width: 91px !important;
}
</style>
