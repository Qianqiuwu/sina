<template>
  <div class="UserVolunteer">
    <div class="from">
      <!-- 表单 -->
      <el-dialog title="个人信息" :visible.sync="dialogFormVisible" class="">
        <div>
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户" prop="Wusername">
              <el-input
                v-model="ruleForm.Wusername"
                :placeholder="user.Wusername"
              ></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="Wpassword">
              <el-input
                v-model="ruleForm.Wpassword"
                show-password
              ></el-input> </el-form-item
            ><el-form-item label="姓名" prop="Wname">
              <el-input
                :placeholder="user.Wname"
                v-model="ruleForm.Wname"
                clearable
              ></el-input> </el-form-item
            ><el-form-item label="性别" prop="Wsex">
              <el-radio-group v-model="ruleForm.Wsex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio> </el-radio-group></el-form-item
            ><el-form-item label="手机" prop="Wcell">
              <el-input v-model="ruleForm.Wcell"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="WimageUrl">
              <el-upload
                class="avatar-uploader"
                action=""
                drag
                :auto-upload="false"
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
        <el-form-item label="用户" prop="Wusername">
          <h4>: {{ user.Wusername }}</h4>
        </el-form-item>
        <el-form-item label="密码" prop="Wpassword">
          <h4>: {{ user.Wpassword }}</h4></el-form-item
        ><el-form-item label="姓名" prop="Wname">
          <h4>: {{ user.Wname }}</h4></el-form-item
        ><el-form-item label="性别" prop="Wsex">
          <h4>: {{ user.Wsex }}</h4></el-form-item
        ><el-form-item label="手机" prop="Wcell">
          <h4>: {{ user.Wcell }}</h4>
        </el-form-item>
        <el-form-item label="头像" prop="WimageUrl">
          <img width="auto" :src="user.WimageUrl" class="avatar" />
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
        Wusername: '',
        Wpassword: '',
        Wname: '',
        Wsex: '',
        Wcell: '',
        WimageUrl: '',
      },
      // 头像
      imageUrl: '',
      imgs: '',
      // 表单规则
      rules: {
        // 验证用户名是否合法
        Wusername: [
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
        Wpassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      }, // 验证码
      inputCode: '', // 输入的值
      checkCode: '', // 图片验证码的值
      expressValue: '', // 表达式的值
      // canvas各种设置
      cvs: {
        w: 300, // 给出默认宽度  宽度会在图片绘制时根据长度更改
        h: 40, // 高 与input保持一致
        fontSize: 24, // 字体大小
        str: '+-*', // 符号生成范围
        line: 3, // 噪音线个数
      },
      // 注册规则
      rules: {
        // 验证用户名是否合法
        Wusername: [
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
        Wpassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        Wname: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              if (/^[\u4e00-\u9fa5]+$/.test(value) == false) {
                callback(new Error('请输入中文'))
              } else {
                //校验通过
                callback()
              }
            },
            message: '请输入正确姓名',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        Wcell: [
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
        WimageUrl: [
          { required: false, message: '请上传图片', trigger: 'blur' },
        ],
      },
      user: {},
    }
  },
  methods: {
    async getshuju() {
      await this.axios({
        method: 'get',
        url: `/foo/userinfo/userinfos/${this.userinfo.Wid}`,
      }).then((res) => {
        this.user = res.data.data
        this.$store.commit('user/SET_COMPANY_AUTH_INFO', res.data.data)
        this.Edithziyuanz()
      })
    },
    Edithziyuanz() {
      this.axios({
        method: 'get',
        url: `/foo/userinfo/userinfos/${this.userinfo.Wid}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    //验证id一致后修改
    async edit(id, list) {
      await this.axios({
        method: 'patch',
        url: `/foo/userinfo/userinfos`,
        data: {
          Wid: id,
          Wusername: list.Wusername,
          Wpassword: list.Wpassword,
          Wname: list.Wname,
          Wsex: list.Wsex,
          Wcell: list.Wcell,
          WimageUrl: list.WimageUrl,
          rolue: 'user',
        },
      }).then(() => {
        this.getshuju()
      })
    },
    // 判断用户名和密码是否一致
    IfUserInfo(username, password, userInfoList) {
      let flag = false
      for (let key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          if (userInfo.Wusername === username) {
            break
          } else if (userInfo.Wpassword === password) {
            flag = true
            alert('密码已存在，请重新输入')
            break
          }
        }
      }
      return flag
    },
    // 获取数据
    async getedit() {
      await this.axios({
        method: 'get',
        url: '/foo/userinfo/userinfo',
      }).then((res) => {
        let flag = this.IfUserInfo(
          this.ruleForm.Wusername,
          this.ruleForm.Wpassword,
          res.data.data
        )
        if (this.ruleForm.Wpassword == this.user.Wpassword) {
          alert('新密码和旧密码需不同')
        } else if (flag) {
          return false
        } else {
          this.edit(this.userinfo.Wid, this.ruleForm)
          console.log(this.ruleForm)
          alert('更新成功')
        }
      })
    },
    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getedit()
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
        url: `/foo/userinfo/upload`,
        data: formdata,
      }).then(({ data }) => {
        console.log(data)
        this.ruleForm.WimageUrl = data
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
    ...mapState('user', ['userinfo']),
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
.UserVolunteer {
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
  padding: 2%;
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
  /deep/.el-upload-dragger {
    height: 100%;
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
    border-radius: 20px;
  }
}
/deep/.el-dialog {
  margin-top: 2% !important;
}
/deep/ .el-input--suffix .el-input__inner {
  padding-right: 0px;
}
/deep/.el-dialog {
  width: 35%;
}
</style>
