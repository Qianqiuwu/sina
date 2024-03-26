import Vue from 'vue'
import Vuex from 'vuex'
// 解决刷新数据不丢失的问题插件
// import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
import user from '@/store/modules/user.js'
import admin from '@/store/modules/admin.js'
import Employees from '@/store/modules/Employees.js'
import Supplier from '@/store/modules/Supplier.js'


export default new Vuex.Store({
  modules: {
    user,
    admin,
    Employees,
    Supplier,
  },
  // plugins: [
  //   createPersistedState({
  //     storage: window.sessionStorage,
  //   }),
  // ],
})
