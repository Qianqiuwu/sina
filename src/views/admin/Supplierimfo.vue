<template>
  <div class="AdVolunteer">
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
    <el-dialog title="个人信息" :visible.sync="dialogFormVisible" class="">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户" prop="supusername">
            <el-input v-model="ruleForm.supusername"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="suppassword">
            <el-input
              v-model="ruleForm.suppassword"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="supname">
            <el-input v-model="ruleForm.supname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="supnumber">
            <el-input v-model="ruleForm.supnumber"></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="supaddress">
            <el-input v-model="ruleForm.supaddress"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="supimageUrl">
            <el-upload
              class="avatar-uploader"
              action=""
              :auto-upload="false"
              drag
              show-file-list
              :on-change="getFile"
              :before-upload="beforeAvatarUpload"
              list-type="picture"
              :limit="1"
            >
              <i class="el-icon-plus"></i>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png/jpeg文件，且不超过500kb
              </div>
            </el-upload>
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
    <div class="same-tabl" ref="tableContainer">
      <el-table
        class="tableClass"
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.supusername.toLowerCase().includes(search.toLowerCase())
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
            <span style="margin-left: 10px">{{ scope.row.supusername }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.suppassword }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.supname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.supaddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.supnumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-image
                style="width: 100px; height: 100px; border-radius: 20px"
                :src="scope.row.supimageUrl"
                fit="contain"
                slot="error"
                class="image-slot"
              >
              </el-image
            ></span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true
                value2 = false
                value1 = true
                Edit(scope.row.supid)
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.supid)"
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
        :page-size="5"
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
      actid: 1,
      // 高度
      tableHeight: 730, // Null或者先给个默认的大小
      timer: 0,
      value1: true,
      value2: true,
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
      // 注册表单
      ruleForm: {
        supusername: '',
        suppassword: '',
        supname: '',
        supnumber: '',
        supaddress: '',
        supimageUrl: '',
      },
      rules: {
        // 验证用户名是否合法
        // 验证用户名是否合法
        supusername: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur',
          },
        ],
        // 验证用户名是否合法
        suppassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        supname: [
          {
            required: true,
            message: '请输入姓名',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 50,
            message: '长度在 2 到 50 个字符',
            trigger: 'blur',
          },
        ],
        supnumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (
                /^(13[0-9]|14[0-9]|15[0-9]|16[6]|18[0-9]|19[6,9]|17[0-9])\d{8}$/i.test(
                  value
                ) == false
              ) {
                callback(new Error('请输入手机号'))
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

        supimageUrl: [
          { required: false, message: '请上传图片', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 编辑
    // 获取编辑id存储在表单中
    Edit(id) {
      this.actid = id
      this.axios({
        method: 'get',
        url: `/foo/Supplier/admins/${id}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    // 编辑
    handleEdit(id) {
      this.axios({
        method: 'patch',
        url: `/foo/Supplier/admines`,
        data: {
          ...this.ruleForm,
        supid: id,
        },
      }).then(({ data }) => {
        if (data.state == 0) {
          alert('更新成功')
          // 数据编辑后刷新页面
          this.gettable()
        }
      })
    },
    // 注册
    async setup() {
      await this.axios({
        method: 'post',
        url: '/foo/Supplier/regusera',
        data: { ...this.ruleForm, rolue: `user` },
      }).then(({ data }) => {
        if (data.state == 0) {
          alert('新增成功！')
          this.gettable()
        } else alert('用户名重复')
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.value1) {
            this.setup()
            this.dialogFormVisible = false
          } else {
            this.handleEdit(this.actid)
            this.dialogFormVisible = false
          }
        } else {
          return false
        }
      })
    },
    // 单个删除数据库的数据
    handleDelete(id) {
      console.log(id)
      this.axios({
        method: 'delete',
        url: `/foo/Supplier/admines`,
        data: { supid: id },
      })
      // 数据更新后刷新页面
      this.$nextTick(() => {
        this.gettable()
        alert('已删除')
      })
    },
    // 选择删除功能
    deleteSelectItem() {
      this.multipleSelection.forEach((value) => {
        //遍历多选框获取的数据
        this.alldata.forEach((v) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.supid == v.supid) {
            this.handleDelete(v.supid)
          }
        })
      })
    },
    // 全选键
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    // 分页功能
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
      this.$nextTick(() => {
        this.gettable()
      })
    },
    // pageSize 每页条数改变时会触发
    handleSizeChange(val) {
      this.pagesize = val
      this.currentpage = 1
      this.getTabelData()
      this.$nextTick(() => {
        this.gettable()
      })
    },
    // 初始数据获取
    async gettable() {
      await this.axios({
        method: 'get',
        url: `/foo/Supplier/admins`,
      }).then((res) => {
        this.tableData = res.data.data
        this.getTabelData()
      })
    },
    // 根据父元素高度改变表格高度
    calHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置
        const rect = this.$refs.tableContainer.getBoundingClientRect()
        // this.tableHeight = rect.height - 24  // 若有分页，减去分页高度
        this.tableHeight = rect.height
      })
    },
    // 监听界面resize调calHeight更新表格高度
    onResize() {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.calHeight()
      }, 100)
    }, // 头像上传base64格式
    getFile(file) {
      const formdata = new FormData()
      formdata.append('files', file.raw)
      this.axios({
        method: `post`,
        url: `/foo/Supplier/upload`,
        data: formdata,
      }).then(({ data }) => {
        this.ruleForm.supimageUrl = data
      })
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    // 图片格式
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片格式错误!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
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
  created() {},
  mounted() {
    this.gettable()
    this.calHeight()
    window.addEventListener('resize', this.onResize)
  },
  updated() {},
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
    window.removeEventListener('resize', this.onResize)
  },
}
</script>
<style lang="less" scoped>
.el-table .el-table__cell {
  text-align: center !important;
}
/deep/ .el-table th.el-table__cell > .cell {
  width: 45%;
}
// 布局
.AdVolunteer {
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

  /deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
/deep/ .el-upload-dragger {
  width: 66px;
  height: 40px;
}
/deep/.el-dialog {
  width: 35%;
}
</style>
