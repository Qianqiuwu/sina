<template>
  <div class="login_container">
    <el-dialog title="注册信息" :visible.sync="dialogFormVisibles" class="">
      <div>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户" prop="Wusername">
            <el-input v-model="ruleForm.Wusername"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="Wpassword">
            <el-input
              v-model="ruleForm.Wpassword"
              prefix-icon="el-icon-lock"
              show-password
            ></el-input> </el-form-item
          ><el-form-item label="姓名" prop="Wname">
            <el-input
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
              :auto-upload="false"
              drag
              show-file-list
              :on-change="getFile"
              :before-upload="beforeAvatarUpload"
              list-type="picture"
              :limit="1"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">
                只能上传jpg/png/jpeg文件，且不超过500kb
              </div>
              <!-- <img :src="ruleForm.imageUrl" alt="" /> -->
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
    <div class="login_box">
      <!-- 头像区域 -->
      <div>
        <i class="el-icon-back" style="font-size: 24px" @click="goBack"></i>
        <h1 style="text-align: center; margin: 4% 0">仓库管理员</h1>
      </div>
      <!-- 登录表单区域 -->
      <!-- model 数据绑定 ref 数据引用-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="Wusername">
          <el-input
            v-model="loginForm.Wusername"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="Wpassword">
          <el-input
            show-password
            type="password"
            v-model="loginForm.Wpassword"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <div id="canvas-input">
          <el-input
            class="canvas-input-class"
            size="large"
            type="text"
            v-model="inputCode"
            placeholder="请输入下方图案的值"
          />
          <canvas class="codeCanvas" ref="checkCode" @click="getCode"> </canvas>
        </div>
        <!-- 按钮区 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="dialogFormVisibles = true"
            >注册</el-button
          >
          <el-button type="primary" @click.stop="clickLogin">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { usertoken } from '@/server/config.js'
