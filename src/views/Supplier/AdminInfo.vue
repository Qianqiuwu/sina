<template>
  <div class="admininfo">
    <div class="from">
      <!-- 表单 -->
      <el-dialog
        title="个人信息"
        :visible.sync="dialogFormVisible"
        class="dialog"
      >
        <div>
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户" prop="supusername">
              <el-input
                v-model="ruleForm.supusername"
                :placeholder="admins.supusername"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="suppassword">
              <el-input v-model="ruleForm.suppassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="supname">
              <el-input
                v-model="ruleForm.supname"
                :placeholder="admins.supname"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="supnumber">
              <el-input
                v-model="ruleForm.supnumber"
                :placeholder="admins.supnumber"
              ></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="supaddress">
              <el-input
                v-model="ruleForm.supaddress"
                :placeholder="admins.supaddress"
              ></el-input>
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
              <el-button type="primary" @click="submitForm('ruleForm')"
                >立即创建</el-button
              >
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm frame"
      >
        <el-form-item label="用户" prop="supusername">
          <h4>: {{ admins.supusername }}</h4>
        </el-form-item>
        <el-form-item label="密码" prop="suppassword">
          <h4>: {{ admins.suppassword }}</h4></el-form-item
        >
        <el-form-item label="姓名" prop="supname">
          <h4>: {{ admins.supname }}</h4></el-form-item
        >
        <el-form-item label="手机号" prop="supnumber">
          <h4>: {{ admins.supnumber }}</h4></el-form-item
        >
        <el-form-item label="地址" prop="supaddress">
          <h4>: {{ admins.supaddress }}</h4></el-form-item
        >
        <el-form-item label="头像" prop="supimageUrl">
          <img width="auto" :src="admins.supimageUrl" class="avatar" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogFormVisible = true"
            >编辑</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    // 表单
    return {
      dialogFormVisible: false,
      // 表单
      ruleForm: {
        supusername: '',
        suppassword: '',
        supname: '',
        supnumber: '',
        supaddress: '',
        supimageUrl: '',
      },
      // 头像
      imageUrl: '',
      // 表单规则
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
      admins: {},
    }
  },
  methods: {
    async getshuju() {
      await this.axios({
        method: 'get',
        url: `/foo/Supplier/admins/${this.Supplier.supid}`,
      }).then(({ data }) => {
        this.admins = data.data
        this.$store.commit('Supplier/SET_COMPANY_AUTH_INFO', data.data)
        this.cadmin()
      })
    },
    cadmin() {
      this.axios({
        method: 'get',
        url: `/foo/Supplier/admins/${this.Supplier.supid}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    //验证id一致后修改
    async edit(id, list) {
      await this.axios({
        method: 'patch',
        url: `/foo/Supplier/admines`,
        data: {
          supid: id,
          supusername: list.supusername,
          suppassword: list.suppassword,
          supname: list.supname,
          supnumber: list.supnumber,
          supaddress: list.supaddress,
          supimageUrl: list.supimageUrl,
          rolue: 'user',
        },
      }).then(() => {
        this.dialogFormVisible = false
        this.getshuju()
      })
    },
    // 判断用户名和密码是否一致
    IfUserInfo(username, password, userInfoList) {
      let flag = false
      for (let key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          if (userInfo.supusername === username) {
            if (userInfo.suppassword === password) {
              alert('密码已存在，请重新输入')
              flag = true
              break
            } else break
          }
        }
      }
      return flag
    },
    // 获取数据
    async getedit() {
      await this.axios({
        method: 'get',
        url: '/foo/Supplier/admins',
      }).then((res) => {
        let flag = this.IfUserInfo(
          this.ruleForm.supusername,
          this.ruleForm.suppassword,
          res.data.data
        )
        if (this.ruleForm.suppassword == this.Supplier.suppassword) {
          alert('新密码和旧密码需不同')
        } else if (flag) {
          return false
        } else {
          this.edit(this.Supplier.supid, this.ruleForm)
          alert('更新成功')
        }
      })
    },
    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getedit()
          // this.edit(this.$store.state.user.userinfo.id, this.ruleForm)
          // console.log(this.ruleForm)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 头像上传base64格式
    getFile(file) {
      const formdata = new FormData()
      formdata.append('files', file.raw)
      this.axios({
        method: `post`,
        url: `/foo/Supplier/upload`,
        data: formdata,
      }).then(({ data }) => {
        console.log(data)
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
  computed: {
    // 返回本地用户数据
    ...mapState('Supplier', ['Supplier']),
  },
  watch: {},
  created() {
    this.getshuju()
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
.adminonfo {
  height: auto;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
}
// 表单
.from {
  width: 600px;
  background-color: #fff;
  margin: 0 auto;
  padding: 1%;
}
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
  /deep/ .el-upload-dragger {
    width: 66px;
    height: 40px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border-radius: 20px;
  }
}
/deep/ .el-input--suffix .el-input__inner {
  padding-right: 18px;
}
</style>
