<template>
  <div class="AdActinform">
    <!--头部 -->
    <div class="same-head">
      <el-button @click="ApplydeleteSelectItem">删除</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog title="通知信息" :visible.sync="dialogFormVisible" class="">
      <div>
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm frame"
        >
          <el-form-item label="活动名称" prop="actiname">
            <el-input v-model="ruleForm.actiname"></el-input>
          </el-form-item>
          <el-form-item label="活动时间" prop="actitime">
            <el-input v-model="ruleForm.actitime"></el-input> </el-form-item
          ><el-form-item label="用户名" prop="Username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name"></el-input> </el-form-item
          ><el-form-item label="手机" prop="uphoto">
            <el-input v-model="ruleForm.uphoto"></el-input> </el-form-item
          ><el-form-item label="通知" prop="informcontent">
            <el-input
              v-model="ruleForm.informcontent"
            ></el-input> </el-form-item
          ><el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >创建</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <div class="same-tabl">
      <el-table
        class="tableClass"
        max-height="630"
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
        <el-table-column label="通知id" width="80" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.informid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actiname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actitime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.uphoto }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核结果" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.checked }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通知" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.informcontent }}</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column align="right" fixed="right" width="300">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" size="mini" placeholder="输入活动搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="applypost(scope.row)"
              :disabled="scope.row.state == true"
              >发布</el-button
            >
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true
                applyEdit(scope.row.informid)
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="applyidDelete(scope.row.informid)"
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
        :page-sizes="[10, 20, 30, 40]"
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
export default {
  data() {
    // 表单
    return {
      // 高度
      tableHeight: '690',
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
      // 表单
      ruleForm: {
        actiname: '',
        actitime: '',
        username: '',
        name: '',
        uphoto: '',
        informcontent: '',
        state: true,
      },
      rules: {
        informcontent: [
          { required: true, message: '请输入通知内容', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '长度在 10 到 50 个字符',
            trigger: 'blur',
          },
        ],
        actiname: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur',
          },
        ],
        actitime: [
          { required: true, message: '请输入时间', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur',
          },
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur',
          },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur',
          },
        ],
      },
      applyid: 0,
    }
  },
  methods: {
    // 发布
    async applypost(row) {
      if (row.informcontent && row.informcontent != '') {
        await this.axios({
          method: 'patch',
          url: `/foo/actinform/actinform`,
          data: { state: true, informid: row.informid },
        }).then(() => {
          this.getActinform()
          this.axios({
            method: 'get',
            url: `/foo/active/activityid/${row.activityid}`,
          }).then((res) => {
            if (res.data.state == 0) {
              this.axios({
                method: 'post',
                url: `/foo/actinform/uctinform`,
                data: {
                  actid: row.actid,
                  activityid: row.activityid,
                  informid: row.informid,
                  uid: row.uid,
                  username: row.username,
                  uphoto: row.uphoto,
                  inforname: `${row.actiname}活动通知`,
                },
              }).then(({ data }) => {
                console.log(data)
              })
              this.axios({
                method: 'post',
                url: `/foo/actinform/uctinforms`,
                data: {
                  uid: row.uid,
                  admin: this.admin.username,
                  name: row.name,
                  informcontent: row.informcontent,
                  infodatetime: this.moment(+new Date()).format(
                    'YYYY年MM月DD日 HH:mm'
                  ),
                  actiname: row.actiname,
                  actispace: res.data.data.actispace,
                  checked: row.checked,
                  actitime: row.actitime,
                  checks: row.checks,
                  organizer: row.organizer,
                },
              }).then(({ data }) => {
                console.log(data)
              })
            }
          })
        })
      } else alert('需要有通知内容方可发送')
    },
    // 获取编辑id
    applyEdit(id) {
      this.applyid = id
      this.axios({
        method: 'get',
        url: `/foo/actinform/actinform/${id}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    // 编辑
    handleEdit(id) {
      this.axios({
        method: 'patch',
        url: `/foo/actinform/actinform`,
        data: { ...this.ruleForm, informid: id },
      }).then(({ data }) => {
        console.log(data)
      })
      // 数据编辑后刷新页面
      this.$nextTick(() => {
        this.getActinform()
        this.resetForm('ruleForm')
      })
    },
    // 全选功能键
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 单个删除
    applyidDelete(id) {
      if (confirm('确认删除该条数据吗？')) {
        this.axios({
          method: 'delete',
          url: `/foo/actinform/deleinform`,
          data: { informid: id },
        })
        // 数据更新后刷新页面
        this.$nextTick(() => {
          this.getActinform()
        })
        alert('已删除')
      }
    },
    // 选择删除
    ApplyidAllDelete(id) {
      this.axios({
        method: 'delete',
        url: `/foo/actinform/deleinform`,
        data: { informid: id },
      })
      // 数据更新后刷新页面
      this.$nextTick(() => {
        this.getActinform()
      })
    },
    ApplydeleteSelectItem() {
      if (confirm('确认删除数据吗？')) {
        this.multipleSelection.forEach((value) => {
          //遍历多选框获取的数据
          this.alldata.forEach((v) => {
            //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
            if (value.informid == v.informid) {
              this.ApplyidAllDelete(v.informid)
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
          this.handleEdit(this.applyid)
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 初始数据获取当前管理员的活动信息数据 Actinform
    getActinform() {
      this.axios({
        method: 'get',
        url: `/foo/actinform/getactinform/${this.admin.actid}`,
      }).then(({ data }) => {
        this.tableData = data.data
        this.getTabelData()
      })
    },
  },
  computed: {
    ...mapState('admin', ['admin']),
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
    this.getActinform()
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
.AdActinform {
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
/deep/.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
