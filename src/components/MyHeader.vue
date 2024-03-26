<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="21"
        ><div class="grid-content bg-purple">
          <h1>宜家便利店的进销存管理系统</h1>
        </div></el-col
      >
      <el-col :span="3"
        ><div class="grid-content bg-purple headersimg">
          <el-avatar :src="userinfo.WimageUrl"></el-avatar>{{ userinfo.username }}
          <el-button type="primary" round @click="Exit">退出</el-button>
          <!-- <a href="#/Adlogin">管理员</a> -->
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    // 返回本地用户数据
    ...mapState('user', ['userinfo']),
  },
  methods: {
    Exit() {
      sessionStorage.removeItem('userinfo')
      this.$store.commit('user/Exit')
      this.$router.push('/Uslogin')
    },
  },
}
</script>

<style lang="less" scoped>
h1 {
  font-size: 30px;
 color: rgb(255, 255, 255);
  padding-left: 2%;
}
.el-button.is-round {
  margin-left: 10%;
}

.headersimg {
  display: flex;
  justify-self: center;
  align-items: center;
  height: 100px;
}
/deep/.el-avatar {
  width: 60px;
  height: 60px;
  img {
    width: 100%;
  }
}
</style>
