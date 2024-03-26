<template>
  <div class="content">
    <!--头部 -->
    <div class="same-head">
      <el-button @click="dialogFormVisible = true">新增</el-button>
      <el-button @click="deleteSelectItem">删除</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible" class="">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm frame"
        >
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动时间" required>
            <el-col :span="11">
              <el-form-item prop="date1">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="ruleForm.date1"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="date2">
                <el-time-picker
                  placeholder="选择时间"
                  v-model="ruleForm.date2"
                  style="width: 100%"
                ></el-time-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="即时配送" prop="delivery">
            <el-switch v-model="ruleForm.delivery"></el-switch>
          </el-form-item>
          <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >立即创建</el-button
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
        max-height="600"
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.name.toLowerCase().includes(search.toLowerCase()) ||
              data.username.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 表头 -->
        <el-table-column label="用户名" width="160" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.password }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性名" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.sex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.uphoto }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.uemail }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.head }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="right">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, alldata)"
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
        :page-sizes="[7, 14, 28, 35]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 表单
    return {
      // 高度
      tableHeight: '100%',
      // 数据
      tableData: [
        {
          id: '1',
          username: 'q',
          password: '123123',
          name: 'hw',
          sex: '男',
          age: '12',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'staticlogo',
          done: 'false',
        },
        {
          id: '2',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '121',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '3',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '4',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '5',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '6',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '7',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '8',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '9',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '10',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '11',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
        {
          id: '12',
          username: 'quwegqiwue',
          password: '123123',
          name: 'hwj3131',
          sex: '男',
          age: '1211',
          uphoto: '12314123424123',
          uemail: '38123789@qq.com',
          head: 'png',
          done: 'false',
        },
      ],
      search: '',
      multipleSelection: [{}],
      // 分页数据
      total: 0, //总条数
      currentpage: 1, //当前所在页默认是第一页
      pagesize: 7, //每页显示多少行数据 默认设置为10
      alldata: [], //分页后的当前页数据
      // 模态框
      dialogTableVisible: false,
      dialogFormVisible: false,
      labelPosition: 'right',
      // 表单
      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        date2: [
          {
            type: 'date',
            required: true,
            message: '请选择时间',
            trigger: 'change',
          },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个活动性质',
            trigger: 'change',
          },
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' },
        ],
        desc: [{ required: true, message: '请填写活动形式', trigger: 'blur' }],
      },
    }
  },
  methods: {
    // 单个删除
    handleDelete(index, row) {
      row.splice(index, 1)
      // this.total = this.tableData.length
    },
    // 选择删除
    deleteSelectItem() {
      this.multipleSelection.forEach((value) => {
        //遍历多选框获取的数据
        this.alldata.forEach((v, i) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.id == v.id) {
            this.alldata.splice(i, 1)
          }
        })
      })
    },
    // 全选功能键
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 分页
    //获取当前页的数据
    getTabelData() {
      // 方法1
      let data = JSON.parse(JSON.stringify(this.tableData))
      this.alldata = data.splice(
        (this.currentpage - 1) * this.pagesize,
        this.pagesize
      )
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
          alert('submit!')
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
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
  created() {
    this.getTabelData()
  },
  mounted() {},
  updated() {},
}
</script>
<style lang="less" scoped>
.el-table .el-table__cell {
  text-align: center !important;
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
    width: 200%;
  }
  /deep/.el-switch__input {
    width: 100%;
  }
  // 日期
  /deep/.el-col-11 {
    width: 30%;
  }
  // 文本域
  /deep/.el-textarea__inner {
    width: 300%;
  }

  /deep/ .el-form-item__content {
    float: left;
    margin-left: 0px !important;
  }
}
</style>
