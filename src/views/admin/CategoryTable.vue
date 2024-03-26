<template>
  <div class="AdActype">
    <!--头部 -->
    <div class="same-head">
      <el-button
        @click="
          dialogFormVisible = true
          value1 = false
          value2 = true
        "
        >新增</el-button
      >
      <el-button @click="deleteSelectItem">删除</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog title="商品分类" :visible.sync="dialogFormVisible" class="">
      <div>
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm frame"
        >
          <el-form-item label="商品类型" prop="product_category">
            <el-input v-model="ruleForm.product_category" class="inputStyle">
              <template slot="prefix">
                {{ ruleForm.product_category }}
              </template></el-input
            >
          </el-form-item>
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
              data.actiname.toLowerCase().includes(search.toLowerCase()) ||
              data.username.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 表头 -->
        <el-table-column label="类型id" width="70" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.category_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品类型" width="500">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.product_category }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true
                value2 = false
                value1 = true
                Edit(scope.row.category_id)
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.category_id)"
              @size-change="handleSizeChange"
              >删除</el-button
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
      pagesize: 10, //每页显示多少行数据 默认设置为10
      alldata: [], //分页后的当前页数据
      // 模态框
      dialogTableVisible: false,
      dialogFormVisible: false,
      labelPosition: 'right',
      // 选择器
      options: [],
      // 表单
      ruleForm: {
        product_category: '',
      },
      rules: {
        product_category: [
          { required: true, message: '请输入商品类型', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2到 50 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    // 获取编辑id存储在表单中
    Edit(id) {
      this.Adminid = id
      this.axios({
        method: 'get',
        url: `/foo/type/actypeid/${id}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    // 编辑
    handleEdit(id) {
      this.axios({
        method: 'patch',
        url: `/foo/type/actypeupdata`,
        data: { ...this.ruleForm, category_id: id },
      }).then(({ data }) => {
        if (data.state == 0) {
          this.resetForm('ruleForm')
          // 数据编辑后刷新页面
          this.$nextTick(() => {
            this.getactype()
          })
        }
      })
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
          url: `/foo/type/detype/`,
          data: { category_id: id },
        }).then(({ data }) => {
          console.log(data)
        })
        // 数据更新后刷新页面
        this.$nextTick(() => {
          this.getactype()
        })
        alert('已删除')
      }
    },
    // 选择删除
    AllDelete(id) {
      this.axios({
        method: 'delete',
        url: `/foo/type/detype/`,
        data: { category_id: id },
      }).then(() => {
        this.getactype()
      })
    },
    deleteSelectItem() {
      if (confirm('确认删除数据吗？')) {
        this.multipleSelection.forEach((value) => {
          //遍历多选框获取的数据
          this.alldata.forEach((v) => {
            //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
            if (value.category_id == v.category_id) {
              this.AllDelete(v.category_id)
            }
          })
        })
        alert('已删除')
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
            this.setupactype()
            this.dialogFormVisible = false
          } else {
            this.handleEdit(this.Adminid)
            this.dialogFormVisible = false
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
    // 初始数据获取当前管理员的活动信息数据
    getactype() {
      this.axios({
        method: 'get',
        url: `/foo/type/actypeida/${this.admin.Adminid}`,
      }).then(({ data }) => {
        this.tableData = data.data
        this.getTabelData()
      })
    },
    // 添加到活动信息库中
    Addactype() {
      this.axios({
        method: `post`,
        url: `/foo/type/actype`,
        data: { ...this.ruleForm, Adminid: this.admin.Adminid },
      }).then(() => {
        this.getactype()
      })
    },
    // 判断标题
    Ifactype(actype, userInfoList) {
      let flag = false
      for (const key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          if (userInfo.product_category === actype) {
            flag = true
            break
          }
        }
      }
      return flag
    },
    // 获取当前管理员数据后添加活动信息
    async setupactype() {
      await this.axios({
        method: 'get',
        url: `/foo/type/actypeida/${this.admin.Adminid}`,
      }).then(({ data }) => {
        let flag = this.Ifactype(this.ruleForm.product_category, data.data)
        if (flag) {
          alert('该活动已存在，请重新输入')
        } else {
          this.Addactype(this.ruleForm)
          this.getactype()
          alert('添加成功！')
          this.resetForm('ruleForm')
        }
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
    ...mapState('admin', ['admin']),
  },
  created() {},
  mounted() {
    this.getactype()
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
.AdActype {
  width: 62%;
  margin: 0 auto;
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
}
/deep/.el-dialog {
  width: 30%;
  margin-top: 2% !important;
}
/deep/.el-form-item__label {
  width: 91px !important;
}
</style>