export default {
  data() {
    return {
      // 模态框
      dialogTableVisible: false,
      dialogFormVisibles: false,
      // 这是登录表单的数据绑定对象
      loginForm: {
        Wusername: '',
        Wpassword: '',
      },
      // 注册表单
      ruleForm: {
        Wusername: '',
        Wpassword: '',
        Wname: '',
        Wsex: '',
        Wcell: '',
        WimageUrl: '',
      },
      // 头像上传
      imgs: '',
      fileList: [],
      // 登录规则
      loginFormRules: {
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
    }
  },
  methods: {
    goBack() {
      this.$router.push('/ViHome/MyHome')
    },
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击重置按钮，重置注册表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 验证成功后注册函数
    async logins(use, pas, list) {
      await this.axios({
        method: 'post',
        url: '/api/user',
        data: {
          Wusername: use,
          Wpassword: pas,
          Wname: list.Wname,
          Wsex: list.Wsex,
          Wcell: list.Wcell,
          WimageUrl: list.WimageUrl,
          rolue: 'user',
        },
      })
    },
    // 获取账号密码
    findUserInfo(username, password, userInfoList) {
      let flag = false
      for (const key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          if (userInfo.Wusername === username) {
            flag = true
            break
          }
        }
      }
      return flag
    },
    // 注册1
    async setup() {
      await this.axios({
        method: 'post',
        url: '/foo/user/reguser',
        data: { ...this.ruleForm, rolue: `user` },
      }).then(({data}) => {
        if (data.state == 0) {
          alert('注册成功')
          this.dialogFormVisible = false
        } else alert('用户名重复')
      })
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.setup()
        } else {
          return false
        }
      })
    },
    // 验证登录账号密码
    UserInfo(username, password, userInfoList) {
      let flag = false
      for (let key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          // 测试数据是否可以为数组
          if (
            userInfo.Wusername === username &&
            userInfo.Wpassword === password
          ) {
            this.$store.commit('user/SET_COMPANY_AUTH_INFO', userInfo)
            flag = true
            break
          }
        }
      }
      return flag
    },

    // 点击登录
    async login() {
      await this.axios({
        method: 'post',
        url: '/foo/user/login',
        data: this.loginForm,
      }).then(({ data }) => {
        console.log(data)
        if (data.state == 0) {
          this.$router.push('/UserHome/MyHome')
          this.$store.commit('user/SET_token', data.token)
          this.$store.commit('user/SET_COMPANY_AUTH_INFO', data.results)
        } else alert('登录失败')
      })
    },

    // canvas
    // 随机整数生成器，范围[0, max)
    rInt(max) {
      return Math.floor((Math.random() * 100000) % max)
    },
    // 生成随机表达式
    rCode() {
      let a = this.rInt(100)
      let b = this.rInt(10)
      let op = this.cvs.str.charAt(this.rInt(this.cvs.str.length))
      // 表达式
      let code = `${a}${op}${b}=`
      this.checkCode = code
      // 表达式的值
      // eslint-disable-next-line no-eval
      this.expressValue = eval(code.substr(0, code.length - 1))
      return code
    },
    // 生成随机颜色 rgba格式
    rColor() {
      let a = ((Math.random() * 5 + 5) / 10).toFixed(2)
      return `rgba(${this.rInt(256)}, ${this.rInt(256)}, ${this.rInt(
        256
      )}, ${a})`
    },
    // 验证码图片绘制
    drawCode(domCvs) {
      let _this = this
      // 随机表达式
      let checkCode = this.rCode()
      // 宽设置
      this.cvs.w = 10 + this.cvs.fontSize * this.checkCode.length
      // 判断是否支持canvas
      if (domCvs !== null && domCvs.getContext && domCvs.getContext('2d')) {
        // 设置显示区域大小
        domCvs.style.width = _this.cvs.w
        // 设置画板宽高
        domCvs.setAttribute('width', _this.cvs.w)
        domCvs.setAttribute('height', 60)
        // 画笔
        let pen = domCvs.getContext('2d')
        // 背景: 颜色  区域
        pen.fillStyle = '#eee'
        pen.fillRect(0, 10, _this.cvs.w, _this.cvs.h)
        // 水平线位置
        pen.textBaseline = 'middle' // top middle bottom
        // 内容
        for (let i = 0; i < _this.checkCode.length; i++) {
          pen.fillStyle = _this.rColor() // 随机颜色
          pen.font = `bold ${_this.cvs.fontSize}px 微软雅黑` // 字体设置
          // 字符绘制: (字符, X坐标, Y坐标)
          pen.fillText(
            checkCode.charAt(i),
            10 + _this.cvs.fontSize * i,
            30 + _this.rInt(10)
          )
        }
        // 噪音线
        for (let i = 0; i < _this.cvs.line; i++) {
          // 起点
          pen.moveTo(_this.rInt(_this.cvs.w) / 2, _this.rInt(_this.cvs.h) + 10)
          // 终点
          pen.lineTo(_this.rInt(_this.cvs.w), _this.rInt(_this.cvs.h) + 10)
          // 颜色
          pen.strokeStyle = _this.rColor()
          // 粗细
          pen.lineWidth = '2'
          // 绘制
          pen.stroke()
        }
      } else {
        this.$message.error('不支持验证码格式，请升级或更换浏览器重试')
      }
    },
    // 点击时刷新二维码
    getCode() {
      let domCvs = this.$refs.checkCode
      this.drawCode(domCvs)
    },
    // 点击登录时做的校验
    clickLogin() {
      if (this.inputCode) {
        // eslint-disable-next-line no-eval
        if (eval(this.inputCode) === eval(this.expressValue)) {
          // 验证成功要做的事
          this.$message.success('验证成功')
        } else {
          // 验证码有误
          this.$message.error('验证码输入错误！')
          return
        }
      } else {
        // 输入为空
        this.$message.error('请输入右侧结果')
        return
      }
      this.login()
    },
    // 头像上传base64格式
    getFile(file) {
      const formdata = new FormData()
      formdata.append('files', file.raw)
      this.axios({
        method: `post`,
        url: `/foo/user/upload`,
        data: formdata,
      }).then(({ data }) => {
        this.ruleForm.WimageUrl = data
        console.log(this.ruleForm.WimageUrl)
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

  mounted() {
    this.getCode()
  },
}
</script>

<style lang="less" scoped>
/deep/.el-upload-dragger {
  height: 100%;
}
/deep/.el-upload-list {
  width: 50%;
}
.login_container {
  background-color: #127eea;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 390px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

// 图标样式
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

// 登录重置按钮样式
.btns {
  display: flex;
  justify-content: flex-end;
}

// 用户名、密码输入框样式
.login_form {
  position: absolute;
  bottom: 0;
  width: 90%;
  padding: 0 20px;
  box-sizing: border-box;
}
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
}
// 表单
.from {
  width: 600px;
  background-color: #fff;
  margin: 0 auto;
  padding: 2%;
}
.el-form-item {
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
/deep/.el-dialog {
  margin-top: 2% !important;
  width: 35% ; 
}
</style>
