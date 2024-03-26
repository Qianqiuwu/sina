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
          <el-avatar :src="admin.Adimage"></el-avatar>{{ admin.username }}
          <el-button type="primary" round @click="Exit()">退出</el-button>
          <!-- <a href="#/Uslogin">前台</a> -->
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
    ...mapState('admin', ['admin']),
  },
  methods: {
    Exit() {
      sessionStorage.removeItem('admin')
      this.$store.commit('admin/Exit')
      this.$router.push('/Adlogin')
    },
  },
}
</script>

<style lang="less" scpoed>
h1 {
  font-size: 30px;
  color: #000;
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

</style>
