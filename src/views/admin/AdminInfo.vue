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
            <el-form-item label="用户" prop="Adusername">
              <el-input
                v-model="ruleForm.Adusername"
                :placeholder="admins.Adusername"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="Adpassword">
              <el-input v-model="ruleForm.Adpassword" show-password></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="Adname">
              <el-input
                v-model="ruleForm.Adname"
                :placeholder="admins.Adname"
              ></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="Adcell">
              <el-input
                v-model="ruleForm.Adcell"
                :placeholder="admins.Adcell"
              ></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="Adsex">
              <el-radio-group v-model="ruleForm.Adsex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio> </el-radio-group
            ></el-form-item>
            <el-form-item label="头像" prop="Adimage">
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
        <el-form-item label="用户" prop="Adusername">
          <h4>: {{ admins.Adusername }}</h4>
        </el-form-item>
        <el-form-item label="密码" prop="Adpassword">
          <h4>: {{ admins.Adpassword }}</h4></el-form-item
        >
        <el-form-item label="姓名" prop="Adname">
          <h4>: {{ admins.Adname }}</h4></el-form-item
        >
        <el-form-item label="手机号" prop="Adcell">
          <h4>: {{ admins.Adcell }}</h4></el-form-item
        >
        <el-form-item label="性别" prop="Adsex">
          <h4>: {{ admins.Adsex }}</h4></el-form-item
        >
        <el-form-item label="头像" prop="Adimage">
          <img width="auto" :src="admins.Adimage" class="avatar" />
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
        Adusername: '',
        Adpassword: '',
        Adname: '',
        Adcell: '',
        Adsex: '',
        Adimage: '',
      },
      // 头像
      imageUrl: '',
      // 表单规则
      rules: {
        // 验证用户名是否合法
        Adusername: [
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
        // pattern 这个属性是正则表达式
        Adpassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        Adname: [
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
        Adcell: [
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
        Adimage: [{ required: false, message: '请上传图片', trigger: 'blur' }],
      },
      admins: {},
    }
  },
  methods: {
    async getshuju() {
      await this.axios({
        method: 'get',
        url: `/foo/admin/admins/${this.admin.Adminid}`,
      }).then(({ data }) => {
        this.admins = data.data
        this.$store.commit('admin/SET_COMPANY_AUTH_INFO', data.data)
        this.cadmin()
      })
    },
    cadmin() {
      this.axios({
        method: 'get',
        url: `/foo/admin/admins/${this.admin.Adminid}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    //验证id一致后修改
    async edit(id, list) {
      await this.axios({
        method: 'patch',
        url: `/foo/admin/admines`,
        data: {
          Adminid: id,
          Adusername: list.Adusername,
          Adpassword: list.Adpassword,
          Adname: list.Adname,
          Adcell: list.Adcell,
          Adsex: list.Adsex,
          Adimage: list.Adimage,
          rolue: 'admin',
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
          if (userInfo.Adusername === username) {
            if (userInfo.Adpassword === password) {
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
        url: '/foo/admin/admins',
      }).then((res) => {
        let flag = this.IfUserInfo(
          this.ruleForm.Adusername,
          this.ruleForm.Adpassword,
          res.data.data
        )
        if (this.ruleForm.Adpassword == this.admin.Adpassword) {
          alert('新密码和旧密码需不同')
        } else if (flag) {
          return false
        } else {
          this.edit(this.admin.Adminid, this.ruleForm)
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
        url: `/foo/admin/upload`,
        data: formdata,
      }).then(({ data }) => {
        console.log(data)
        this.ruleForm.Adimage = data
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
    ...mapState('admin', ['admin']),
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
/deep/.el-dialog {
  width: 35%;
}
</style>
