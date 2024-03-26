<template>
  <div class="AdActiapply">
    <!--头部 -->
    <div class="same-head">
      <el-button @click="ApplydeleteSelectItem">删除</el-button>
      <el-button @click="statistics">统计页</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog title="活动报名信息" :visible.sync="dialogFormVisible" class="">
      <div>
        <!-- 表单 -->
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm frame"
        >
          <el-form-item label="活动名称" prop="actiname">
            <el-input
              v-model="ruleForm.actiname"
              :disabled="true"
            ></el-input> </el-form-item
          ><el-form-item label="用户名" prop="username"
            ><el-input
              v-model="ruleForm.username"
              type="text"
              :disabled="true"
            ></el-input> </el-form-item
          ><el-form-item label="报名说明" prop="applyintro">
            <el-input
              v-model="ruleForm.applyintro"
              :disabled="true"
            ></el-input> </el-form-item
          ><el-form-item label="紧急联系人" prop="firstname">
            <el-input
              v-model="ruleForm.firstname"
              type="text"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="报名时间" prop="applytime">
            <el-input
              v-model="ruleForm.applytime"
              type="text"
              :disabled="true"
            ></el-input> </el-form-item
          ><el-form-item label="联系手机" prop="uphoto">
            <el-input v-model="ruleForm.uphoto" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="紧急电话" prop="quikyphoto">
            <el-input v-model="ruleForm.quikyphoto" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="参加原因" prop="applyintro">
            <el-input
              v-model="ruleForm.applyintro"
              :disabled="true"
            ></el-input> </el-form-item
          ><el-form-item label="审核回复" prop="checkreply">
            <el-input
              v-model="ruleForm.checkreply"
              type="textarea"
              autosize
            ></el-input> </el-form-item
          ><el-form-item label="审核" prop="checks">
            <el-switch v-model="ruleForm.checks"></el-switch>
          </el-form-item>
          <el-form-item> </el-form-item> </el-form
        ><el-button type="primary" @click="submitForm('ruleForm')"
          >立即创建</el-button
        >
      </div>
    </el-dialog>
    <!-- 表格 -->
    <div class="same-tabl">
      <el-table
        align="center"
        class="tableClass"
        max-height="600"
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
        <el-table-column label="报名id" width="80" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actiname }}</span>
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
        <el-table-column label="报名说明" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyintro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报名时间" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applytime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actitime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.uphoto }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核回复" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.checkreply }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.checkstate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.checked }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column fixed="right" width="300" align="center">
          <template slot="header" slot-scope="{}">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入活动名搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="applypost(scope.row)"
              :disabled="scope.row.states == true"
              >发布</el-button
            >
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true
                applyEdit(scope.row.applyid)
              "
              >审核</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="applyidDelete(scope.row.applyid)"
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
      tableHeight: '620',
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
        username: '',
        applyintro: '',
        applytime: '',
        uphoto: '',
        checkreply: '',
        checkstate: '',
        checks: '',
        checked: '',
      },
      rules: {
        checkreply: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur',
          },
        ],
      },
      applyid: 0,
    }
  },
  methods: {
    // 统计
    statistics(){
      this.$router.push('/AdHome/AdActivitys')
    },
    // 发布
    async applypost(data) {
      // 发布给对应用户？？？？？？
      if (data.checkstate === '审核完成') {
        await this.axios({
          method: 'patch',
          url: `/foo/adactiapply/patchapply`,
          data: { states: true, applyid: data.applyid },
        }).then(() => {
          this.$nextTick(() => {
            this.axios({
              method: 'post',
              url: `/foo/actinform/informinto`,
              data: {
                actid: data.actid,
                activityid: data.activityid,
                uid: data.uid,
                username: data.username,
                name: data.name,
                uphoto: data.uphoto,
                actiname: data.actiname,
                checkreply: data.checkreply,
                checked: data.checked,
                actitime: data.actitime,
                checks: data.checks,
                organizer: data.organizer,
              },
            }).then(({ data }) => {
              this.getapply()
              if (data.state == 0) alert('发布成功')
            })
          })
        })
      } else alert('审核需要完成才可发布')
    },
    // 获取编辑id存储在表单中
    applyEdit(id) {
      this.applyid = id
      this.axios({
        method: 'get',
        url: `/foo/adactiapply/appid/${id}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    // 编辑
    async handleEdit(id) {
      this.checks()
      await this.axios({
        method: 'patch',
        url: `/foo/adactiapply/patchapply`,
        data: { ...this.ruleForm, applyid: id },
      }).then(() => {
        // 数据编辑后立即刷新页面
        this.getapply()
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
          url: `/foo/adactiapply/deldteapply`,
          data: { applyid: id },
        })
        // 数据更新后刷新页面
        this.$nextTick(() => {
          this.getapply()
        })
        alert('已删除')
      }
    },
    // 选择删除
    ApplyidAllDelete(id) {
      this.axios({
        method: 'delete',
        url: `/foo/adactiapply/deldteapply`,
        data: { applyid: id },
      })
      // 数据更新后刷新页面
      this.$nextTick(() => {
        this.getapply()
      })
    },
    ApplydeleteSelectItem() {
      if (confirm('确认删除数据吗？')) {
        this.multipleSelection.forEach((value) => {
          //遍历多选框获取的数据
          this.alldata.forEach((v) => {
            //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
            if (value.applyid == v.applyid) {
              this.ApplyidAllDelete(v.applyid)
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
    async getapply() {
      await this.axios({
        method: 'get',
        url: `/foo/adactiapply/apply/${this.admin.actid}`,
      }).then(({ data }) => {
        this.tableData = data.data
        this.getTabelData()
        // this.PatchAdmin(this.admin.actid, data)
      })
    },
    // 添加到对应管理员并且上传到vuex
    PatchAdmin(id, value) {
      this.axios({
        method: `patch`,
        url: `/api/admin/${id}`,
        data: { AdActiapply: value },
      }).then(({ data }) => {
        this.$store.commit('admin/SET_COMPANY_AUTH_INFO', data)
      })
    },
    checks() {
      if (this.ruleForm.checks) {
        this.ruleForm.checked = '通过'
        this.$nextTick(() => {
          this.ruleForm.checks = true
        })
        this.ruleForm.checkstate = '审核完成'
      } else {
        this.ruleForm.checked = '不通过'
        this.$nextTick(() => {
          this.ruleForm.checks = false
        })
        this.ruleForm.checkstate = '审核完成'
      }
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
    this.getapply()
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
.AdActiapply {
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
    width: 100%;
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
    width: 100%;
  }

  /deep/ .el-form-item__content {
    // float: left;
    margin-left: 0px !important;
  }
  .el-date-editor.el-input__inner {
    width: 100px;
  }
}
/deep/.el-form-item__label {
  width: 91px !important;
}
</style>
