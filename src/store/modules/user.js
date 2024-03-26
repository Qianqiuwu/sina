export default {
  namespaced: true,
  action: {},
  mutations: {
    SET_COMPANY_AUTH_INFO(state, data) {
      state.userinfo = data
      sessionStorage.setItem('userinfo', JSON.stringify(data))
    },
    SET_token(state, data) {
      state.token = data
      localStorage.setItem('token', JSON.stringify(data))
    },
    Exit(state) {
      state.userinfo = {}
      state.token = ''
    },
  },
  state: {
    userinfo: JSON.parse(sessionStorage.getItem('userinfo')) || {},
    token: JSON.parse(localStorage.getItem('token')) || {},
  },
  getters: {
    userinfo(state) {
      return state.userinfo
    },
    token(state) {
      return state.token
    },
  },
}
