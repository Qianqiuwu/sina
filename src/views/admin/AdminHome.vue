<template>
  <div id="ViHome">
    <el-container>
      <!-- 头部 -->
      <el-header><Header /></el-header>
      <el-container>
        <el-aside width="300px">
          <el-col>
            <el-col>
              <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#0c1d2f"
                text-color="#fff"
                active-text-color="#ffd04b"
                router
              >
                <!-- 一级导航 -->
                <el-submenu
                  :index="item.id + ''"
                  v-for="item in menulist"
                  :key="item.id"
                >
                  <template slot="title">
                    <i :class="Vicon[item.id]"></i>
                    <span>{{ item.authName }}</span>
                  </template>
                  <!-- 二级标题 -->
                  <el-menu-item
                    :index="'/' + subItem.path"
                    v-for="subItem in item.children"
                    :key="subItem.id"
                  >
                    <template slot="title">
                      <!-- 图标 -->

                      <!-- 文本 -->
                      <span>{{ subItem.authName }}</span>
                    </template>
                  </el-menu-item></el-submenu
                >
              </el-menu>
            </el-col>
          </el-col>
        </el-aside>
        <!-- 内容 -->
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="js">
import Header from '@/components/ADHeader.vue'
export default {
  name: 'VisHome',
  data() {
    return {
      // 导航栏名称和地址信息
      menulist: [
        {
          id: 1,
          authName: '首页',
          path: '',
          children: [{ id: 1.1, authName: '首页', path: 'AdHome/MyHome' }],
        },
        {
          id: 2,
          authName: '个人中心',
          path: '',
           children: [{ id: 2.1, authName: '个人中心', path: 'AdHome/AdminInfo' }],
        },
        {
          id: 3,
          authName: '用户管理',
          path: '',
          children: [
            // { id: 3.1, authName: '仓库管理员', path: 'AdHome/AdVolunteer' },
            { id: 3.2, authName: '供应商', path: 'AdHome/Supplierimfo' }
          ],
        },
        {
          id: 4,
          authName: '商品管理',
          path: '',
          children: [
          { id: 4.1, authName: '商品', path: 'AdHome/ComModity' },
          // { id: 4.2, authName: '活动报名管理', path: 'AdHome/AdActiapply' },
          { id: 4.3, authName: '商品类型管理', path: 'AdHome/CategoryTable' },
        ],
        },
        {
          id: 5,
          authName: '采购管理',
          path: '',
          children: [{ id: 5.1, authName: '采购单', path: 'AdHome/purchase' },
          // { id: 5.2, authName: '活动文章信息/采购单管理', path: 'AdHome/AdActiarticle' },
        // { id: 5.2, authName: '文章阅读量统计', path: 'AdHome/AdActiartical' }
      ],
        },
        {
          id: 6,
          authName: '通知中心',
          path: '',
          children: [{ id: 6.1, authName: '活动报名通知', path: 'AdHome/AdActivitys' }],
        },
      ],
      // 图标信息
      Vicon: {
        1: 'el-icon-eleme',
        2: 'el-icon-document',
        3: 'el-icon-user',
        4: 'el-icon-goods',
        5:'el-icon-s-goods'
      },
    }
  },
  components: {
    Header,
  },
  methods: {

  },
}
</script>

<style lang="less" scpoed>
#ViHome {
  box-sizing: border-box;
  height: 100%;
}
.el-header,
.el-footer {
  background-color: #5b06bd;
  color: #333;
  line-height: 100px;
  height: 100px !important;
}

.el-aside {
  background-color: #0c1d2f;
  color: #333;
  text-align: center;
  line-height: 200px;
  height: 55rem;
  .el-submenu__title {
    font-size: 16px;
  }
  .el-menu {
    border-right: none;
  }
}
.el-aside::-webkit-scrollbar {
  display: none;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  line-height: 48px;
  border: 1px solid #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-container {
  height: 100%;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
