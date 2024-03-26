<template>
  <div class="UserActivity">
    <!-- 模态框 -->
    <el-dialog title="报名表" :visible.sync="dialogFormVisible" class="">
      <div>
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm frame"
          ><el-form-item label="活动名称" prop="actiname">
            <el-input
              v-model="ruleForm.actiname"
              type="text"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="活动名称" prop="actitype">
            <el-input
              v-model="ruleForm.actitype"
              type="text"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人" prop="firstname">
            <el-input v-model="ruleForm.firstname" type="text"></el-input>
          </el-form-item>
          <el-form-item label="报名时间" prop="applytime">
            <el-input
              v-model="ruleForm.applytime"
              type="text"
              :disabled="true"
            ></el-input> </el-form-item
          ><el-form-item label="联系手机" prop="uphoto">
            <el-input v-model="ruleForm.uphoto"></el-input>
          </el-form-item>
          <el-form-item
            label="紧急联系手机"
            prop="quikyphoto"
            label-width="120px"
          >
            <el-input v-model="ruleForm.quikyphoto"></el-input>
          </el-form-item>
          <el-form-item label="参加原因" prop="applyintro">
            <el-input v-model="ruleForm.applyintro" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >报名</el-button
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
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.actiname.toLowerCase().includes(search.toLowerCase()) ||
              data.organizer.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <!-- 表头 -->
        <el-table-column label="活动id" width="70" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.activityid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动名称" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actiname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="组织者" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.organizer }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actitype }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动介绍" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.actiintro.slice(0, 30) + `...`
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动内容" width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.acticontent.slice(0, 70) + `...`
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动时间" width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actitime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动场地" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actispace }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人数" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actipeo }}</span>
          </template>
        </el-table-column>

        <el-table-column label="活动图片" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.actiimage"
                fit="contain"
                slot="error"
                class="image-slot"
              >
              </el-image
            ></span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="right" fixed="right" width="180">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="initpage(scope.row.activityid, scope.row.actid)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="
                dialogFormVisible = true
                handleapply(scope.row.activityid, scope.row)
              "
              :disabled="scope.row.actstates == true"
              >报名</el-button
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
        :page-sizes="[5, 10, 15, 35]"
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
      // 表单
      ruleForm: {
        actiname: '',
        actitype:'',
        firstname: '',
        applyintro: '',
        applytime: '',
        uphoto: '',
        quikyphoto: '',
        checkreply: '',
        checkstate: '未审核',
        checked: '未通过',
        checks: false,
        actstates: null,
      },
      rules: {
        firstname: [
          { required: true, message: '请输入紧急联系人', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur',
          },
        ],
        uphoto: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (
                /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i.test(
                  value
                ) == false
              ) {
                callback(new Error('请输入正确手机号'))
              } else {
                //校验通过
                callback()
              }
            },
            trigger: 'blur',
          },
          {
            min: 11,
            message: '长度在 11个字符',
            trigger: 'blur',
          },
        ],
        quikyphoto: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (
                /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i.test(
                  value
                ) == false
              ) {
                callback(new Error('请输入正确手机号'))
              } else {
                //校验通过
                callback()
              }
            },
            trigger: 'blur',
          },
          {
            min: 11,
            message: '长度在 11个字符',
            trigger: 'blur',
          },
        ],
        applyintro: [
          { required: true, message: '请输入报名原因', trigger: 'blur' },
        ],
      },
      newapply: null,
      disable: false,
    }
  },
  methods: {
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
          this.CreatApply()

          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 初始化
    async initActivity() {
      await this.axios({
        method: `get`,
        url: `/foo/uctivity/uctive`,
      }).then(({ data }) => {
        let ids = Array()
        const idsss = Array()
        data.data.filter((item) => {
          ids.push(item.activityid)
        })
        // 调用希尔排序
        this.xier(ids)
        ids.filter((ids) => {
          let auid = data.data.filter((item) => {
            if (item.activityid == ids) {
              return item
            }
          })
          idsss.push(...auid)
        })
        this.tableData = idsss
        this.getTabelData()
      })
    },
    // 希尔排序
    xier(arr) {
      var interval = parseInt(arr.length / 2) //分组间隔设置
      while (interval > 0) {
        for (var i = 0; i < arr.length; i++) {
          var n = i
          while (arr[n] < arr[n - interval] && n > 0) {
            var temp = arr[n]
            arr[n] = arr[n - interval]
            arr[n - interval] = temp
            n = n - interval
          }
        }
        interval = parseInt(interval / 2)
      }
      return arr
    },
    // 获取对应详情页id,并且跳转
    initpage(id, actid) {
      this.$router.push({
        name: 'UserActpage',
        params: { id: id, actid: actid },
      })
    },

    // 报名获取对应id和数据
    async handleapply(id, row) {
      this.newapply = {
        activityid: id,
        uid: this.userinfo.uid,
        username: this.userinfo.username,
        name: this.userinfo.name,
        sex: this.userinfo.sex,
        uphoto: this.userinfo.uphoto,
        uemail: this.userinfo.uemail,
        actid: row.actid,
        actiname: row.actiname,
        actitime: row.actitime,
        organizer: row.organizer,
      }
      this.ruleForm.actiname = row.actiname
      this.ruleForm.actitype = row.actitype
      await this.axios({
        method: 'patch',
        url: `/foo/uctivity/uctive`,
        data: { actstates: row.actstates, activityid: id },
      })
    },
    // 提交数据
    async CreatApply() {
      await this.axios({
        method: 'post',
        url: `/foo/adactiapply/adactiapply`,
        data: { ...this.newapply, ...this.ruleForm },
      }).then(({ data }) => {
        if (data.state == 0) {
          alert('已成功报名')
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
    ...mapState('user', ['userinfo']),
  },
  created() {
    this.initActivity()
    this.ruleForm.applytime = this.moment(new Date()).format(
      'YYYY年MM月DD日 HH:mm'
    )
    
  },
  mounted() {},
  updated() {},
}
</script>
<style lang="less" scoped>
/deep/.el-table .el-table__cell {
  text-align: center;
}
// 布局
.UserActivity {
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
    float: left;
    margin-left: 0px !important;
  }
  //  日期宽度
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 400px;
  }
}
</style>
