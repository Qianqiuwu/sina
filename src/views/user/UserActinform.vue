<template>
  <div class="UserActinform">
    <div class="from">
      <h1>通知中心</h1>
      <div v-for="item in infomation" :key="item.id">
        <ul @click="drawer = true" style="margin-left: 16px" class="entry-list">
          <div class="entry-title" @click="open(item)">
            {{ item.inforname }}
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      infomation: [],
      drawer: false,
      // 未读消息
      read: [],
      message: '',
    }
  },
  methods: {
    // 初始数据获取当前志愿者的活动信息数据 Actinform
    getActinform() {
      this.axios({
        method: 'get',
        url: `/foo/actinform/getinform/${this.userinfo.uid}`,
      }).then(({ data }) => {
        this.infomation = data.data
        // this.PatchAdmin(this.userinfo.id, data)
      })
    },
    // 消息详情
    /*   open(items) {
      this.read.push(items)
      console.log(items)
      let subItem = Object.values(items.children)[0]
      console.log(subItem)
      if (subItem.checks) {
        this.$notify({
          offset: 100,
          title: `${items.inforname}`,
          dangerouslyUseHTMLString: true,
          message: `<p v-if="subItem.checks"
            >尊敬的 ${subItem.name}同学,你于${subItem.infodatetime}成功通过管理员审核并且成功报名该${subItem.actiname},请于${subItem.actitime}到达${subItem.actispace}参加活动,谢谢您的参于！</p
          > <br><p>${subItem.informcontent}</p>`,
        })
      } else {
        this.$notify({
          offset: 100,
          title: `${items.inforname}`,
          dangerouslyUseHTMLString: true,
          message: `<p v-else
            >尊敬的 ${subItem.name}同学,你于${subItem.infodatetime}未通过管理员审核，未通过原因：${subItem.informcontent}</p
          >`,
        })
      }
    }, */
    open(items) {
      let subItem = Object.values(items.children)[0]
      const title = `${items.inforname}`
      if (subItem.checks) {
        this.message = `尊敬的 ${subItem.name}同学,你于${subItem.infodatetime}成功通过管理员审核并且成功报名该${subItem.actiname},请于${subItem.actitime}到达${subItem.actispace}参加活动,谢谢您的参于！
        ${subItem.informcontent}`
      } else {
        this.message = `尊敬的 ${subItem.name}同学,你于${subItem.infodatetime}未通过管理员审核，未通过原因：${subItem.informcontent}
          `
      }
      var that = this
      // 用户授权和给予通知
      if (Notification.permission != 'granted') {
        Notification.requestPermission().then(function (permission) {
          console.log(permission)
        })
      }
      // 有通知后
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, { body: that.message })
        console.log(notification, 1)
      }
      // 无权限后
      if (Notification.permission === 'denied') {
        console.log('用户拒绝通知')
      }
    },
  },
  computed: { ...mapState('user', ['userinfo']) },
  watch: {},
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
.UserActinform {
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
.entry-title {
  margin: 0 1.3rem;
  border-bottom: 1px solid #e4e6eb;
  line-height: 22px;
  font-size: 1rem;
  font-weight: 400;
  color: #252933;
  text-align: left;
}
.entry-list {
  padding: 0.667rem 0 1.333rem;
}
</style>
