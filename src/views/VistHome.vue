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

<script>
import Header from '../components/vulHomeHeader.vue'
export default {
  name: 'VisHome',
  data() {
    return {
      // 导航栏名称和地址信息
      menulist: [
        {
          id: 1,
          authName: '首页',
          path: 'ViHome/MyHome',
          children: [{ id: 1.1, authName: '首页', path: 'ViHome/MyHome' }],
        },
        {
          id: 3,
          authName: '管理员/采购员',
          path: '#',
          children: [{ id: 3.1, authName: '管理员/采购员', path: 'Adlogin' }],
        },
        {
          id: 4,
          authName: '仓库管理员',
          path: '#',
          children: [{ id: 4.1, authName: '仓库管理员', path: 'Uslogin' }],
        },

        {
          id: 5,
          authName: '员工',
          path: '#',
          children: [{ id: 5.1, authName: '员工', path: 'EmployeesLogin' }],
        },
        {
          id: 6,
          authName: '供应商',
          path: '#',
          children: [{ id: 6.1, authName: '供应商', path: 'SupplierLogin' }],
        },
      ],
      // 图标信息
      Vicon: {
        1: 'el-icon-eleme',
        2: 'el-icon-document',
        3: 'el-icon-user',
        4: 'el-icon-user-solid',
        5: 'el-icon-user',
        6: 'el-icon-user-solid',
      },
    }
  },
  components: {
    Header,
  },
  methods: {},
}
</script>

<style lang="less" scpoe>
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
  // text-align: center;
  // line-height: 160px;
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
